"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { useQuery } from "@tanstack/react-query";
import {
  FolderIcon,
  HouseIcon,
  MoonIcon,
  SettingsIcon,
  StarIcon,
  SunIcon,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { routes } from "@/lib/routes";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

interface SearchCommandProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SearchCommand({ open, onOpenChange }: SearchCommandProps) {
  const trpc = useTRPC();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [search, setSearch] = useState("");
  const query = useDebouncedValue(search.trim(), 200);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onOpenChange]);

  const { data, isFetching } = useQuery({
    ...trpc.projects.list.queryOptions({
      search: query || undefined,
      limit: 8,
    }),
    enabled: open,
    placeholderData: (previous) => previous,
  });

  const go = (href: string) => {
    onOpenChange(false);
    setSearch("");
    router.push(href);
  };

  return (
    <CommandDialog
      open={open}
      onOpenChange={onOpenChange}
      title="Search projects"
      description="Find a project or jump to a page"
      shouldFilter={false}
    >
      <CommandInput
        placeholder="Search projects…"
        value={search}
        onValueChange={setSearch}
      />
      <CommandList>
        <CommandEmpty>
          {isFetching ? "Searching…" : "No projects match that name."}
        </CommandEmpty>
        {!!data?.items.length && (
          <CommandGroup heading="Projects">
            {data.items.map((project) => (
              <CommandItem
                key={project.id}
                value={project.id}
                onSelect={() => go(routes.project(project.id))}
              >
                <FolderIcon />
                <span className="truncate">{project.name}</span>
                {project.starred && (
                  <StarIcon className="ml-auto fill-amber-400 text-amber-400" />
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        )}
        {!query && (
          <>
            <CommandSeparator />
            <CommandGroup heading="Go to">
              <CommandItem value="home" onSelect={() => go(routes.home)}>
                <HouseIcon />
                Home
              </CommandItem>
              <CommandItem
                value="all-projects"
                onSelect={() => go(routes.projects)}
              >
                <FolderIcon />
                All projects
              </CommandItem>
              <CommandItem
                value="starred-projects"
                onSelect={() => go(routes.starredProjects)}
              >
                <StarIcon />
                Starred projects
              </CommandItem>
              <CommandItem
                value="settings"
                onSelect={() => go(routes.accountSettings)}
              >
                <SettingsIcon />
                Settings
              </CommandItem>
              <CommandItem
                value="toggle-theme"
                onSelect={() => {
                  setTheme(resolvedTheme === "dark" ? "light" : "dark");
                  onOpenChange(false);
                }}
              >
                {resolvedTheme === "dark" ? <SunIcon /> : <MoonIcon />}
                Switch to {resolvedTheme === "dark" ? "light" : "dark"} theme
              </CommandItem>
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  );
}
