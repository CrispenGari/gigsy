import { defineSchema } from "convex/server";
import { user } from "./tables/user";
import { jobs } from "./tables/job";
import { wishlists } from "./tables/whishlist";
import { reasons } from "./tables/reason";

export default defineSchema({
  // other tables here
  users: user,
  jobs,
  wishlists,
  reasons,
});
