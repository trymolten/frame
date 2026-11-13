import type { Metadata } from "next";

import { ProjectsBrowser } from "@/modules/dashboard/components/projects-browser";

export const metadata: Metadata = {
  title: "All projects",
};

export default function ProjectsPage() {
  return <ProjectsBrowser filter="all" />;
}
