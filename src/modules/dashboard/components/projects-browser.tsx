"use client";

import Link from "next/link";
import { createContext, useContext, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { useTRPC } from "@/trpc/client";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { PillNav } from "@/components/pill-nav";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ProjectGrid,
  ProjectGridSkeleton,
} from "@/modules/dashboard/components/project-grid";
import { ProjectsEmpty } from "@/modules/dashboard/components/projects-empty";
import { buildingPollInterval } from "@/modules/dashboard/lib/polling";

export type ProjectsFilter = "all" | "starred";
type Sort = "updated" | "created" | "name";

const SORT_LABELS: Record<Sort, string> = {
  updated: "Last edited",
  created: "Date created",
  name: "Name",
};

const FILTER_LINKS = [
  { href: routes.projects, label: "All" },
  { href: routes.starredProjects, label: "Starred" },
] as const;

function useBrowserState() {
  const [sort, setSort] = useState<Sort>("updated");
  const [search, setSearch] = useState("");
  return { sort, setSort, search, setSearch };
}

const BrowserStateContext = createContext<ReturnType<
  typeof useBrowserState
> | null>(null);

// All and Starred are separate pages, so the browser remounts when switching.
// Rendered by the projects layout, this keeps the search and sort across.
export function ProjectsBrowserState({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BrowserStateContext value={useBrowserState()}>
      {children}
    </BrowserStateContext>
  );
}

// Rendered by /projects and /projects/starred; the route picks the filter.
export function ProjectsBrowser({ filter }: { filter: ProjectsFilter }) {
  const trpc = useTRPC();
  const state = useContext(BrowserStateContext);
  if (!state) throw new Error("ProjectsBrowser needs ProjectsBrowserState");
  const { sort, setSort, search, setSearch } = state;
  const debouncedSearch = useDebouncedValue(search.trim());

  const query = useInfiniteQuery(
    trpc.projects.list.infiniteQueryOptions(
      {
        filter,
        sort,
        search: debouncedSearch || undefined,
        limit: 24,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        placeholderData: (previous) => previous,
        refetchInterval: (query) => buildingPollInterval(query.state.data),
      }
    )
  );

  const projects = query.data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pt-16 pb-16 md:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-[-0.02em]">
            {filter === "starred" ? "Starred projects" : "All projects"}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {filter === "starred"
              ? "Projects you starred, all in one place."
              : "Everything you've built with Molten."}
          </p>
        </div>
        <Button asChild size="sm" className="h-9 rounded-full px-4">
          <Link href={routes.home}>
            <PlusIcon />
            New project
          </Link>
        </Button>
      </div>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
        <InputGroup className="h-9 flex-1 rounded-full bg-background">
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupInput
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects"
            aria-label="Search projects"
          />
        </InputGroup>
        <div className="flex items-center gap-2">
          <PillNav label="Filter projects" items={FILTER_LINKS} />
          <Select
            value={sort}
            onValueChange={(value) => setSort(value as Sort)}
          >
            <SelectTrigger
              size="sm"
              aria-label="Sort by"
              className="w-[150px] bg-background"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="end">
              {(Object.keys(SORT_LABELS) as Sort[]).map((value) => (
                <SelectItem key={value} value={value}>
                  {SORT_LABELS[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8">
        {query.isPending ? (
          <ProjectGridSkeleton count={8} />
        ) : query.isError && !query.data ? (
          <ProjectsEmpty
            title="Your projects didn't load"
            description="Check your connection, then try again."
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => query.refetch()}
              >
                Try again
              </Button>
            }
          />
        ) : projects.length === 0 ? (
          <EmptyResults filter={filter} search={debouncedSearch} />
        ) : (
          <>
            <ProjectGrid
              projects={projects}
              className={cn(query.isPlaceholderData && "opacity-60")}
            />
            {query.hasNextPage && (
              <div className="mt-10 flex justify-center">
                <Button
                  variant="outline"
                  className="rounded-full"
                  disabled={query.isFetchingNextPage}
                  onClick={() => query.fetchNextPage()}
                >
                  {query.isFetchingNextPage && (
                    <Loader2Icon className="animate-spin" />
                  )}
                  Show more
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function EmptyResults({
  filter,
  search,
}: {
  filter: ProjectsFilter;
  search: string;
}) {
  if (search) {
    return (
      <ProjectsEmpty
        title="No matching projects"
        description={`No project names contain "${search}".`}
      />
    );
  }
  if (filter === "starred") {
    return (
      <ProjectsEmpty
        title="Nothing starred yet"
        description="Star a project from its menu to pin it here."
      />
    );
  }
  return (
    <ProjectsEmpty
      title="No projects yet"
      description="Describe an app on the home page and Molten builds it for you."
      action={
        <Button asChild size="sm">
          <Link href={routes.home}>Start building</Link>
        </Button>
      }
    />
  );
}
