import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { jobArguments } from "../tables/job";

export const publish = mutation({
  args: jobArguments,
  handler: async ({ db }, args) => {
    try {
      await db.insert("jobs", args);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  },
});

export const get = query({
  args: { limit: v.number() },
  handler: async ({ db }, { limit }) => {
    try {
      const jobs = await db.query("jobs").order("desc").take(limit);
      return {
        jobs,
      };
    } catch (error) {
      return {
        jobs: [],
      };
    }
  },
});
