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
import { useCurrentTheme } from "@/hooks/use-current-theme";

import { Button } from "@/components/ui/button";
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
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
          defaultSize={35}
          minSize={20}
          className="flex flex-col min-h-0"
        >
          <ErrorBoundary
            fallback={<div>Error: Failed to load project header</div>}
          >
            <Suspense fallback={<div>Loading Project Header...</div>}>
              <ProjectHeader projectId={projectId} />
            </Suspense>
          </ErrorBoundary>
          <ErrorBoundary
            fallback={<div>Error: Failed to load project messages</div>}
          >
            <Suspense fallback={<div>Loading Project Messages...</div>}>
              <ProjectMessagesContainer
                activeFragment={activeFragment}
                setActiveFragment={setActiveFragment}
                projectId={projectId}
              />
            </Suspense>
          </ErrorBoundary>
        </ResizablePanel>
        <ResizableHandle className="hover:bg-primary transition-colors" />
        <ResizablePanel defaultSize={65} minSize={50}>
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
                    <Link href="/pricing">
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

export default ProjectView;
