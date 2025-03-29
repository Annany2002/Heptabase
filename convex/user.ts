import { ConvexError, v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

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
      isPremium: false,
      docs: 0,
      questions: 0,
      notes: 0,
      searches: 0,
    });
  },
});

export const getUser = query({
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      return null;
    }

    const tokenIdentifier = identity.tokenIdentifier.split("|")[1];

    return await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", tokenIdentifier!)
      )
      .first();
  },
});

export const updateUserUsage = internalMutation({
  args: {
    val: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new ConvexError("Unauthenticated");
    }

    const tokenIdentifier = identity.tokenIdentifier.split("|")[1];

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

export const updateMembership = mutation({
  args: {
    userId: v.id("users"),
  },
  async handler(ctx, args) {
    const user = await ctx.db.get(args.userId);

    if (!user) {
      throw new ConvexError("User not found");
    }

    await ctx.db.patch(user._id, {
      isPremium: true,
    });
  },
});
