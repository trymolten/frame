"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/status-view";

interface DashboardErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

// Renders inside the app shell, so the sidebar stays usable.
export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error("Dashboard route error:", error);
  }, [error]);

  return (
    <StatusView
      className="min-h-[calc(100svh-1rem)]"
      title="This page didn't load"
      description="Try again in a moment, or pick another page from the sidebar."
    >
      <Button className="rounded-full px-5" onClick={reset}>
        Try again
      </Button>
    </StatusView>
  );
}
