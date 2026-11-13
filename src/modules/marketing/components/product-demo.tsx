"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "motion/react";
import {
  ArrowUpIcon,
  CheckIcon,
  FlameIcon,
  Loader2Icon,
  RotateCcwIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { spring } from "@/modules/marketing/lib/motion";

const PROMPT = "Build a habit tracker with streaks and a weekly chart";

const STEPS = [
  "Planned the screens and data model",
  "Wrote app/page.tsx and 4 components",
  "Installed recharts",
  "Started the app on port 3000",
];

const HABITS = [
  { name: "Read 20 pages", streak: 12, done: true },
  { name: "Morning run", streak: 5, done: true },
  { name: "Meditate", streak: 30, done: false },
];

const WEEK = [
  { day: "M", value: 3 },
  { day: "T", value: 2 },
  { day: "W", value: 3 },
  { day: "T", value: 1 },
  { day: "F", value: 3 },
  { day: "S", value: 2 },
  { day: "S", value: 3 },
];

const TYPE_MS = 28;
const STEP_MS = 520;

/**
 * The hero's one orchestrated moment: a prompt is typed, the agent's steps
 * tick off, and the generated app appears. Plays once when scrolled into
 * view; shows the finished state immediately for reduced motion.
 */
export function ProductDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const reduceMotion = useReducedMotion();
  const [run, setRun] = useState(0);
  const [typed, setTyped] = useState(0);
  const [steps, setSteps] = useState(0);

  const done = reduceMotion || steps > STEPS.length;
  const visibleTyped = reduceMotion ? PROMPT.length : typed;
  const visibleSteps = reduceMotion
    ? STEPS.length
    : Math.min(steps, STEPS.length);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    let char = 0;
    const typing = setInterval(() => {
      char += 1;
      setTyped(char);
      if (char >= PROMPT.length) {
        clearInterval(typing);
        for (let i = 1; i <= STEPS.length + 1; i++) {
          timers.push(setTimeout(() => setSteps(i), 350 + i * STEP_MS));
        }
      }
    }, TYPE_MS);
    return () => {
      clearInterval(typing);
      timers.forEach(clearTimeout);
    };
  }, [inView, reduceMotion, run]);

  const replay = () => {
    setTyped(0);
    setSteps(0);
    setRun((n) => n + 1);
  };

  return (
    <div ref={ref} className="relative">
      <p className="sr-only">
        Animation: someone asks Frame to build a habit tracker with streaks and
        a weekly chart. Frame plans the screens, writes the code, installs a
        charting library and starts the app, which then appears in a live
        preview.
      </p>
      <div aria-hidden className="select-none">
        <WindowChrome />
        <div className="grid md:grid-cols-[minmax(0,5fr)_minmax(0,8fr)]">
          <ChatPane typed={visibleTyped} steps={visibleSteps} done={done} />
          <PreviewPane done={done} reduceMotion={!!reduceMotion} />
        </div>
      </div>
      {done && !reduceMotion && (
        <Button
          variant="ghost"
          size="sm"
          onClick={replay}
          className="absolute top-2 right-3 h-7 rounded-full px-2.5 text-xs text-muted-foreground sm:right-[136px]"
        >
          <RotateCcwIcon className="size-3" />
          Replay
        </Button>
      )}
    </div>
  );
}

function WindowChrome() {
  return (
    <div className="grid h-11 grid-cols-[1fr_auto_1fr] items-center border-b bg-muted/60 px-4">
      <div className="flex gap-2">
        <span className="size-3 rounded-full bg-[#ff5f57]" />
        <span className="size-3 rounded-full bg-[#febc2e]" />
        <span className="size-3 rounded-full bg-[#28c840]" />
      </div>
      <span className="text-[13px] font-medium text-muted-foreground">
        habit-tracker
      </span>
      <div className="flex justify-end">
        <div className="hidden rounded-lg bg-background/80 p-0.5 text-[12px] shadow-xs ring-1 ring-border sm:flex">
          <span className="rounded-md bg-muted px-2.5 py-0.5 font-medium">
            Preview
          </span>
          <span className="px-2.5 py-0.5 text-muted-foreground">Code</span>
        </div>
      </div>
    </div>
  );
}

function ChatPane({
  typed,
  steps,
  done,
}: {
  typed: number;
  steps: number;
  done: boolean;
}) {
  const typing = typed > 0 && typed < PROMPT.length;

  return (
    <div className="flex flex-col border-b bg-muted/30 md:min-h-[440px] md:border-r md:border-b-0">
      <div className="flex-1 space-y-4 p-4 sm:p-5">
        {typed > 0 && (
          <div className="flex justify-end">
            <p className="max-w-[85%] rounded-[18px] rounded-br-md bg-brand px-3.5 py-2 text-[14px] leading-5 text-brand-foreground">
              {PROMPT.slice(0, typed)}
              {typing && (
                <span className="ml-0.5 inline-block h-4 w-px translate-y-0.5 animate-pulse bg-current" />
              )}
            </p>
          </div>
        )}

        <ul className="space-y-2">
          <AnimatePresence initial={false}>
            {STEPS.slice(0, steps).map((step) => (
              <motion.li
                key={step}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={spring}
                className="flex items-center gap-2 text-[13px] text-muted-foreground"
              >
                <span className="flex size-4 items-center justify-center rounded-full bg-foreground/90 text-background">
                  <CheckIcon className="size-2.5" strokeWidth={3} />
                </span>
                {step}
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <AnimatePresence>
          {done && (
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={spring}
              className="max-w-[85%] rounded-[18px] rounded-bl-md bg-background px-3.5 py-2 text-[14px] leading-5 shadow-xs ring-1 ring-border"
            >
              Your habit tracker is live. Want reminders next?
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      <div className="p-3 pt-0">
        <div className="flex items-center gap-2 rounded-full bg-background py-1.5 pr-1.5 pl-4 text-[13px] text-muted-foreground shadow-xs ring-1 ring-border">
          <span className="flex-1 truncate">Ask for a change…</span>
          <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background">
            <ArrowUpIcon className="size-3.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

function PreviewPane({
  done,
  reduceMotion,
}: {
  done: boolean;
  reduceMotion: boolean;
}) {
  return (
    <div className="flex flex-col bg-background">
      <div className="flex items-center justify-center border-b px-4 py-2">
        <span className="rounded-md bg-muted px-3 py-0.5 text-[12px] text-muted-foreground">
          localhost:3000
        </span>
      </div>
      <div className="relative min-h-[300px] flex-1 p-5 sm:p-7 md:min-h-[396px]">
        <AnimatePresence mode="wait">
          {done ? (
            <motion.div
              key="app"
              initial={reduceMotion ? false : { opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={spring}
              className="mx-auto max-w-md"
            >
              <GeneratedApp reduceMotion={reduceMotion} />
            </motion.div>
          ) : (
            <motion.div
              key="building"
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-[13px] text-muted-foreground"
            >
              <Loader2Icon className="size-4 animate-spin" />
              Building your app
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// A small stand-in for "the app Frame generated", drawn with plain elements.
function GeneratedApp({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div className="space-y-5">
      <div>
        <p className="text-[12px] text-muted-foreground">Thursday</p>
        <p className="text-[22px] font-semibold tracking-[-0.02em]">Today</p>
      </div>

      <ul className="divide-y overflow-hidden rounded-2xl bg-muted/50 ring-1 ring-border">
        {HABITS.map((habit) => (
          <li
            key={habit.name}
            className="flex items-center gap-3 px-4 py-2.5 text-[14px]"
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full ring-1",
                habit.done
                  ? "bg-emerald-500 text-white ring-emerald-500"
                  : "ring-border"
              )}
            >
              {habit.done && <CheckIcon className="size-3" strokeWidth={3} />}
            </span>
            <span className="flex-1">{habit.name}</span>
            <span className="flex items-center gap-1 text-[12px] text-muted-foreground tabular-nums">
              <FlameIcon className="size-3 text-orange-500" />
              {habit.streak}
            </span>
          </li>
        ))}
      </ul>

      <div className="rounded-2xl bg-muted/50 p-4 ring-1 ring-border">
        <p className="text-[12px] font-medium text-muted-foreground">
          This week
        </p>
        <div className="mt-3 flex h-24 items-end gap-2">
          {WEEK.map((bar, i) => (
            <div
              key={i}
              className="flex h-full flex-1 flex-col items-center gap-1.5"
            >
              <div className="flex w-full flex-1 items-end">
                <motion.div
                  className="w-full rounded-md bg-emerald-500/85"
                  initial={reduceMotion ? false : { height: 0 }}
                  animate={{ height: `${(bar.value / 3) * 100}%` }}
                  transition={{
                    ...spring,
                    delay: reduceMotion ? 0 : 0.15 + i * 0.05,
                  }}
                />
              </div>
              <span className="text-[10px] text-muted-foreground">
                {bar.day}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
