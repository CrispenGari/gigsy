import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userArguments = {
  firstName: v.string(),
  lastName: v.string(),
  id: v.string(),
  email: v.string(),
  image: v.string(),
  verified: v.boolean(),
};
export const user = defineTable(userArguments);
