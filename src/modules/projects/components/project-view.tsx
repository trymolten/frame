"use client";

import Link from "next/link";
import { dark } from "@clerk/themes";
import { Suspense, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth, UserButton } from "@clerk/nextjs";
import { ErrorBoundary } from "react-error-boundary";
import { CodeIcon, CrownIcon, EyeIcon } from "lucide-react";

import { FileCollection } from "@/types/file";
import { Fragment } from "@/generated/prisma/client";
import { useTRPC } from "@/trpc/client";
import { routes } from "@/lib/routes";
import { useCurrentTheme } from "@/hooks/use-current-theme";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ResizablePanel,
  ResizableHandle,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Tabs, TabsList, TabsContent, TabsTrigger } from "@/components/ui/tabs";
import { FileExplorer } from "@/components/file-explorer";
import ProjectHeader from "@/modules/projects/components/project-header";
import ProjectFragmentWeb from "@/modules/projects/components/project-fragment-web";
import ProjectMessagesContainer from "@/modules/projects/components/project-messages-container";

interface ProjectViewProps {
  projectId: string;
}

const ProjectView = ({ projectId }: ProjectViewProps) => {
  const { has } = useAuth();
  const { theme } = useCurrentTheme();
  const hasProPlan = has?.({ plan: "pro" });
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

  // Feeds "Recently viewed" on the dashboard.
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { mutate: markOpened } = useMutation(
    trpc.projects.markOpened.mutationOptions({
      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.pathKey(),
        }),
    })
  );
  useEffect(() => {
    markOpened({ id: projectId });
  }, [projectId, markOpened]);

  return (
    <div className="h-full">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          tagName="section"
          aria-label="Chat"
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary
            fallback={
              <PanelMessage>The project name didn&apos;t load.</PanelMessage>
            }
          >
            <Suspense
              fallback={
                <div className="flex h-[49px] items-center border-b px-4">
                  <Skeleton className="h-4 w-32" />
                </div>
              }
            >
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={
              <PanelMessage>
                Messages didn&apos;t load. Reload the page to try again.
              </PanelMessage>
            }
          >
            <Suspense
              fallback={
                <div className="flex-1 space-y-4 p-4">
                  <Skeleton className="ml-auto h-14 w-3/4 rounded-xl" />
                  <Skeleton className="h-28 w-5/6 rounded-xl" />
                </div>
              }
            >
              <ProjectMessagesContainer
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
                projectId={projectId}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel
          tagName="section"
          aria-label="Preview"
          defaultSize={65}
          minSize={50}
        >
          <Tabs
            defaultValue="preview"
            className="h-full gap-y-0"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon /> Demo
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon /> Code
                </TabsTrigger>
              </TabsList>
              <div className="ml-auto flex items-center gap-x-2">
                {!hasProPlan && (
                  <Button asChild size="sm">
                    <Link href={routes.pricing}>
                      <CrownIcon /> Upgrade
                    </Link>
                  </Button>
                )}
                <UserButton
                  appearance={{
                    elements: {
                      userButtonBox: "rounded-md!",
                      userButtonTrigger: "rounded-md!",
                      userButtonAvatarBox: "rounded-md! size-8!",
                    },
                    theme: theme === "dark" ? dark : undefined,
                  }}
                />
              </div>
            </div>
            <TabsContent value="preview">
              {!!activeFragment && <ProjectFragmentWeb data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="min-h-0">
              {!!activeFragment?.files && (
                <FileExplorer files={activeFragment.files as FileCollection} />
              )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

function PanelMessage({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="p-4 text-sm text-muted-foreground">
      {children}
    </p>
  );
}

export default ProjectView;
