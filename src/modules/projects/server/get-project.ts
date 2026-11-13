import "server-only";
import { cache } from "react";
import { TRPCError } from "@trpc/server";

import { isProjectId } from "@/lib/routes";
import { getQueryClient, trpc } from "@/trpc/server";

/**
 * The signed-in user's project, or null. A missing project and one owned by
 * someone else look the same, so ids can't be probed. The result is stored in
 * the request's query client, so the editor hydrates it instead of fetching
 * again, and the layout, metadata and page share one query.
 */
export const findProject = cache(async (projectId: string) => {
  if (!isProjectId(projectId)) return null;

  try {
    return await getQueryClient().fetchQuery(
      trpc.projects.getProjectById.queryOptions({ id: projectId })
    );
  } catch (error) {
    if (error instanceof TRPCError && error.code === "NOT_FOUND") return null;
    throw error;
  }
});
