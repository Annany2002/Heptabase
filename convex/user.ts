import { ConvexError, v } from "convex/values";
import { internalMutation } from "./_generated/server";

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
    });
  },
});
