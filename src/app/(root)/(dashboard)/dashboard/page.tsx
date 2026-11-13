import type { Metadata } from "next";

import { DashboardHome } from "@/modules/dashboard/components/dashboard-home";

export const metadata: Metadata = {
  title: "Home",
};

// Served at "/" for signed-in users (see src/proxy.ts).
export default function DashboardPage() {
  return <DashboardHome />;
}
