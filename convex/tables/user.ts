import { defineTable } from "convex/server";
import { v } from "convex/values";

export const userArguments = {
  firstName: v.string(),
  lastName: v.string(),
  id: v.string(),
  email: v.string(),
  image: v.string(),
};
export const user = defineTable(userArguments);

//   firstName: user?.firstName,
//     lastName: user?.lastName,
//     id: user?.id,
//     createdAt: user?.createdAt,
//     updatedAt: user?.updatedAt,
//     imageUrl: user?.imageUrl,
//     lastLoginAt: user?.lastSignInAt,
//     email: user?.emailAddresses[0].emailAddress,
