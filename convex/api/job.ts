import { mutation } from "../_generated/server";
import { jobArguments } from "../tables/job";

export const publish = mutation({
  args: jobArguments,
  handler: async ({ db }, args) => {
    try {
      await db.insert("jobs", args);
      return {
        success: true,
      };
    } catch (error) {
      return {
        success: false,
      };
    }
  },
});
