import { v } from "convex/values";
import { mutation, query } from "../_generated/server";
import { jobArguments } from "../tables/job";

import { getDistance } from "geolib";
import { paginationOptsValidator } from "convex/server";
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
    paginationOpts: paginationOptsValidator,
    order: v.union(v.literal("desc"), v.literal("asc")),
    showGlobally: v.boolean(),
    withinCity: v.object({
      filter: v.union(
        v.literal("city"),
        v.literal("country"),
        v.literal("region")
      ),
      value: v.string(),
    }),
    distance: v.object({
      radius: v.number(),
      coords: v.object({
        lat: v.number(),
        lon: v.number(),
      }),
    }),
  },
  handler: async (
    ctx,
    { order, paginationOpts, showGlobally, distance, withinCity }
  ) => {
    if (showGlobally) {
      const result = await ctx.db
        .query("jobs")
        .order(order)
        .paginate(paginationOpts);
      return {
        ...result,
        page: result.page.map((res) => res._id),
      };
    } else {
      const { filter, value } = withinCity;

      if (filter === "country") {
        const result = await ctx.db
          .query("jobs")
          .order(order)
          .filter((q) =>
            q.eq(q.field(`location.address.isoCountryCode`), value)
          )
          // .filter(q=> q.lte(q.field(
          //   'location.lat'
          // ), distance.radius))
          .paginate(paginationOpts);
        return {
          ...result,
          page: result.page.map((res) => res._id),
        };
      }
      const result = await ctx.db
        .query("jobs")
        .order(order)
        .filter((q) => q.eq(q.field(`location.address.${filter}`), value))
        .paginate(paginationOpts);

      return {
        ...result,
        page: result.page.map((res) => res._id),
      };
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
