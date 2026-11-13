import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

type RouterInputs = inferRouterInputs<AppRouter>;
type RouterOutputs = inferRouterOutputs<AppRouter>;

export type ProjectListInput = RouterInputs["projects"]["list"];
export type ProjectListPage = RouterOutputs["projects"]["list"];
export type ProjectCardData = ProjectListPage["items"][number];
export type UsageStatus = RouterOutputs["usage"]["getStatus"];

// Shared by the sidebar's Recents and the home page's "Recently viewed" tab so
// both read one cached query.
export const RECENT_PROJECTS_INPUT = {
  filter: "recent",
  limit: 8,
} as const satisfies ProjectListInput;
