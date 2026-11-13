"use client";

import Link from "next/link";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RECENT_PROJECTS_INPUT,
  type ProjectListInput,
} from "@/modules/dashboard/types";
import {
  ProjectGrid,
  ProjectGridSkeleton,
} from "@/modules/dashboard/components/project-grid";
import { ProjectsEmpty } from "@/modules/dashboard/components/projects-empty";
import { buildingPollInterval } from "@/modules/dashboard/lib/polling";

const TABS = [
  {
    id: "recent",
    label: "Recently viewed",
    input: RECENT_PROJECTS_INPUT,
    emptyTitle: "Nothing opened yet",
    emptyDescription: "Projects you open show up here.",
  },
  {
    id: "mine",
    label: "My projects",
    input: { filter: "all", limit: 8 },
    emptyTitle: "No projects yet",
    emptyDescription: "Describe an app above to create your first project.",
  },
  {
    id: "starred",
    label: "Starred",
    input: { filter: "starred", limit: 8 },
    emptyTitle: "Nothing starred yet",
    emptyDescription: "Star a project to keep it here.",
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  input: ProjectListInput;
  emptyTitle: string;
  emptyDescription: string;
}>;

type Tab = (typeof TABS)[number];

export function ProjectsSection() {
  const [tabId, setTabId] = useState<Tab["id"]>("recent");

  return (
    <section
      aria-label="Your projects"
      className="relative z-10 -mt-16 rounded-t-[28px] border-t bg-background px-5 pt-5 pb-12 md:px-8"
    >
      <Tabs
        value={tabId}
        onValueChange={(value) => setTabId(value as Tab["id"])}
        className="gap-6"
      >
        <div className="flex items-center justify-between gap-4">
          <TabsList className="h-auto gap-1 overflow-x-auto bg-transparent p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {TABS.map((tab) => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="flex-none rounded-full px-3 py-1.5 text-muted-foreground data-[state=active]:bg-muted data-[state=active]:text-foreground data-[state=active]:shadow-none dark:data-[state=active]:border-transparent dark:data-[state=active]:bg-muted"
              >
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="shrink-0 text-muted-foreground"
          >
            <Link
              href={
                tabId === "starred" ? "/projects?filter=starred" : "/projects"
              }
            >
              View all
            </Link>
          </Button>
        </div>

        {TABS.map((tab) => (
          <TabsContent key={tab.id} value={tab.id}>
            <ProjectsTabPanel tab={tab} />
          </TabsContent>
        ))}
      </Tabs>
    </section>
  );
}

function ProjectsTabPanel({ tab }: { tab: Tab }) {
  const trpc = useTRPC();
  const { data, isPending, isError, refetch } = useQuery(
    trpc.projects.list.queryOptions(tab.input, {
      refetchInterval: (query) => buildingPollInterval(query.state.data),
    })
  );

  if (isPending) return <ProjectGridSkeleton />;

  // A failed background refresh keeps showing the last good data.
  if (isError && !data) {
    return (
      <ProjectsEmpty
        title="Your projects didn't load"
        description="Check your connection, then try again."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <ProjectsEmpty
        title={tab.emptyTitle}
        description={tab.emptyDescription}
      />
    );
  }

  return <ProjectGrid projects={data.items} />;
}
