"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "next-themes";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useClerk, useUser, UserButton } from "@clerk/nextjs";
import {
  ChevronsUpDownIcon,
  CreditCardIcon,
  FolderIcon,
  GlobeIcon,
  HouseIcon,
  LogOutIcon,
  SearchIcon,
  SettingsIcon,
  StarIcon,
  SunMoonIcon,
  type LucideIcon,
} from "lucide-react";

import { useTRPC } from "@/trpc/client";
import { isActivePath, routes } from "@/lib/routes";
import { Kbd } from "@/components/ui/kbd";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RECENT_PROJECTS_INPUT } from "@/modules/dashboard/types";
import { CreditsCard } from "@/modules/dashboard/components/credits-card";
import { SearchCommand } from "@/modules/dashboard/components/search-command";

export function AppSidebar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { isMobile, setOpenMobile } = useSidebar();
  // Close the mobile sheet once a link is chosen.
  const onNavigate = () => isMobile && setOpenMobile(false);

  return (
    <>
      <Sidebar variant="inset" collapsible="offcanvas">
        <SidebarHeader className="pt-3">
          <WorkspaceMenu />
        </SidebarHeader>

        <SidebarContent>
          <SidebarGroup>
            <nav aria-label="Main">
              <SidebarGroupContent>
                <PrimaryNav
                  onNavigate={onNavigate}
                  onSearch={() => setSearchOpen(true)}
                />
              </SidebarGroupContent>
            </nav>
          </SidebarGroup>

          <SidebarGroup>
            <nav aria-labelledby="sidebar-recents">
              <SidebarGroupLabel id="sidebar-recents">
                Recents
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <RecentProjects onNavigate={onNavigate} />
              </SidebarGroupContent>
            </nav>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="gap-3 pb-3">
          <CreditsCard />
          <UserButton
            showName
            userProfileMode="navigation"
            userProfileUrl={routes.accountSettings}
            appearance={{
              elements: {
                rootBox: "w-full",
                userButtonTrigger:
                  "w-full justify-start rounded-lg! px-2 py-1.5 hover:bg-sidebar-accent focus:shadow-none!",
                userButtonBox: "flex-row-reverse! gap-2! text-sm",
                userButtonOuterIdentifier: "text-sm! font-medium! pl-0!",
                userButtonAvatarBox: "size-7!",
              },
            }}
          />
        </SidebarFooter>
      </Sidebar>
      <SearchCommand open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}

function WorkspaceMenu() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { theme, setTheme } = useTheme();
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.getStatus.queryOptions());

  const firstName = user?.firstName?.trim();
  const workspace = firstName ? `${firstName}'s Frame` : "My Frame";
  const initial = (firstName?.[0] ?? "F").toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent"
            >
              <Avatar className="size-7 rounded-lg">
                <AvatarFallback className="rounded-lg bg-[linear-gradient(135deg,var(--glow-blue),var(--glow-pink)_55%,var(--glow-orange))] text-[13px] font-semibold text-white">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <span className="flex min-w-0 flex-1 flex-col leading-tight">
                <span className="truncate font-semibold">{workspace}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {usage?.plan === "pro" ? "Pro plan" : "Free plan"}
                </span>
              </span>
              <ChevronsUpDownIcon className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="start"
            sideOffset={6}
            className="w-(--radix-dropdown-menu-trigger-width) min-w-60"
          >
            <DropdownMenuLabel className="font-normal">
              <span className="block truncate text-sm font-medium">
                {user?.fullName ?? workspace}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                {user?.primaryEmailAddress?.emailAddress}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.accountSettings}>
                <SettingsIcon />
                Account settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={routes.usageSettings}>
                <CreditCardIcon />
                Usage and plan
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="gap-2">
                <SunMoonIcon className="size-4 text-muted-foreground" />
                Appearance
              </DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                  <DropdownMenuRadioItem value="light">
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="dark">
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="system">
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href={routes.website}>
                <GlobeIcon />
                Frame website
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onSelect={() => signOut({ redirectUrl: routes.home })}
            >
              <LogOutIcon />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function PrimaryNav({
  onNavigate,
  onSearch,
}: {
  onNavigate: () => void;
  onSearch: () => void;
}) {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      <NavItem
        href={routes.home}
        icon={HouseIcon}
        label="Home"
        isActive={isActivePath(pathname, routes.home)}
        onNavigate={onNavigate}
      />
      <SidebarMenuItem>
        <SidebarMenuButton
          onClick={onSearch}
          aria-keyshortcuts="Meta+K Control+K"
        >
          <SearchIcon />
          <span>Search</span>
          <Kbd className="ml-auto group-data-[collapsible=icon]:hidden">⌘K</Kbd>
        </SidebarMenuButton>
      </SidebarMenuItem>
      <NavItem
        href={routes.projects}
        icon={FolderIcon}
        label="All projects"
        isActive={isActivePath(pathname, routes.projects)}
        onNavigate={onNavigate}
      />
      <NavItem
        href={routes.starredProjects}
        icon={StarIcon}
        label="Starred"
        isActive={isActivePath(pathname, routes.starredProjects)}
        onNavigate={onNavigate}
      />
    </SidebarMenu>
  );
}

function NavItem({
  href,
  icon: Icon,
  label,
  isActive,
  onNavigate,
}: {
  href: string;
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  onNavigate: () => void;
}) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive}>
        <Link
          href={href}
          aria-current={isActive ? "page" : undefined}
          onClick={onNavigate}
        >
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

function RecentProjects({ onNavigate }: { onNavigate: () => void }) {
  const trpc = useTRPC();
  const { data, isPending } = useQuery(
    trpc.projects.list.queryOptions(RECENT_PROJECTS_INPUT)
  );

  if (isPending) {
    return (
      <SidebarMenu>
        {Array.from({ length: 4 }, (_, i) => (
          <SidebarMenuItem key={i}>
            <SidebarMenuSkeleton />
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    );
  }

  if (!data?.items.length) {
    return (
      <p className="px-2 py-1 text-xs text-muted-foreground">
        Projects you open show up here.
      </p>
    );
  }

  return (
    <SidebarMenu>
      {data.items.map((project) => (
        <SidebarMenuItem key={project.id}>
          <SidebarMenuButton asChild className="text-sidebar-foreground/80">
            <Link href={routes.project(project.id)} onClick={onNavigate}>
              <span className="truncate">{project.name}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
