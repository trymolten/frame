import {
  FileCodeIcon,
  GithubIcon,
  HistoryIcon,
  TerminalIcon,
  UploadIcon,
} from "lucide-react";

import { FeatureList } from "@/modules/marketing/components/feature-list";

const FEATURES = [
  {
    icon: GithubIcon,
    title: "Sign in with GitHub",
    body: "Use the account you already have. No new password to remember.",
  },
  {
    icon: FileCodeIcon,
    title: "Read every file",
    body: "Browse the project tree and the exact code Frame wrote, line by line.",
  },
  {
    icon: TerminalIcon,
    title: "A real sandbox",
    body: "The agent runs commands, installs packages and starts your app in an isolated environment.",
  },
  {
    icon: HistoryIcon,
    title: "Every version kept",
    body: "Each reply saves a version, so you can step back to any point.",
  },
  {
    icon: UploadIcon,
    title: "Push to GitHub",
    body: "Send a project to a repository and keep working in your own editor.",
    soon: true,
  },
];

// Syntax colors for the illustrative code window, tuned for both themes.
const tone = {
  keyword: "text-[#ad3da4] dark:text-[#ff7ab2]",
  string: "text-[#c41a16] dark:text-[#fc6a5d]",
  type: "text-[#3900a0] dark:text-[#a167e6]",
  comment: "text-muted-foreground/70",
};

export function DevelopersSection() {
  return (
    <section
      id="developers"
      aria-labelledby="developers-heading"
      className="scroll-mt-20 border-t py-24 md:py-32"
    >
      <div className="mx-auto grid max-w-6xl gap-14 px-5 md:px-8 lg:grid-cols-2 lg:items-start lg:gap-20">
        <div>
          <p className="text-[15px] font-semibold text-brand">For developers</p>
          <h2
            id="developers-heading"
            className="mt-3 text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[48px]"
          >
            Real code. Yours to keep.
          </h2>
          <p className="mt-5 max-w-lg text-[17px] leading-[1.55] text-muted-foreground">
            Every project is a Next.js app written in TypeScript with Tailwind
            CSS and shadcn/ui. Nothing is hidden behind a proprietary format.
          </p>
          <div className="mt-10">
            <FeatureList features={FEATURES} />
          </div>
        </div>

        <CodeWindow />
      </div>
    </section>
  );
}

function CodeWindow() {
  return (
    <figure
      aria-label="Example of a file Frame wrote"
      className="overflow-hidden rounded-2xl border bg-card shadow-[0_24px_64px_-32px_rgb(0_0_0/0.35)] lg:sticky lg:top-28 lg:mt-12"
    >
      <div className="flex items-center gap-2 border-b bg-muted/60 px-4 py-2.5">
        <span className="size-2.5 rounded-full bg-[#ff5f57]" />
        <span className="size-2.5 rounded-full bg-[#febc2e]" />
        <span className="size-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 font-mono text-[12px] text-muted-foreground">
          components/habit-card.tsx
        </span>
      </div>
      <div className="grid grid-cols-[auto_1fr]">
        <ul className="hidden border-r bg-muted/30 py-3 font-mono text-[12px] text-muted-foreground sm:block">
          {[
            "app/",
            "  page.tsx",
            "components/",
            "  habit-card.tsx",
            "  week-chart.tsx",
            "lib/",
            "  streaks.ts",
          ].map((entry) => (
            <li
              key={entry}
              className={
                entry.trim() === "habit-card.tsx"
                  ? "bg-brand/10 px-4 py-0.5 whitespace-pre text-foreground"
                  : "px-4 py-0.5 whitespace-pre"
              }
            >
              {entry}
            </li>
          ))}
        </ul>
        <pre className="overflow-x-auto p-4 font-mono text-[12.5px] leading-6">
          <code>
            <span className={tone.keyword}>import</span>
            {" { Card } "}
            <span className={tone.keyword}>from</span>{" "}
            <span className={tone.string}>
              &quot;@/components/ui/card&quot;
            </span>
            {";\n\n"}
            <span className={tone.keyword}>export function</span>
            {" HabitCard({ habit }: "}
            <span className={tone.type}>Props</span>
            {") {\n"}
            {"  "}
            <span className={tone.comment}>
              {"// Streaks count consecutive days"}
            </span>
            {"\n  "}
            <span className={tone.keyword}>const</span>
            {" streak = getStreak(habit.days);\n\n  "}
            <span className={tone.keyword}>return</span>
            {" (\n    <Card className="}
            <span className={tone.string}>&quot;flex items-center&quot;</span>
            {
              ">\n      <span>{habit.name}</span>\n      <span>{streak} days</span>\n    </Card>\n  );\n}"
            }
          </code>
        </pre>
      </div>
    </figure>
  );
}
