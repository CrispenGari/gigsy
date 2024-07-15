import { defineSchema } from "convex/server";
import { user } from "./tables/user";
import { jobs } from "./tables/job";

export default defineSchema({
  // other tables here
  users: user,
  jobs,
});
