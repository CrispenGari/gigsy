import { defineTable } from "convex/server";
import { v } from "convex/values";

export const reasonArguments = {
  reason: v.string(),
};
export const reasons = defineTable(reasonArguments);
