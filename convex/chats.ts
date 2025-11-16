import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const getChatsForDocument = query({
  args: {
    documentId: v.id("documents"),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) return [];

    return await ctx.db
      .query("chats")
      .withIndex("by_documentId_tokenIdentifier", (q) =>
        q.eq("documentId", args.documentId).eq("tokenIdentifier", userId)
      )
      .collect();
  },
});

export const createChatRecord = internalMutation({
  args: {
    documentId: v.id("documents"),
    text: v.string(),
    isHuman: v.boolean(),
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    const chatId = await ctx.db.insert("chats", {
      documentId: args.documentId,
      text: args.text,
      isHuman: args.isHuman,
      tokenIdentifier: args.tokenIdentifier,
    });
    return chatId;
  },
});

export const updateChatText = internalMutation({
  args: {
    chatId: v.id("chats"),
    text: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.chatId, {
      text: args.text,
    });
  },
});
