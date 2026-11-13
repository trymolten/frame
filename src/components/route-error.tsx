"use client";

import Link from "next/link";
import { useEffect } from "react";

import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/status-view";

interface RouteErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

// error.tsx for route groups without a design of their own (auth, blog,
// policies), so a page error keeps the group's layout instead of falling
// through to global-error.
export function RouteError({ error, reset }: RouteErrorProps) {
  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  return (
    <StatusView
      className="min-h-[60svh]"
      title="This page didn't load"
      description="Try again in a moment, or go back to the home page."
    >
      <Button className="rounded-full px-5" onClick={reset}>
        Try again
      </Button>
      <Button asChild variant="outline" className="rounded-full px-5">
        <Link href={routes.home}>Go to home</Link>
      </Button>
    </StatusView>
  );
}
