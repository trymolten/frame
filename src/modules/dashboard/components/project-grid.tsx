"use client";

import { useUser } from "@clerk/nextjs";

import { cn } from "@/lib/utils";
import type { ProjectCardData } from "@/modules/dashboard/types";
import { useProjectActions } from "@/modules/dashboard/hooks/use-project-actions";
import {
  ProjectCard,
  ProjectCardSkeleton,
} from "@/modules/dashboard/components/project-card";

const GRID =
  "grid grid-cols-1 gap-x-5 gap-y-7 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4";

export function ProjectGrid({
  projects,
  className,
}: {
  projects: ProjectCardData[];
  className?: string;
}) {
  // One set of mutations and one user lookup for the whole grid, not per card.
  const actions = useProjectActions();
  const { user } = useUser();
  const owner = {
    imageUrl: user?.imageUrl,
    initial: user?.firstName?.[0] ?? "F",
  };

  return (
    <ul className={cn(GRID, className)}>
      {projects.map((project) => (
        <li key={project.id}>
          <ProjectCard project={project} actions={actions} owner={owner} />
        </li>
      ))}
    </ul>
  );
}

export function ProjectGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className={GRID} aria-busy aria-label="Loading projects">
      {Array.from({ length: count }, (_, i) => (
        <ProjectCardSkeleton key={i} />
      ))}
    </div>
  );
}
