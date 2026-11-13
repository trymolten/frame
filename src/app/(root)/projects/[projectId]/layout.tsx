import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { MAIN_CONTENT_ID } from "@/lib/routes";
import { findProject } from "@/modules/projects/server/get-project";

interface ProjectLayoutProps {
  children: React.ReactNode;
  params: Promise<{ projectId: string }>;
}

// Never calls notFound(); the layout decides. Metadata for a 404 still
// resolves, so the response carries a "Project not found" title.
export async function generateMetadata({
  params,
}: Pick<ProjectLayoutProps, "params">): Promise<Metadata> {
  const { projectId } = await params;
  const project = await findProject(projectId);
  return { title: project?.name ?? "Project not found" };
}

// The project check lives here, above this segment's loading.tsx. In the page
// it would run inside the loading boundary, after streaming had started, and
// an unknown id would come back as a 200 instead of a 404.
export default async function ProjectLayout({
  children,
  params,
}: ProjectLayoutProps) {
  const { projectId } = await params;
  if (!(await findProject(projectId))) notFound();

  // Outlives loading.tsx, so focus moved here during navigation stays put.
  return (
    <main id={MAIN_CONTENT_ID} tabIndex={-1} className="h-svh outline-none">
      {children}
    </main>
  );
}
