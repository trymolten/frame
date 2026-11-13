import { formatDistanceStrict, formatDistanceToNowStrict } from "date-fns";

import type { UsageStatus } from "@/modules/dashboard/types";

export function formatEdited(date: Date) {
  if (Date.now() - date.getTime() < 60_000) return "Edited just now";
  return `Edited ${formatDistanceToNowStrict(date, { addSuffix: true })}`;
}

// Shared by the sidebar credits card and Settings > Usage.
export function describeCredits(
  usage: Pick<UsageStatus, "total" | "remaining" | "msBeforeReset">
) {
  return {
    percentLeft: usage.total > 0 ? (usage.remaining / usage.total) * 100 : 0,
    resetLabel:
      usage.msBeforeReset > 0
        ? `Resets in ${formatDistanceStrict(0, usage.msBeforeReset)}`
        : "Credits reset 30 days after first use",
  };
}
