import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const insertToken = mutation({
  args: {
    code: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
  },
  async handler(ctx, args) {
    const user = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!user) {
      throw new ConvexError("Unauthenticated");
    }

    await ctx.db.insert("tokens", {
      code: args.code,
      createdAt: args.createdAt,
      status: "Available",
      expiresAt: args.expiresAt,
    });
  },
});

// export const getTokens = query({
//   async handler(ctx) {
//     const user = (await ctx.auth.getUserIdentity()).tokenIdentifier;

//     if (!user) {
//       throw new ConvexError("Unauthenticated");
//     }

//     return await ctx.db
//       .query("tokens")
//       .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", user))
//       .collect();
//   },
// });

// // export const checkExpiration =
