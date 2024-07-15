import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { userArguments } from "../tables/user";

export const findUserOrCreateOne = mutation({
  args: userArguments,
  handler: async ({ db }, args) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), args.id))
        .first();
      if (!!me)
        return {
          _id: me._id,
        };
      const _id = await db.insert("users", args);
      return { _id };
    } catch (error) {
      return { _id: null };
    }
  },
});

export const get = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    return await db
      .query("users")
      .filter((q) => q.eq(q.field("id"), id))
      .first();
  },
});

export const create = mutation({
  args: userArguments,
  handler: async ({ db }, args) => {
    try {
      await db.insert("users", args);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const updateProfilePicture = mutation({
  args: {
    url: v.string(),
    id: v.string(),
  },
  handler: async ({ db }, { id, url }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (!!!me) {
        return { success: false };
      }
      await db.patch(me._id, { image: url });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});
