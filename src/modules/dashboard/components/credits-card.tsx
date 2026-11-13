"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";

import { useTRPC } from "@/trpc/client";
import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { describeCredits } from "@/modules/dashboard/lib/format";

export function CreditsCard() {
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.getStatus.queryOptions());

  if (!usage) {
    return <Skeleton className="h-[116px] rounded-xl" />;
  }

  const isFree = usage.plan === "free";
  const { percentLeft, resetLabel } = describeCredits(usage);

  return (
    <Card className="gap-3 py-3 shadow-none">
      <CardHeader className="px-3">
        <CardTitle className="text-sm">
          {isFree ? "Free plan" : "Pro plan"}
        </CardTitle>
        <CardAction className="text-sm text-muted-foreground tabular-nums">
          {usage.remaining} of {usage.total} left
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-2 px-3">
        <Progress
          value={percentLeft}
          aria-label="Credits remaining"
          className="h-1.5 bg-muted [&>[data-slot=progress-indicator]]:bg-[linear-gradient(90deg,var(--glow-cobalt),var(--glow-iris),var(--glow-silver))]"
        />
        <CardDescription className="text-xs">{resetLabel}</CardDescription>
      </CardContent>
      {isFree && (
        <CardFooter className="px-3">
          <Button asChild size="sm" className="w-full">
            <Link href={routes.pricing}>Upgrade to Pro</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
