import { defineSchema } from "convex/server";
import { user } from "./tables/user";
import { jobs } from "./tables/job";
import { wishlists } from "./tables/whishlist";
import { reasons } from "./tables/reason";
import { feedbacks } from "./tables/feedback";
import { notifications } from "./tables/notification";
import { chats } from "./tables/chat";
import { messages } from "./tables/message";

export default defineSchema(
  {
    // other tables here
    users: user,
    jobs,
    wishlists,
    reasons,
    feedbacks,
    notifications,
    chats,
    messages,
  },
  { schemaValidation: true, strictTableNameTypes: true }
);
