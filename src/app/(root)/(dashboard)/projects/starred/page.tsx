import type { Metadata } from "next";

import { ProjectsBrowser } from "@/modules/dashboard/components/projects-browser";

export const metadata: Metadata = {
  title: "Starred projects",
};

// A static segment, so it wins over /projects/[projectId]. Project ids are
// UUIDs, so no project can ever be called "starred".
export default function StarredProjectsPage() {
  return <ProjectsBrowser filter="starred" />;
}
