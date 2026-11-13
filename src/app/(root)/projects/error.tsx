"use client";

import Link from "next/link";
import { useEffect } from "react";

import { MAIN_CONTENT_ID, routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/status-view";

interface ProjectErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

export default function ProjectError({ error, reset }: ProjectErrorProps) {
  useEffect(() => {
    console.error("Project route error:", error);
  }, [error]);

  return (
    <main
      id={MAIN_CONTENT_ID}
      tabIndex={-1}
      className="flex min-h-svh outline-none"
    >
      <StatusView
        title="This project didn't open"
        description="Molten couldn't load it just now. Try again, or go back to your projects."
      >
        <Button className="rounded-full px-5" onClick={reset}>
          Try again
        </Button>
        <Button asChild variant="outline" className="rounded-full px-5">
          <Link href={routes.projects}>Go to all projects</Link>
        </Button>
      </StatusView>
    </main>
  );
}
