import { ConvexError, v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

export const createUser = internalMutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
  },
  async handler(ctx, args) {
    const userExists = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (userExists) {
      throw new ConvexError("User already exists");
    }
    await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
      name: args.name,
      email: args.email,
      isPremiun: false,
      docs: 0,
      questions: 0,
      notes: 0,
      searches: 0,
    });
  },
});

export const getUser = query({
  async handler(ctx) {
    const tokenIdentifier = (
      await ctx.auth.getUserIdentity()
    ).tokenIdentifier.split("|")[1];

    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
      )
      .first();
  },
});

export const updateUserUsage = internalMutation({
  args: {
    val: v.string(),
  },
  async handler(ctx, args) {
    const tokenIdentifier = (
      await ctx.auth.getUserIdentity()
    ).tokenIdentifier.split("|")[1];

    const userExists = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier)
      )
      .first();
    if (!userExists) {
      throw new ConvexError("User does not exists");
    }

    if (args.val === "questions") {
      const prevCount = userExists.questions;
      await ctx.db.patch(userExists._id, {
        questions: prevCount + 1,
      });
    } else if (args.val === "searches") {
      const prevCount = userExists.searches;
      await ctx.db.patch(userExists._id, {
        searches: prevCount + 1,
      });
    } else if (args.val === "notes") {
      const prevCount = userExists.notes;
      await ctx.db.patch(userExists._id, {
        notes: prevCount + 1,
      });
    } else {
      const prevCount = userExists.docs;
      await ctx.db.patch(userExists._id, {
        docs: prevCount + 1,
      });
    }
  },
});
