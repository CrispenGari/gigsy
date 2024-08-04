import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { Id } from "../_generated/dataModel";
import { paginationOptsValidator } from "convex/server";

const asyncFunction = async <
  T extends Id<"users">,
  D extends {
    insert: (
      tableName: "notifications",
      values: { userId: T; body: string; title: string; read: boolean }
    ) => void;
  },
>(
  { _id, body, title }: { _id: T; body: string; title: string },
  db: D
): Promise<void> => {
  return new Promise((resolve) => {
    db.insert("notifications", {
      body,
      read: false,
      title,
      userId: _id,
    });
    resolve();
  });
};

export const broadcast = mutation({
  args: { title: v.string(), body: v.string() },
  handler: async ({ db }, { title, body }) => {
    try {
      const payload = await db.query("users").collect();
      const ids = payload.map(({ _id }) => _id);
      const promises = ids.map(async (_id) => {
        return await asyncFunction({ _id, title, body }, db);
      });
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const read = mutation({
  args: { _id: v.id("notifications") },
  handler: async ({ db }, { _id }) => {
    try {
      await db.patch(_id, { read: true });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const deleteNotification = mutation({
  args: { _id: v.id("notifications") },
  handler: async ({ db }, { _id }) => {
    try {
      await db.delete(_id);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    order: v.union(v.literal("desc"), v.literal("asc")),
    _id: v.id("users"),
  },
  handler: async ({ db }, { _id, order, paginationOpts }) => {
    const result = await db
      .query("notifications")
      .order(order)
      .filter((q) => q.eq(q.field("userId"), _id))
      .paginate(paginationOpts);
    return {
      ...result,
      page: result.page.map((res) => res._id),
    };
  },
});

export const getById = query({
  args: {
    _id: v.id("notifications"),
  },
  handler: async ({ db }, { _id }) => {
    return await db
      .query("notifications")
      .filter((q) => q.eq(q.field("_id"), _id))
      .first();
  },
});

export const count = query({
  args: {
    _id: v.id("users"),
  },
  handler: async ({ db }, { _id }) => {
    const res = await db
      .query("notifications")
      .filter((q) =>
        q.and(q.eq(q.field("userId"), _id), q.eq(q.field("read"), false))
      )
      .collect();
    return res.length;
  },
});
