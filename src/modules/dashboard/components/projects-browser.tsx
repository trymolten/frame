"use client";

import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Loader2Icon, PlusIcon, SearchIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { Button } from "@/components/ui/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
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

type Filter = "all" | "starred";
type Sort = "updated" | "created" | "name";

const SORT_LABELS: Record<Sort, string> = {
  updated: "Last edited",
  created: "Date created",
  name: "Name",
};

export function ProjectsBrowser() {
  const trpc = useTRPC();
  // The URL owns the filter so the sidebar's Starred link and this toggle
  // always agree.
  const filter: Filter =
    useSearchParams().get("filter") === "starred" ? "starred" : "all";
  const [sort, setSort] = useState<Sort>("updated");
  const [search, setSearch] = useState("");
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

  // History API updates useSearchParams without a server round-trip.
  const changeFilter = (next: string) => {
    if (next !== "all" && next !== "starred") return; // ignore deselect
    window.history.replaceState(
      null,
      "",
      next === "starred" ? "/projects?filter=starred" : "/projects"
    );
  };

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
              : "Everything you've built with Frame."}
          </p>
        </div>
        <Button asChild size="sm" className="h-9 rounded-full px-4">
          <Link href="/">
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
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={filter}
            onValueChange={changeFilter}
            aria-label="Show"
          >
            <ToggleGroupItem value="all" className="px-3">
              All
            </ToggleGroupItem>
            <ToggleGroupItem value="starred" className="px-3">
              Starred
            </ToggleGroupItem>
          </ToggleGroup>
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

function EmptyResults({ filter, search }: { filter: Filter; search: string }) {
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
      description="Describe an app on the home page and Frame builds it for you."
      action={
        <Button asChild size="sm">
          <Link href="/">Start building</Link>
        </Button>
      }
    />
  );
}
