/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * Generated by convex@1.13.0.
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as api_feedback from "../api/feedback.js";
import type * as api_job from "../api/job.js";
import type * as api_user from "../api/user.js";
import type * as api_wishlist from "../api/wishlist.js";
import type * as tables_feedback from "../tables/feedback.js";
import type * as tables_job from "../tables/job.js";
import type * as tables_reason from "../tables/reason.js";
import type * as tables_user from "../tables/user.js";
import type * as tables_whishlist from "../tables/whishlist.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "api/feedback": typeof api_feedback;
  "api/job": typeof api_job;
  "api/user": typeof api_user;
  "api/wishlist": typeof api_wishlist;
  "tables/feedback": typeof tables_feedback;
  "tables/job": typeof tables_job;
  "tables/reason": typeof tables_reason;
  "tables/user": typeof tables_user;
  "tables/whishlist": typeof tables_whishlist;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;