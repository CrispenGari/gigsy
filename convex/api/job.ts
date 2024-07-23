import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { jobArguments } from "../tables/job";

import { getDistance, convertDistance } from "geolib";
export type TCoord = {
  latitude: number;
  longitude: number;
};

const calculateDistance = (me: TCoord, other: TCoord) => {
  const distance = getDistance(me, other);
  return distance;
};
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

export const get = query({
  args: {
    limit: v.number(),
    order: v.union(v.literal("desc"), v.literal("asc")),
    filters: v.object({
      defaultJobListingLocation: v.union(
        v.literal("city"),
        v.literal("country"),
        v.literal("region")
      ),
      showJobsGlobally: v.boolean(),
    }),
    filterValues: v.object({
      distanceRadius: v.number(),
      coords: v.object({ lat: v.number(), lon: v.number() }),
      defaultJobListingLocation: v.string(),
    }),
  },
  handler: async ({ db }, { limit, order, filterValues, filters }) => {
    try {
      const jobs = await db.query("jobs").order(order).take(limit);
      if (filters.showJobsGlobally) {
        return jobs.map(({ _id }) => _id);
      }
      if (filters.defaultJobListingLocation === "city") {
        return jobs
          .filter(
            (j) =>
              j.location.address.city?.toLowerCase() ===
              filterValues.defaultJobListingLocation.toLowerCase()
          )
          .map(({ _id }) => _id);
      } else if (filters.defaultJobListingLocation === "region") {
        return jobs
          .filter(
            (j) =>
              j.location.address.region?.toLowerCase() ===
              filterValues.defaultJobListingLocation.toLowerCase()
          )
          .filter((j) => {
            const distance = calculateDistance(
              {
                latitude: filterValues.coords.lat,
                longitude: filterValues.coords.lon,
              },
              {
                latitude: j.location.lat,
                longitude: j.location.lon,
              }
            );
            if (distance <= filterValues.distanceRadius) return j;
          })
          .map(({ _id }) => _id);
      } else {
        // ignore distance
        return jobs
          .filter(
            (j) =>
              j.location.address.isoCountryCode?.toLowerCase() ===
              filterValues.defaultJobListingLocation.toLowerCase()
          )
          .map(({ _id }) => _id);
      }
    } catch (error) {
      return [];
    }
  },
});

export const getById = query({
  args: { id: v.id("jobs") },
  handler: async ({ db }, { id }) => {
    try {
      const job = await db
        .query("jobs")
        .filter((q) => q.eq(q.field("_id"), id))
        .unique();
      return job;
    } catch (error) {
      return null;
    }
  },
});

export const getJobById = query({
  args: { id: v.id("jobs") },
  handler: async ({ db }, { id }) => {
    try {
      const job = await db
        .query("jobs")
        .filter((q) => q.eq(q.field("_id"), id))
        .unique();
      const user = await db
        .query("users")
        .filter((q) => q.eq(q.field("_id"), job?.userId))
        .unique();

      return {
        ...job,
        user,
      };
    } catch (error) {
      return null;
    }
  },
});
export const deleteById = mutation({
  args: { id: v.id("jobs") },
  handler: async ({ db }, { id }) => {
    try {
      await db.delete(id);
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});

const updatableArguments = {
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
};
export const update = mutation({
  args: { id: v.id("jobs"), values: v.object(updatableArguments) },
  handler: async ({ db }, { id, values }) => {
    try {
      await db.patch(id, { ...values });
      return { success: true };
    } catch (error) {
      return { success: false };
    }
  },
});
