"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceStrict } from "date-fns";

import { useTRPC } from "@/trpc/client";
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

export function CreditsCard() {
  const trpc = useTRPC();
  const { data: usage } = useQuery(trpc.usage.getStatus.queryOptions());

  if (!usage) {
    return <Skeleton className="h-[116px] rounded-xl" />;
  }

  const isFree = usage.plan === "free";
  const percent = usage.total > 0 ? (usage.remaining / usage.total) * 100 : 0;
  const resets =
    usage.msBeforeReset > 0
      ? `Resets in ${formatDistanceStrict(0, usage.msBeforeReset)}`
      : "Credits reset 30 days after first use";

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
          value={percent}
          aria-label="Credits remaining"
          className="h-1.5 bg-muted [&>[data-slot=progress-indicator]]:bg-[linear-gradient(90deg,var(--glow-blue),var(--glow-pink),var(--glow-orange))]"
        />
        <CardDescription className="text-xs">{resets}</CardDescription>
      </CardContent>
      {isFree && (
        <CardFooter className="px-3">
          <Button asChild size="sm" className="w-full">
            <Link href="/pricing">Upgrade to Pro</Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}
