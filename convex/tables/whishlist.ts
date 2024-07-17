import { defineTable } from "convex/server";
import { v } from "convex/values";

const wishlistArguments = {
  userId: v.id("users"),
  jobId: v.id("jobs"),
};

export const wishlists = defineTable(wishlistArguments)
  .index("userId", ["userId"])
  .index("jobId", ["jobId"]);

export type TWishList = typeof wishlists;
