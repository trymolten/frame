"use client";

import { useUser } from "@clerk/nextjs";

import { PromptComposer } from "@/modules/dashboard/components/prompt-composer";
import { ProjectsSection } from "@/modules/dashboard/components/projects-section";

export function DashboardHome() {
  const { user } = useUser();
  const firstName = user?.firstName?.trim();

  return (
    <>
      <section className="relative isolate flex min-h-[calc(100svh-6rem)] flex-col items-center justify-center overflow-hidden px-5 pt-20 pb-32">
        <div
          aria-hidden
          className="brand-glow pointer-events-none absolute inset-x-[-15%] bottom-[-4%] -z-10 h-[90%]"
        />
        <h1 className="max-w-3xl text-center text-4xl leading-[1.1] font-semibold tracking-[-0.025em] text-balance md:text-5xl">
          What should we build{firstName ? `, ${firstName}` : ""}?
        </h1>
        <p className="mt-4 max-w-xl text-center text-base text-pretty text-muted-foreground md:text-lg">
          Describe an app or website. Molten writes the code and runs it in a
          live preview.
        </p>
        <div className="mt-9 w-full max-w-2xl">
          <PromptComposer />
        </div>
      </section>
      <ProjectsSection />
    </>
  );
}
