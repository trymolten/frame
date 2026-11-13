import Link from "next/link";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  GlobeIcon,
  SunMoonIcon,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { routes } from "@/lib/routes";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectHeaderProps {
  projectId: string;
}

const ProjectHeader = ({ projectId }: ProjectHeaderProps) => {
  const trpc = useTRPC();
  const { theme, setTheme } = useTheme();

  const { data: project } = useSuspenseQuery(
    trpc.projects.getProjectById.queryOptions({ id: projectId })
  );

  return (
    <header className="flex items-center justify-between border-b p-2">
      {/* The visible name is a menu button; this gives the page its heading. */}
      <h1 className="sr-only">{project.name}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-transparent hover:opacity-75 transition-opacity pl-2"
          >
            <Image
              src="/logo.png"
              alt=""
              width={24}
              height={24}
              className="shrink-0"
            />
            <span className="text-sm font-medium">{project.name}</span>
            <ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="bottom" align="start">
          <DropdownMenuItem asChild>
            <Link href={routes.home}>
              <ChevronLeftIcon />
              Back to home
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={routes.website}>
              <GlobeIcon />
              Molten website
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="gap-2">
              <SunMoonIcon className="size-4 text-muted-foreground" />
              <span>Appearance</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                <DropdownMenuRadioItem value="light">
                  Light
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">
                  System
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
};

export default ProjectHeader;
