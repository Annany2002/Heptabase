import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { embed } from "./notes";
import { arrayBufferToBase64 } from "../lib/utils";

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return null;
  }

  const document = await ctx.db.get(documentId);

  if (!document) {
    return null;
  }

  if (document.tokenIdentifier !== userId) {
    throw new ConvexError("Unauthorized");
  }

  return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const createDocument = mutation({
  args: {
    title: v.string(),
    fileId: v.id("_storage"),
    description: v.string(),
    content: v.optional(v.array(v.string())),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("Not Authenticated");
    }

    const documentId = await ctx.db.insert("documents", {
      title: args.title,
      tokenIdentifier: userId,
      fileId: args.fileId,
      description: "",
      content: args.content,
    });

    await ctx.runMutation(internal.user.updateUserUsage, {
      val: "docs",
    });

    await ctx.scheduler.runAfter(
      0,
      internal.documents.generateDocumentDescription,
      {
        fileId: args.fileId,
        documentId,
      }
    );
  },
});

export const generateDocumentDescription = internalAction({
  args: {
    fileId: v.id("_storage"),
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const file = await ctx.storage.get(args.fileId);

    const url = await ctx.storage.getUrl(args.fileId);

    if (!file || !url) {
      throw new ConvexError("File Not Found");
    }

    const pdfResp = await fetch(url).then((response) => response.arrayBuffer());
    const base64Data = arrayBufferToBase64(pdfResp);

    const result = await model.generateContent([
      {
        inlineData: {
          data: base64Data,
          mimeType: "application/pdf",
        },
      },
      "Summarize this document in short",
    ]);

    const embedding = await embed(result.response.text());

    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      description: result.response.text(),
      embedding,
    });
  },
});

export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id("documents"),
    description: v.string(),
    embedding: v.array(v.float64()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      description: args.description,
      embedding: args.embedding,
    });
  },
});

export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("User not authenticated");
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", userId))
      .collect();
  },
});

export const getDocument = query({
  args: {
    documentId: v.id("documents"),
  },

  async handler(ctx, args) {
    const obj = await hasAccessToDocument(ctx, args.documentId);

    if (!obj) {
      return null;
    }

    return {
      ...obj.document,
      documentUrl: await ctx.storage.getUrl(obj.document.fileId),
    };
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const obj = await hasAccessToDocument(ctx, args.documentId);

    if (!obj) {
      console.log("Unauthorized");
      throw new ConvexError("Unauthorized");
    }

    const userId = obj.userId;

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_documentId_tokenIdentifier", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    for (const chat of chats) {
      if (chat.tokenIdentifier === userId) {
        await ctx.db.delete(chat._id);
      }
    }
    await ctx.storage.delete(obj.document.fileId);
    await ctx.db.delete(args.documentId);
  },
});

const prompt = `
You are an expert document analyst tasked with answering questions based solely on the content of a provided PDF document. Your goal is to provide accurate and comprehensive answers while strictly adhering to the information contained within the document.

**Instructions:**

1.  **Document Analysis:**
    * Carefully analyze the provided PDF document.
    * Extract all relevant information and store it in your internal memory.
    * Pay close attention to context, relationships between different sections, and any implied information.
    * Be mindful of the document's structure, including headings, paragraphs, tables, figures, and any other visual elements.

2.  **Question Answering:**
    * You will be presented with a question related to the content of the PDF.
    * Thoroughly understand the question and identify the specific information required to answer it.
    * Search the information extracted from the PDF to find the answer.

3.  **Answering Guidelines:**
    * **Direct Answers:** If the answer is explicitly stated within the PDF, provide the answer verbatim or in a concise paraphrase, citing the specific location (e.g., page number, section heading) of the information.
    * **Inferred Answers:** If the answer can be logically inferred or derived from the information within the PDF, provide the inferred answer. Clearly explain the reasoning and cite the specific information used for the inference.
    * **Contextual Answers:** Consider the context of the question and provide answers that are relevant to the document's overall theme and purpose.
    * **Negative Answers:** If the answer is not found or cannot be reasonably inferred from the information within the PDF, state clearly and precisely: "The answer to this question is not available within the provided PDF document." Do not provide any external information.
    * **Accuracy:** Ensure the accuracy of your answers. Double-check the information extracted from the PDF to avoid errors or misinterpretations.
    * **Precision:** Be precise in your answers. Avoid vague or ambiguous statements.
    * **Clarity:** Write your answers in clear and concise language.
    * **Avoid Assumptions:** Do not make any assumptions beyond the information provided in the PDF.
    * **Citation:** When quoting or referencing specific information from the PDF, cite the page number, section heading, or any other relevant identifier.

4.  **Output Format:**
    * Begin by restating the question.
    * Then, provide the answer, adhering to the guidelines above.
    * If you must infer, explain the reasoning.
    * If the answer is not in the PDF, state that, and do not provide outside information.

**Example:**

**PDF Document:** [Insert PDF document here]

**Question:** What is the primary cause of the observed phenomenon described in section 3?

**Expected Output:**

"Question: What is the primary cause of the observed phenomenon described in section 3?

Answer: According to section 3 of the PDF, the primary cause of the observed phenomenon is [answer directly from PDF].

OR

Answer: The answer to this question is not available within the provided PDF document."

**Important:** Do not provide any information that is not explicitly stated or logically inferable from the provided PDF document.
`;

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const obj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      {
        documentId: args.documentId,
      }
    );

    if (!obj) {
      throw new ConvexError("Unauthorized");
    }

    const file = await ctx.storage.get(obj.document.fileId);

    if (!file) {
      throw new ConvexError("File Not Found");
    }

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `\n ${prompt}\n 
              ${obj.document.content} \n
              Take reference from this document and answer the following:
               \n`,
            },
          ],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
    });

    const msg = `${args.question}`;

    const result = await chat.sendMessage(msg);
    const response = result.response;
    const res = response.text();

    await ctx.runMutation(internal.user.updateUserUsage, {
      val: "questions",
    });

    //HUMAN
    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: obj.userId,
    });

    //AI
    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: res,
      isHuman: false,
      tokenIdentifier: obj.userId,
    });

    return res;
  },
});
