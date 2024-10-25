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
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { ConvexError, v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { embed } from "./notes";

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const hasOrgAccess = async (
  ctx: MutationCtx | QueryCtx,
  orgId: string
) => {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return false;
  }

  const membership = await ctx.db
    .query("memberships")
    .withIndex("by_orgId_userId", (q) =>
      q.eq("orgId", orgId).eq("userId", userId)
    )
    .first();

  return !!membership;
};

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<"documents">
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return null;
  }

  const document = await ctx.db.get(documentId);

  if (!document) return null;

  if (document.orgId) {
    const hasAccess = await hasOrgAccess(ctx, document.orgId);
    if (!hasAccess) {
      throw new ConvexError("Unauthorized");
    } else {
      if (document.tokenIdentifier !== userId) {
        throw new ConvexError("Unauthorized");
      }
    }

    return { document, userId };
  }
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
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("Not Authenticated");
    }

    let documentId: Id<"documents">;

    if (args.orgId) {
      const isMember = await hasOrgAccess(ctx, args.orgId);
      if (!isMember) {
        throw new ConvexError("Unauthorized");
      }
      documentId = await ctx.db.insert("documents", {
        title: args.title,
        tokenIdentifier: userId,
        fileId: args.fileId,
        description: "",
        orgId: args.orgId,
      });
    } else {
      documentId = await ctx.db.insert("documents", {
        title: args.title,
        tokenIdentifier: userId,
        fileId: args.fileId,
        description: "",
      });
    }

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

    if (!file) {
      throw new ConvexError("File Not Found");
    }

    const text = await file.text();

    const prompt = `Here is a document. Please provide a very short and concise description of the document: \n${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const resText = response.text();

    const embedding = await embed(resText);

    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      description: resText,
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
  args: {
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return undefined;
    }

    if (args.orgId) {
      const isMember = await hasOrgAccess(ctx, args.orgId);
      if (!isMember) {
        return null;
      }
      return await ctx.db
        .query("documents")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .collect();
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

    if (!obj) return null;

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

    await ctx.storage.delete(obj.document.fileId);
    await ctx.db.delete(args.documentId);
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    console.log(process.env.API_KEY);
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

    const text = await file.text();
    console.log(text);

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: `${text} \nTake reference from this document and answer the following: \n`,
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
    const response = await result.response;
    const res = response.text();

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
