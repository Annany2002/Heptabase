import { ConvexError, v } from "convex/values";
import {
  internalQuery,
  mutation,
  MutationCtx,
  query,
  QueryCtx,
} from "./_generated/server";

const checkUserIdentity = async (ctx: MutationCtx | QueryCtx) => {
  const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  return user ?? null;
};

export const insertToken = mutation({
  args: {
    code: v.string(),
    createdAt: v.string(),
    expiresAt: v.string(),
  },
  async handler(ctx, args) {
    const user = checkUserIdentity(ctx);
    if (!user) {
      throw new ConvexError("Not Admin");
    }

    await ctx.db.insert("tokens", {
      code: args.code,
      createdAt: args.createdAt,
      status: "Available",
      expiresAt: args.expiresAt,
    });
  },
});

export const getTokens = query({
  async handler(ctx) {
    const user = checkUserIdentity(ctx);
    if (!user) {
      throw new ConvexError("Not Admin");
    }

    return await ctx.db.query("tokens").collect();
  },
});

export const deleteToken = mutation({
  args: {
    tokenId: v.id("tokens"),
  },
  async handler(ctx, args) {
    const user = checkUserIdentity(ctx);
    if (!user) {
      throw new ConvexError("Not Admin");
    }

    await ctx.db.delete(args.tokenId);
  },
});

export const validateToken = internalQuery({
  args: {
    code: v.string(),
  },
  handler(ctx, args) {
    const user = checkUserIdentity(ctx);
    if (!user) {
      throw new ConvexError("Not Admin");
    }

    const isValidToken = ctx.db
      .query("tokens")
      .filter((q) => q.eq(q.field("code"), args.code))
      .first();

    return isValidToken;
  },
});
