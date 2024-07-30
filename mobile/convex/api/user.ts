import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { userArguments } from "../tables/user";
import { Id } from "../_generated/dataModel";

const asyncFunction = async <
  T extends Id<"jobs" | "wishlists">,
  D extends { delete: (id: T) => void },
>(
  id: T,
  db: D
): Promise<void> => {
  return new Promise((resolve) => {
    db.delete(id);
    resolve();
  });
};

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

export const verifyProfile = mutation({
  args: { id: v.id("users") },
  handler: async ({ db }, { id }) => {
    try {
      await db.patch(id, { verified: true });
      return true;
    } catch (error) {
      return false;
    }
  },
});

const userUpdatableValues = {
  firstName: v.string(),
  lastName: v.string(),
  email: v.string(),
};
export const update = mutation({
  args: { id: v.string(), values: v.object(userUpdatableValues) },
  handler: async ({ db }, { id, values }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();

      if (!!!user) return false;
      await db.patch(user._id, { ...values });
      return true;
    } catch (error) {
      return false;
    }
  },
});

export const deleteUser = mutation({
  args: { id: v.string(), reason: v.string() },
  handler: async ({ db }, { id, reason }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();

      if (!!!user) return true;
      // delete related models
      // 1. jobs, wishlist
      const wishlist = await db
        .query("wishlists")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();

      const jobs = await db
        .query("jobs")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      const promises = [...wishlist, ...jobs].map(async ({ _id }: any) => {
        return await asyncFunction(_id, db);
      });
      await Promise.all(promises);

      await db.insert("reasons", { reason });

      await db.delete(user._id);
      return true;
    } catch (error) {
      return false;
    }
  },
});

export const getById = query({
  args: { id: v.id("users") },
  handler: async ({ db }, { id }) => {
    return await db
      .query("users")
      .filter((q) => q.eq(q.field("_id"), id))
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

export const userAdverts = query({
  args: {
    id: v.string(),
  },
  handler: async ({ db }, { id }) => {
    try {
      const me = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (!!!me) return { jobs: [] };
      const jobs = await db
        .query("jobs")
        .filter((q) => q.eq(q.field("userId"), me?._id))
        .collect();
      return { jobs };
    } catch (error) {
      return { jobs: [] };
    }
  },
});
