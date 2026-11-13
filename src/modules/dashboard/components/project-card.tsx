"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ExternalLinkIcon,
  MoreHorizontalIcon,
  PencilIcon,
  StarIcon,
  StarOffIcon,
  Trash2Icon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ProjectCardData } from "@/modules/dashboard/types";
import { formatEdited } from "@/modules/dashboard/lib/format";
import type { ProjectActions } from "@/modules/dashboard/hooks/use-project-actions";
import { ProjectThumbnail } from "@/modules/dashboard/components/project-thumbnail";
import {
  DeleteProjectDialog,
  RenameProjectDialog,
} from "@/modules/dashboard/components/project-dialogs";

// Hidden until the card is hovered or focused, like Lovable.
const REVEAL_ON_HOVER =
  "opacity-0 group-hover/card:opacity-100 group-focus-within/card:opacity-100 data-[state=open]:opacity-100";

interface ProjectCardProps {
  project: ProjectCardData;
  actions: ProjectActions;
  owner: { imageUrl?: string; initial: string };
}

export function ProjectCard({ project, actions, owner }: ProjectCardProps) {
  const { setStarred, rename, remove } = actions;
  const [dialog, setDialog] = useState<"rename" | "delete" | null>(null);

  const href = `/projects/${project.id}`;
  const toggleStar = () =>
    setStarred.mutate({ id: project.id, starred: !project.starred });

  return (
    <div className="group/card">
      <Link
        href={href}
        aria-label={`Open ${project.name}`}
        className="block rounded-xl outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
      >
        <ProjectThumbnail
          project={project}
          className="transition-shadow group-hover/card:shadow-[0_6px_24px_-10px_rgb(0_0_0/0.25)]"
        />
      </Link>

      <Item size="sm" className="items-start gap-2.5 px-0 pt-3 pb-0">
        <ItemMedia>
          <Avatar className="size-7">
            <AvatarImage src={owner.imageUrl} alt="" />
            <AvatarFallback className="text-[11px]">
              {owner.initial}
            </AvatarFallback>
          </Avatar>
        </ItemMedia>
        <ItemContent className="min-w-0 gap-0">
          <ItemTitle className="w-full">
            <Link
              href={href}
              className="truncate outline-none hover:underline focus-visible:underline"
            >
              {project.name}
            </Link>
          </ItemTitle>
          {/* Relative time can differ by a minute between server and client. */}
          <ItemDescription
            className="truncate text-xs"
            suppressHydrationWarning
          >
            {formatEdited(project.updatedAt)}
          </ItemDescription>
        </ItemContent>
        <ItemActions className="gap-0">
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "size-7 text-muted-foreground hover:text-foreground",
              !project.starred && REVEAL_ON_HOVER
            )}
            aria-label={project.starred ? "Unstar project" : "Star project"}
            aria-pressed={project.starred}
            onClick={toggleStar}
          >
            <StarIcon
              className={cn(project.starred && "fill-amber-400 text-amber-400")}
            />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "size-7 text-muted-foreground hover:text-foreground",
                  REVEAL_ON_HOVER
                )}
                aria-label={`Actions for ${project.name}`}
              >
                <MoreHorizontalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem asChild>
                <Link href={href}>
                  <ExternalLinkIcon />
                  Open
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => setDialog("rename")}>
                <PencilIcon />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={toggleStar}>
                {project.starred ? <StarOffIcon /> : <StarIcon />}
                {project.starred ? "Unstar" : "Star"}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                onSelect={() => setDialog("delete")}
              >
                <Trash2Icon />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </ItemActions>
      </Item>

      <RenameProjectDialog
        name={project.name}
        open={dialog === "rename"}
        onOpenChange={(open) => setDialog(open ? "rename" : null)}
        onRename={(name) => rename.mutate({ id: project.id, name })}
      />
      <DeleteProjectDialog
        name={project.name}
        open={dialog === "delete"}
        onOpenChange={(open) => setDialog(open ? "delete" : null)}
        onDelete={() => remove.mutate({ id: project.id })}
      />
    </div>
  );
}

export function ProjectCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[16/10] w-full rounded-xl" />
      <div className="flex items-start gap-2.5 pt-3">
        <Skeleton className="size-7 rounded-full" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-3.5 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </div>
  );
}
