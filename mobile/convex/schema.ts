import { defineSchema } from "convex/server";
import { user } from "./tables/user";
import { jobs } from "./tables/job";
import { wishlists } from "./tables/whishlist";
import { reasons } from "./tables/reason";
import { feedbacks } from "./tables/feedback";

export default defineSchema(
  {
    // other tables here
    users: user,
    jobs,
    wishlists,
    reasons,
    feedbacks,
  },
  { schemaValidation: true, strictTableNameTypes: true }
);
