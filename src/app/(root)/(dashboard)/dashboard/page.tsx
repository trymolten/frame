import type { Metadata } from "next";

import { DashboardHome } from "@/modules/dashboard/components/dashboard-home";

export const metadata: Metadata = {
  title: "Home",
};

// Served at "/" for signed-in users; /dashboard itself redirects there
// (see src/proxy.ts and src/lib/routes.ts).
export default function DashboardPage() {
  return <DashboardHome />;
}
