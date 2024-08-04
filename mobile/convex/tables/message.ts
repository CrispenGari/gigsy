import { defineTable } from "convex/server";
import { v } from "convex/values";

const messageArguments = {
  senderId: v.id("users"),
  chatId: v.id("chats"),
  text: v.optional(v.string()),
  image: v.optional(v.string()),
  audio: v.optional(v.string()),
  seen: v.boolean(),
};

export const messages = defineTable(messageArguments)
  .index("senderId", ["senderId"])
  .index("chatId", ["chatId"]);

export type TChat = typeof messages;
