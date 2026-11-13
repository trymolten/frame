import type { Metadata } from "next";

import { UsageSettings } from "@/modules/settings/components/usage-settings";

export const metadata: Metadata = {
  title: "Usage",
};

// The dashboard layout prefetches usage, so this renders without a spinner.
export default function UsageSettingsPage() {
  return <UsageSettings />;
}
