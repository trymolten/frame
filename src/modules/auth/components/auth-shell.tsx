import Link from "next/link";
import { ArrowUpIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { FrameLogo } from "@/components/frame-logo";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col p-6 md:p-10">
        <Link
          href="/"
          className="flex w-fit items-center gap-2 rounded-md text-lg font-semibold tracking-tight outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <FrameLogo size={28} />
          Frame
        </Link>
        <div className="flex flex-1 items-center justify-center py-10">
          {children}
        </div>
      </div>

      <div className="hidden p-3 lg:block">
        <Card className="relative isolate h-full items-center justify-center gap-0 overflow-hidden rounded-3xl px-12 py-0 shadow-none">
          <div
            aria-hidden
            className="frame-glow absolute inset-x-[-15%] bottom-[-10%] -z-10 h-[90%]"
          />
          <p className="max-w-md text-center text-4xl font-semibold tracking-tight text-balance">
            Describe it. Watch it get built.
          </p>
          {/* Illustration of the composer, not a real input. */}
          <Card
            aria-hidden
            className="mt-10 w-full max-w-md gap-0 rounded-3xl bg-background/80 py-4 shadow-[0_8px_40px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl"
          >
            <CardContent className="px-4">
              <p className="min-h-12 text-[15px] text-foreground/80">
                Build a habit tracker with streaks, a weekly chart and reminders
              </p>
              <div className="flex justify-end">
                <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <ArrowUpIcon className="size-4" />
                </span>
              </div>
            </CardContent>
          </Card>
        </Card>
      </div>
    </div>
  );
}
