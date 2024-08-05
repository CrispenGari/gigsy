import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";
const http = httpRouter();

http.route({
  path: "/attach-file",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const blob = await request.blob();
    const storageId = await ctx.storage.store(blob);
    // Save the storage ID to the database via a mutation
    const type = new URL(request.url).searchParams.get("type") as
      | "document"
      | "image"
      | "audio";
    const chatId = new URL(request.url).searchParams.get("chatId");
    const senderId = new URL(request.url).searchParams.get("senderId");
    const text = new URL(request.url).searchParams.get("text");
    await ctx.runMutation(api.api.message.send, {
      image: type === "image" ? storageId : undefined,
      chatId: chatId! as any,
      senderId: senderId! as any,
      seen: false,
      audio: type === "audio" ? storageId : undefined,
      document: type === "document" ? storageId : undefined,
      text: text || undefined,
    });
    return new Response(JSON.stringify({ success: true }));
  }),
});

export default http;
