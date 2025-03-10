import { ConvexError, v } from "convex/values";
import {
  internalAction,
  internalMutation,
  mutation,
  query,
} from "./_generated/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { internal } from "./_generated/api";

const genAI = new GoogleGenerativeAI(process.env.API_KEY as string);

const model = genAI.getGenerativeModel({ model: "text-embedding-004" });

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
