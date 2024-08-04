//  userId, jobId, advertiserId, jobTitle;

import { defineTable } from "convex/server";
import { v } from "convex/values";

export const chatArguments = {
  userId: v.id("users"),
  advertiserId: v.id("users"),
  jobId: v.id("jobs"),
  jobTitle: v.string(),
};

export const chats = defineTable(chatArguments)
  .index("userId", ["userId"])
  .index("advertiserId", ["advertiserId"])
  .index("jobId", ["jobId"]);

export type TChat = typeof chats;
