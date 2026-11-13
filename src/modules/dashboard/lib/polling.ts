import type { InfiniteData } from "@tanstack/react-query";

import type { ProjectListPage } from "@/modules/dashboard/types";

const BUILDING_POLL_MS = 5000;

const isBuilding = (page?: ProjectListPage) =>
  page?.items.some((project) => project.status === "GENERATING") ?? false;

// Keep "Building" badges current without polling idle dashboards.
export const buildingPollInterval = (
  data?: ProjectListPage | InfiniteData<ProjectListPage>
) => {
  const pages = data && "pages" in data ? data.pages : [data];
  return pages.some(isBuilding) ? BUILDING_POLL_MS : false;
};
