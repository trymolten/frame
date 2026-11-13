"use client";

import "@/styles/globals.css";

import { routes } from "@/lib/routes";
import { Button } from "@/components/ui/button";
import { StatusView } from "@/components/status-view";

interface GlobalErrorProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
}

// Last resort when a root layout itself throws, so it renders its own
// document and avoids providers that may be what failed.
export default function GlobalError({ error, reset }: GlobalErrorProps) {
  return (
    <html lang="en">
      <body className="theme-frame min-h-svh bg-background font-sans text-foreground antialiased">
        <title>Something went wrong | Frame AI</title>
        <main className="flex min-h-svh">
          <StatusView
            title="Frame didn't load"
            description={
              <>
                Try again in a moment. If it keeps happening, reload the page.
                {error.digest && (
                  <span className="mt-2 block text-xs">
                    Reference: {error.digest}
                  </span>
                )}
              </>
            }
          >
            <Button className="rounded-full px-5" onClick={reset}>
              Try again
            </Button>
            {/* A full page load, since the app shell is what failed. */}
            <Button asChild variant="outline" className="rounded-full px-5">
              <a href={routes.home}>Go to home</a>
            </Button>
          </StatusView>
        </main>
      </body>
    </html>
  );
}
