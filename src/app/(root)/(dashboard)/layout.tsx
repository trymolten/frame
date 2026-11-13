import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";

import { getQueryClient, trpc } from "@/trpc/server";
import { MAIN_CONTENT_ID } from "@/lib/routes";
import { SkipLink } from "@/components/skip-link";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { RECENT_PROJECTS_INPUT } from "@/modules/dashboard/types";
import { AppSidebar } from "@/modules/dashboard/components/app-sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value !== "false";

  // Sidebar recents, the home "Recently viewed" tab, the credits card and the
  // usage settings page all render from these on first paint.
  const queryClient = getQueryClient();
  await Promise.all([
    queryClient.prefetchQuery(
      trpc.projects.list.queryOptions(RECENT_PROJECTS_INPUT)
    ),
    queryClient.prefetchQuery(trpc.usage.getStatus.queryOptions()),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SidebarProvider defaultOpen={defaultOpen}>
        <SkipLink />
        <AppSidebar />
        {/* SidebarInset is the page's <main>. */}
        <SidebarInset
          id={MAIN_CONTENT_ID}
          tabIndex={-1}
          className="overflow-hidden outline-none md:border"
        >
          <SidebarTrigger className="absolute top-3 left-3 z-20 text-muted-foreground" />
          {children}
        </SidebarInset>
      </SidebarProvider>
    </HydrationBoundary>
  );
}
