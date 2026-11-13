import { notFound } from "next/navigation";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { findProject } from "@/modules/projects/server/get-project";
import ProjectView from "@/modules/projects/components/project-view";

interface ProjectPageProps {
  params: Promise<{ projectId: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;
  const queryClient = getQueryClient();

  // The layout already loaded the project; awaiting it again reuses that
  // request and guarantees it is in the cache before dehydrating.
  const [project] = await Promise.all([
    findProject(projectId),
    queryClient.prefetchQuery(
      trpc.messages.getMessages.queryOptions({ projectId })
    ),
  ]);
  if (!project) notFound();

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProjectView projectId={projectId} />
    </HydrationBoundary>
  );
}
