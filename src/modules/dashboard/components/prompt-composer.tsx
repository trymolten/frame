"use client";

import { toast } from "sonner";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  ArrowUpIcon,
  ChevronDownIcon,
  GlobeIcon,
  Loader2Icon,
  LockIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { routes } from "@/lib/routes";
import { useAutosizeTextarea } from "@/hooks/use-autosize-textarea";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupTextarea,
} from "@/components/ui/input-group";

type Visibility = "PUBLIC" | "PRIVATE";

const VISIBILITY = {
  PUBLIC: {
    label: "Public",
    hint: "Anyone with the link can view",
    icon: GlobeIcon,
  },
  PRIVATE: {
    label: "Private",
    hint: "Only you can view",
    icon: LockIcon,
  },
} as const;

const SUGGESTIONS = [
  {
    label: "Habit tracker",
    prompt:
      "Build a habit tracker with daily check-ins, streak counters and a weekly progress chart.",
  },
  {
    label: "Portfolio site",
    prompt:
      "Build a personal portfolio with a hero, a grid of case studies and a contact form.",
  },
  {
    label: "Kanban board",
    prompt:
      "Build a kanban board with draggable cards across To do, In progress and Done columns.",
  },
  {
    label: "Recipe finder",
    prompt:
      "Build a recipe finder where I can search by ingredient and save favourites.",
  },
  {
    label: "SaaS landing page",
    prompt:
      "Build a landing page for a scheduling app with pricing tiers, FAQs and testimonials.",
  },
] as const;

const MAX_LENGTH = 10000;

export function PromptComposer() {
  const trpc = useTRPC();
  const router = useRouter();
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [value, setValue] = useState("");
  const [visibility, setVisibility] = useState<Visibility>("PUBLIC");
  useAutosizeTextarea(textareaRef, value);

  const createProject = useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (project) => {
        queryClient.invalidateQueries({
          queryKey: trpc.projects.list.pathKey(),
        });
        queryClient.invalidateQueries(trpc.usage.getStatus.queryFilter());
        router.push(routes.project(project.id));
      },
      onError: (error) => {
        if (error.data?.code === "TOO_MANY_REQUESTS") {
          toast.error(error.message, {
            action: {
              label: "View plans",
              onClick: () => router.push(routes.pricing),
            },
          });
          return;
        }
        toast.error(error.message);
      },
    })
  );

  const trimmed = value.trim();
  // Stay disabled after success too: the route change is still in flight.
  const isBusy = createProject.isPending || createProject.isSuccess;
  const canSubmit = trimmed.length > 0 && !isBusy;

  const submit = () => {
    if (!canSubmit) return;
    createProject.mutate({ value: trimmed, visibility });
  };

  const current = VISIBILITY[visibility];

  return (
    <div className="w-full">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <InputGroup
          className={cn(
            "rounded-[28px] border-black/[0.06] bg-background/95 p-1.5 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_48px_-12px_rgb(0_0_0/0.22)] backdrop-blur-xl dark:border-white/10 dark:bg-card/95",
            // A quieter focus treatment than the default 3px ring.
            "has-[[data-slot=input-group-control]:focus-visible]:border-black/15 has-[[data-slot=input-group-control]:focus-visible]:ring-ring/20 dark:has-[[data-slot=input-group-control]:focus-visible]:border-white/20"
          )}
        >
          <InputGroupTextarea
            ref={textareaRef}
            autoFocus
            value={value}
            maxLength={MAX_LENGTH}
            disabled={isBusy}
            aria-label="Describe what you want to build"
            placeholder="Ask Molten to build a dashboard for tracking my workouts…"
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                submit();
              }
            }}
            className="max-h-64 min-h-16 px-3 text-[15px] leading-6 placeholder:text-muted-foreground/80 md:text-[15px]"
          />
          <InputGroupAddon align="block-end" className="px-1.5 pb-1.5">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton
                  size="sm"
                  className="rounded-full text-muted-foreground hover:text-foreground"
                >
                  <current.icon />
                  {current.label}
                  <ChevronDownIcon className="opacity-60" />
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-60">
                <DropdownMenuRadioGroup
                  value={visibility}
                  onValueChange={(next) => setVisibility(next as Visibility)}
                >
                  {(Object.keys(VISIBILITY) as Visibility[]).map((key) => {
                    const option = VISIBILITY[key];
                    return (
                      <DropdownMenuRadioItem
                        key={key}
                        value={key}
                        className="items-start"
                      >
                        <span>
                          <span className="block font-medium">
                            {option.label}
                          </span>
                          <span className="block text-xs text-muted-foreground">
                            {option.hint}
                          </span>
                        </span>
                      </DropdownMenuRadioItem>
                    );
                  })}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <InputGroupButton
              type="submit"
              variant="default"
              size="icon-sm"
              disabled={!canSubmit}
              aria-label="Start building"
              className="ml-auto rounded-full"
            >
              {isBusy ? (
                <Loader2Icon className="animate-spin" />
              ) : (
                <ArrowUpIcon />
              )}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </form>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {SUGGESTIONS.map((suggestion) => (
          <Button
            key={suggestion.label}
            type="button"
            variant="outline"
            size="sm"
            disabled={isBusy}
            onClick={() => {
              setValue(suggestion.prompt);
              textareaRef.current?.focus();
            }}
            className="rounded-full bg-background/70 font-normal text-foreground/80 shadow-none backdrop-blur hover:text-foreground dark:bg-background/40"
          >
            {suggestion.label}
          </Button>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        {isBusy ? "Creating your project" : ""}
      </p>
    </div>
  );
}
