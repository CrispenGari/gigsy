import { v } from "convex/values";
import { mutation, query } from "../_generated/server";

export const getMyWishLists = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .unique();
      if (!!!user) return [];
      const wishlists = await db
        .query("wishlists")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();

      return wishlists;
    } catch (error) {
      return [];
    }
  },
});

const asyncFunction = async <T>(id: T, db: any): Promise<void> => {
  return new Promise((resolve) => {
    db.delete(id);
    resolve();
  });
};
export const clear = mutation({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .unique();
      if (!!!user) return false;
      const res = await db
        .query("wishlists")
        .filter((q) => q.eq(q.field("userId"), user._id))
        .collect();
      const promises = res.map(async ({ _id }) => {
        return await asyncFunction(_id, db);
      });
      await Promise.all(promises);
      return true;
    } catch (error) {
      return false;
    }
  },
});
export const get = query({
  args: { id: v.id("wishlists") },
  handler: async ({ db }, { id }) => {
    try {
      const wishlists = await db
        .query("wishlists")
        .filter((q) => q.eq(q.field("_id"), id))
        .collect();
      return wishlists;
    } catch (error) {
      return [];
    }
  },
});
export const add = mutation({
  args: { userId: v.string(), jobId: v.id("jobs") },
  handler: async ({ db }, { userId, jobId }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), userId))
        .unique();

      if (!!!user) return null;

      await db.insert("wishlists", { jobId, userId: user._id });
      const wishlist = await db
        .query("wishlists")
        .filter((q) =>
          q.and(q.eq(q.field("jobId"), jobId), q.eq(q.field("userId"), userId))
        )
        .unique();
      return wishlist;
    } catch (error) {
      return null;
    }
  },
});

export const remove = mutation({
  args: { userId: v.string(), jobId: v.id("jobs") },
  handler: async ({ db }, { userId, jobId }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), userId))
        .unique();

      if (!!!user) return null;
      const wishlist = await db
        .query("wishlists")
        .filter((q) =>
          q.and(
            q.eq(q.field("jobId"), jobId),
            q.eq(q.field("userId"), user._id)
          )
        )
        .unique();
      if (!!!wishlist) return null;
      await db.delete(wishlist._id);
      return wishlist;
    } catch (error) {
      return null;
    }
  },
});
