import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { paginationOptsValidator } from "convex/server";
import { messageArguments } from "../tables/message";
import { Id } from "../_generated/dataModel";

const asyncFunction = async <
  T extends Id<"messages">,
  D extends {
    patch: (id: T, payload: { seen: boolean }) => void;
  },
>(
  id: T,
  db: D
): Promise<void> => {
  return new Promise((resolve) => {
    db.patch(id, { seen: true });
    resolve();
  });
};

export const send = mutation({
  args: messageArguments,
  handler: async ({ db }, args) => {
    try {
      const _id = await db.insert("messages", {
        ...args,
      });
      return _id;
    } catch (error) {
      return null;
    }
  },
});

export const chatMessages = query({
  args: {
    paginationOpts: paginationOptsValidator,
    chatId: v.optional(v.id("chats")),
  },
  handler: async ({ db }, { paginationOpts, chatId }) => {
    const result = await db
      .query("messages")
      .filter((q) => q.eq(q.field("chatId"), chatId))
      .order("desc")
      .paginate(paginationOpts);
    return {
      ...result,
      page: result.page.map((res) => res._id),
    };
  },
});

export const readMessages = mutation({
  args: {
    chatId: v.optional(v.id("chats")),
    id: v.string(),
  },
  handler: async ({ db }, { chatId, id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();
      if (!!!user) return { success: false };

      const unread = await db
        .query("messages")
        .filter((q) =>
          q.and(
            ...[
              q.eq(q.field("chatId"), chatId),
              q.neq(q.field("senderId"), user._id),
              q.eq(q.field("seen"), false),
            ]
          )
        )
        .collect();
      const promises = unread.map(async ({ _id }) => {
        return await asyncFunction(_id, db);
      });
      await Promise.all(promises);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

export const get = query({
  args: { _id: v.id("messages") },
  handler: async ({ db, storage }, { _id }) => {
    try {
      const msg = await db
        .query("messages")
        .filter((q) => q.eq(q.field("_id"), _id))
        .first();

      if (!!!msg) return null;

      const sender = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), msg.senderId))
        .first();
      return {
        ...msg,
        image: msg.image && (await storage.getUrl(msg.image)),
        document: msg.document && (await storage.getUrl(msg.document)),
        audio: msg.audio && (await storage.getUrl(msg.audio)),
        sender,
      };
    } catch (error) {
      return null;
    }
  },
});

export const count = query({
  args: { id: v.string() },
  handler: async ({ db }, { id }) => {
    try {
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("id"), id))
        .first();

      if (!user) return undefined;

      const chats = await db
        .query("chats")
        .filter((q) =>
          q.or(
            q.eq(q.field("userId"), user._id),
            q.eq(q.field("advertiserId"), user._id)
          )
        )
        .collect();

      if (!chats.length) return undefined;

      const unreadMessagesPromises = chats.map((chat) =>
        db
          .query("messages")
          .filter((q) =>
            q.and(
              q.eq(q.field("chatId"), chat._id),
              q.neq(q.field("senderId"), user._id),
              q.eq(q.field("seen"), false)
            )
          )
          .collect()
      );

      const unreadMessagesArrays = await Promise.all(unreadMessagesPromises);
      const unreadMessages = unreadMessagesArrays.flat();
      return unreadMessages.length;
    } catch (error) {
      return undefined;
    }
  },
});
