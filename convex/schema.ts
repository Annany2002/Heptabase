import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    tokenIdentifier: v.string(),
    email: v.string(),
    name: v.string(),
    isPremium: v.optional(v.boolean()),
    questions: v.number(),
    docs: v.number(),
    notes: v.number(),
    searches: v.number(),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),

  documents: defineTable({
    title: v.string(),
    description: v.string(),
    content: v.optional(v.array(v.string())),
    tokenIdentifier: v.optional(v.string()),
    embedding: v.optional(v.array(v.float64())),
    fileId: v.id("_storage"),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 768,
      filterFields: ["tokenIdentifier"],
    }),

  notes: defineTable({
    text: v.string(),
    tokenIdentifier: v.string(),
    embedding: v.optional(v.array(v.float64())),
  })
    .index("by_tokenIdentifier", ["tokenIdentifier"])
    .vectorIndex("by_embedding", {
      vectorField: "embedding",
      dimensions: 768,
      filterFields: ["tokenIdentifier"],
    }),

  chats: defineTable({
    documentId: v.id("documents"),
    tokenIdentifier: v.string(),
    text: v.string(),
    isHuman: v.boolean(),
  }).index("by_documentId_tokenIdentifier", ["documentId", "tokenIdentifier"]),

  tokens: defineTable({
    code: v.string(),
    createdAt: v.number(),
    expiredAt: v.number(),
    tokenIdentifier: v.optional(v.string()),
  }).index("by_tokenIdentifier", ["tokenIdentifier"]),
});
