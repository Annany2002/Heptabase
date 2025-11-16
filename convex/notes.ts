import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { internal } from "./_generated/api";
import { genAI } from "./documents";

export const getNotes = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    return await ctx.db
      .query("notes")
      .withIndex("by_tokenIdentifier")
      .order("desc")
      .collect();
  },
});

export const embed = async (text: string) => {
  const embedding = await genAI.models.embedContent({ model: 'gemini-embedding-001', contents: text, config: { outputDimensionality: 768, } });
  if (!embedding.embeddings || embedding.embeddings.length === 0) {
    throw new Error("Failed to generate embedding");
  }
  return embedding.embeddings[0].values;
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
    const embedding = await embed(args.text) as number[];

    await ctx.runMutation(internal.notes.setNoteEmbeddings, {
      noteId: args.noteId,
      embedding,
    });
  },
});

export const createNote = mutation({
  args: {
    text: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("User not found");
    }

    const noteId = await ctx.db.insert("notes", {
      text: args.text,
      tokenIdentifier: userId,
    });

    await ctx.runMutation(internal.user.updateUserUsage, {
      val: "notes",
    });

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbeddings, {
      noteId,
      text: args.text,
    });
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
    if (!note || note?.tokenIdentifier !== userId) {
      return null;
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

    await ctx.db.delete(args.noteId);
  },
});
