import Link from "next/link";

import { MAIN_CONTENT_ID, routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/status-view";

// Shown with a 404 for unknown ids, malformed ids and other people's projects.
// The [projectId] layout's metadata supplies the "Project not found" title.
export default function ProjectNotFound() {
  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="flex min-h-svh outline-none"
    >
      <StatusView
        title="Project not found"
        description="It may have been deleted, or it belongs to an account you're not signed in to."
      >
        <Button asChild className="rounded-full px-5">
          <Link href={routes.projects}>Go to all projects</Link>
        </Button>
      </StatusView>
    </main>
  );
}
