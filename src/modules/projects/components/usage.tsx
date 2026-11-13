"use client";

import Link from "next/link";
import { CrownIcon } from "lucide-react";
import { formatDistanceStrict } from "date-fns";

import { Button } from "@/components/ui/button";
import type { inferRouterOutputs } from "@trpc/server";

import type { AppRouter } from "@/trpc/routers/_app";

type UsageStatus = inferRouterOutputs<AppRouter>["usage"]["getStatus"];

export function Usage({ usage }: Readonly<{ usage: UsageStatus }>) {
  const isPro = usage.plan === "pro";
  const resetsIn =
    usage.msBeforeReset > 0
      ? formatDistanceStrict(0, usage.msBeforeReset)
      : null;

  return (
    <div className="rounded-t-xl bg-background border border-b-0 p-2.5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm">
            {usage.remaining} {isPro ? "Pro" : "free"} credits remaining
          </p>
          {resetsIn && (
            <p className="text-sm text-muted-foreground">
              Resets in {resetsIn}
            </p>
          )}
        </div>
        {!isPro && (
          <Button asChild size="sm" variant="outline" className="ml-auto">
            <Link href="/pricing">
              <CrownIcon /> Upgrade
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
