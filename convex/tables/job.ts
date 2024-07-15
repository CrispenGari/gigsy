import { defineTable } from "convex/server";
import { v } from "convex/values";

export const jobArguments = {
  type: v.union(v.literal("part-time"), v.literal("full-time")),
  benefits: v.optional(v.array(v.string())),
  company: v.string(),
  contactEmail: v.string(),
  contactName: v.string(),
  description: v.string(),
  educationLevels: v.array(v.string()),
  experience: v.array(v.string()),
  skills: v.array(v.string()),
  contactPhone: v.optional(v.string()),
  companyDescription: v.optional(v.string()),
  title: v.string(),
  salaryRange: v.object({
    max: v.string(),
    min: v.optional(v.string()),
  }),
  location: v.object({
    lat: v.number(),
    lon: v.number(),
    address: v.object({
      city: v.union(v.string(), v.null()),
      country: v.union(v.null(), v.string()),
      district: v.union(v.null(), v.string()),
      isoCountryCode: v.union(v.null(), v.string()),
      name: v.union(v.null(), v.string()),
      postalCode: v.union(v.null(), v.string()),
      region: v.union(v.null(), v.string()),
      street: v.union(v.null(), v.string()),
      streetNumber: v.union(v.null(), v.string()),
    }),
  }),
  //   relations
  userId: v.id("users"),
};
export const jobs = defineTable(jobArguments).index("userId", ["userId"]);
