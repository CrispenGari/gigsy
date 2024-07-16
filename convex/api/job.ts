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
      return jobs.map(({ _id }) => _id);
    } catch (error) {
      return [];
    }
  },
});

export const getById = query({
  args: { id: v.id("jobs") },
  handler: async ({ db }, { id }) => {
    try {
      const job = await db
        .query("jobs")
        .filter((q) => q.eq(q.field("_id"), id))
        .unique();
      return job;
    } catch (error) {
      return null;
    }
  },
});

export const getJobById = query({
  args: { id: v.id("jobs") },
  handler: async ({ db }, { id }) => {
    try {
      const job = await db
        .query("jobs")
        .filter((q) => q.eq(q.field("_id"), id))
        .unique();
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), job?.userId))
        .unique();

      return {
        ...job,
        user,
      };
    } catch (error) {
      return null;
    }
  },
});
export const deleteById = mutation({
  args: { id: v.id("jobs") },
  handler: async ({ db }, { id }) => {
    try {
      await db.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});
