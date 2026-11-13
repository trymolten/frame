import { ProjectsBrowserState } from "@/modules/dashboard/components/projects-browser";

export default function ProjectsLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ProjectsBrowserState>{children}</ProjectsBrowserState>;
}
