import { Suspense } from "react";
import type { Metadata } from "next";

import { ProjectGridSkeleton } from "@/modules/dashboard/components/project-grid";
import { ProjectsBrowser } from "@/modules/dashboard/components/projects-browser";

export const metadata: Metadata = {
  title: "Projects",
};

export default function ProjectsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto w-full max-w-7xl px-5 pt-40 md:px-8">
          <ProjectGridSkeleton count={8} />
        </div>
      }
    >
      <ProjectsBrowser />
    </Suspense>
  );
}
