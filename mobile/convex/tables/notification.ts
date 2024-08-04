import { defineTable } from "convex/server";
import { v } from "convex/values";

const notificationArguments = {
  userId: v.id("users"),
  title: v.string(),
  read: v.boolean(),
  body: v.string(),
};

export const notifications = defineTable(notificationArguments).index(
  "userId",
  ["userId"]
);

export type TNotifications = typeof notifications;
