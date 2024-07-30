import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";
import { hasOrgAccess } from "./documents";
import { Doc, Id } from "./_generated/dataModel";

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

export const getNotes = query({
  args: {
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) return null;

    if (args.orgId) {
      const hasAccess = await hasOrgAccess(ctx, args.orgId);

      if (!hasAccess) {
        return null;
      }

      const notes = await ctx.db
        .query("notes")
        .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
        .collect();
      return notes;
    } else {
      const notes = await ctx.db
        .query("notes")
        .withIndex("by_tokenIdentifier")
        .order("desc")
        .collect();

      return notes;
    }
  },
});

export const embed = async (text: string) => {
  const embedding = await model.embedContent(text);
  return embedding.embedding.values;
};

export const setNoteEmbeddings = internalMutation({
  args: {
    noteId: v.id("notes"),
    embedding: v.array(v.number()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.noteId, {
      embedding: args.embedding,
    });
  },
});

export const createNoteEmbeddings = internalAction({
  args: {
    noteId: v.id("notes"),
    text: v.string(),
  },
  async handler(ctx, args) {
    const embedding = await embed(args.text);

    await ctx.runMutation(internal.notes.setNoteEmbeddings, {
      noteId: args.noteId,
      embedding,
    });
  },
});

export const createNote = mutation({
  args: {
    text: v.string(),
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("User not found");
    }

    let noteId: Id<"notes">;
    if (args.orgId) {
      const hasAccess = await hasOrgAccess(ctx, args.orgId);

      if (!hasAccess) {
        throw new ConvexError("Unauthorized");
      }

      noteId = await ctx.db.insert("notes", {
        text: args.text,
        orgId: args.orgId,
      });
    } else {
      noteId = await ctx.db.insert("notes", {
        text: args.text,
        tokenIdentifier: userId,
      });

      await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbeddings, {
        noteId,
        text: args.text,
      });
    }
  },
});

export const getNote = query({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) return null;

    if (note.orgId) {
      const hasAccess = await hasOrgAccess(ctx, note.orgId);
      if (!hasAccess) {
        return null;
      }
    } else {
      if (note?.tokenIdentifier !== userId) {
        return null;
      }
    }

    return note;
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id("notes"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("Please login to use this service");
    }

    const note = await ctx.db.get(args.noteId);
    if (!note) {
      throw new ConvexError("Note not found");
    }

    await assertAccessToOrg(ctx, note);

    await ctx.db.delete(args.noteId);
  },
});

async function assertAccessToOrg(
  ctx: QueryCtx | MutationCtx,
  note: Doc<"notes">
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    throw new ConvexError("Please login to use this service");
  }
  if (note.orgId) {
    const hasAccess = await hasOrgAccess(ctx, note.orgId);

    if (!hasAccess) {
      throw new ConvexError("Unauthorized");
    }
  } else {
    if (note.tokenIdentifier !== userId) {
      throw new ConvexError("Unauthorized");
    }
  }
}
