import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { embed } from "./notes";
import { api, internal } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

export const searchAction = action({
  args: {
    searchQuery: v.string(),
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError("User not found");
    }

    if (args.orgId) {
      const hasAccess = await ctx.runQuery(
        internal.memberships.hasOrgAccessQuery,
        {
          orgId: args.orgId,
        }
      );

      if (!hasAccess) {
        return null;
      }
    }

    const filter = args.orgId
      ? (q: any) => q.eq("orgId", args.orgId)
      : (q: any) => q.eq("tokenidentifier", userId);

    const embedding = await embed(args.searchQuery);

    const noteResults = await ctx.vectorSearch("notes", "by_embedding", {
      vector: embedding,
      limit: 16,
      filter,
    });

    const documentResults = await ctx.vectorSearch(
      "documents",
      "by_embedding",
      {
        vector: embedding,
        limit: 16,
        filter,
      }
    );

    const records: (
      | { type: "notes"; score: number; record: Doc<"notes"> }
      | { type: "documents"; score: number; record: Doc<"documents"> }
    )[] = [];

    await Promise.all(
      noteResults.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
          noteId: result._id,
        });
        if (!note) {
          return;
        }
        records.push({ type: "notes", score: result._score, record: note });
      })
    );

    await Promise.all(
      documentResults.map(async (doc) => {
        const document = await ctx.runQuery(api.documents.getDocument, {
          documentId: doc._id,
        });
        if (!document) {
          return;
        }
        records.push({
          type: "documents",
          score: doc._score,
          record: document,
        });
      })
    );

    records.sort((a, b) => b.score - a.score);

    return records;
  },
});
