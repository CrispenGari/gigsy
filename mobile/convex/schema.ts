import { defineSchema } from "convex/server";
import { user } from "./tables/user";
import { jobs } from "./tables/job";
import { wishlists } from "./tables/whishlist";
import { reasons } from "./tables/reason";
import { feedbacks } from "./tables/feedback";
import { notifications } from "./tables/notification";

export default defineSchema(
  {
    // other tables here
    users: user,
    jobs,
    wishlists,
    reasons,
    feedbacks,
    notifications,
  },
  { schemaValidation: true, strictTableNameTypes: true }
);
