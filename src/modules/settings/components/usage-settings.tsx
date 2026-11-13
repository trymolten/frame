"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { describeCredits } from "@/modules/dashboard/lib/format";

// Grouped like iOS Settings: a quiet label, then one rounded group of rows.
function SettingsSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="space-y-2">
      <h2 id={id} className="px-1 text-sm font-medium text-muted-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function UsageSettings() {
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.getStatus.queryOptions());

  if (!usage) {
    return (
      <div role="status" className="space-y-8">
        <span className="sr-only">Loading usage…</span>
        <Skeleton aria-hidden className="h-[74px] rounded-xl" />
        <Skeleton aria-hidden className="h-[106px] rounded-xl" />
      </div>
    );
  }

  const isPro = usage.plan === "pro";
  const { percentLeft, resetLabel } = describeCredits(usage);

  return (
    <div className="space-y-8">
      <SettingsSection id="usage-plan" title="Plan">
        <Item variant="outline" className="rounded-xl px-4">
          <ItemContent>
            <ItemTitle>{isPro ? "Pro" : "Free"}</ItemTitle>
            <ItemDescription>
              {usage.total} credits every 30 days. Each build or change uses
              one.
            </ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button
              asChild
              size="sm"
              variant={isPro ? "outline" : "default"}
              className="rounded-full px-4"
            >
              <Link href={routes.pricing}>
                {isPro ? "Compare plans" : "Upgrade to Pro"}
              </Link>
            </Button>
          </ItemActions>
        </Item>
      </SettingsSection>

      <SettingsSection id="usage-credits" title="Credits">
        <Item
          variant="outline"
          className="flex-col items-stretch rounded-xl px-4"
        >
          <div className="flex items-baseline justify-between gap-4">
            <ItemTitle className="tabular-nums">
              {usage.remaining} of {usage.total} left
            </ItemTitle>
            <ItemDescription className="text-xs">{resetLabel}</ItemDescription>
          </div>
          <Progress
            value={percentLeft}
            aria-label="Credits left"
            aria-valuetext={`${usage.remaining} of ${usage.total} credits left`}
            className="h-1.5 bg-muted [&>[data-slot=progress-indicator]]:bg-[linear-gradient(90deg,var(--glow-blue),var(--glow-pink),var(--glow-orange))]"
          />
        </Item>
      </SettingsSection>
    </div>
  );
}
