import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    description: v.string(),
    tokenIdentifier: v.string(),
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
});
