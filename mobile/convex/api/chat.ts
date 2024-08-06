import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { chatArguments } from "../tables/chat";
import { paginationOptsValidator } from "convex/server";
import { Id } from "../_generated/dataModel";

const deleteMediaFromStorage = async <
  T extends Id<"_storage">,
  S extends {
    delete: (_id: T) => void;
    getUrl: (storageId: T) => Promise<string | null>;
  },
>(
  _id: T,
  storage: S
): Promise<void> => {
  return new Promise(async (resolve) => {
    const url = await storage.getUrl(_id);
    if (!!url) storage.delete(_id);
    resolve();
  });
};

export const createOrOpen = mutation({
  args: chatArguments,
  handler: async ({ db }, { advertiserId, jobId, jobTitle, userId }) => {
    try {
      const chat = await db
        .query("chats")
        .filter((q) =>
          q.and(
            ...[
              q.eq(q.field("jobId"), jobId),
              q.eq(q.field("advertiserId"), advertiserId),
              q.eq(q.field("userId"), userId),
            ]
          )
        )
        .first();
      if (!!chat) return chat._id;
      const _id = await db.insert("chats", {
        advertiserId,
        jobId,
        jobTitle,
        userId,
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const get = query({
  args: {
    paginationOpts: paginationOptsValidator,
    order: v.union(v.literal("desc"), v.literal("asc")),
    _id: v.optional(v.id("users")),
  },
  handler: async ({ db }, { _id, order, paginationOpts }) => {
    const result = await db
      .query("chats")
      .order(order)
      .filter((q) =>
        q.or(q.eq(q.field("userId"), _id), q.eq(q.field("advertiserId"), _id))
      )
      .paginate(paginationOpts);
    return {
      ...result,
      page: result.page.map((res) => res._id),
    };
  },
});

export const endChat = mutation({
  args: { _id: v.id("chats") },
  handler: async ({ db, storage }, { _id }) => {
    try {
      const messages = await db
        .query("messages")
        .filter((q) => q.eq(q.field("chatId"), _id))
        .collect();
      const _ids = messages
        .map((msg) => {
          if (msg.image) {
            return msg.image;
          }
          if (msg.audio) return msg.audio;
          if (msg.document) return msg.document;
          return undefined;
        })
        .filter(Boolean) as Array<Id<"_storage">>;

      const promises = _ids.map(async (_id) => {
        return await deleteMediaFromStorage(_id, storage);
      });
      await Promise.all(promises);
      await db.delete(_id);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const deleteChat = mutation({
  args: { _id: v.id("chats") },
  handler: async ({ db }, { _id }) => {
    try {
      await db.delete(_id);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});
export const getById = query({
  args: {
    _id: v.id("chats"),
    userId: v.optional(v.id("users")),
  },
  handler: async ({ db }, { _id, userId }) => {
    try {
      const chat = await db
        .query("chats")
        .filter((q) => q.eq(q.field("_id"), _id))
        .first();

      if (!!!chat) return null;
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), chat.userId))
        .first();
      const advertiser = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), chat.advertiserId))
        .first();
      const job = await db
        .query("jobs")
        .filter((q) => q.eq(q.field("_id"), chat.jobId))
        .first();

      const lastMessage = await db
        .query("messages")
        .order("desc")
        .filter((q) => q.eq(q.field("chatId"), chat._id))
        .first();
      const unread = await db
        .query("messages")
        .order("desc")
        .filter((q) =>
          q.and(
            ...[
              q.eq(q.field("chatId"), chat._id),
              q.eq(q.field("seen"), false),
              q.neq(q.field("senderId"), userId),
            ]
          )
        )
        .collect();
      return {
        ...chat,
        unread: unread.length,
        lastMessage,
        user,
        advertiser,
        job,
      };
    } catch (error) {
      return null;
    }
  },
});
