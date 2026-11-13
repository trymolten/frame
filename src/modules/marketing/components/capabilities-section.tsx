import {
  AlertCircleIcon,
  GaugeIcon,
  MessageSquareTextIcon,
  MonitorPlayIcon,
  SearchIcon,
  Undo2Icon,
} from "lucide-react";

const CAPABILITIES = [
  {
    icon: MonitorPlayIcon,
    title: "Live preview",
    body: "Your app runs while it's being built, not after.",
  },
  {
    icon: MessageSquareTextIcon,
    title: "Change it by chatting",
    body: "Ask for an edit in plain words and Frame updates the code.",
  },
  {
    icon: Undo2Icon,
    title: "Step back anytime",
    body: "Every reply is a version you can return to.",
  },
  {
    icon: SearchIcon,
    title: "Find anything",
    body: "Search every project with ⌘K and star the ones you use most.",
  },
  {
    icon: GaugeIcon,
    title: "Credits you can see",
    body: "A clear meter shows what's left and when it resets.",
  },
  {
    icon: AlertCircleIcon,
    title: "Failures you can act on",
    body: "If a build fails, Frame says so in the chat instead of spinning.",
  },
];

export function CapabilitiesSection() {
  return (
    <section
      aria-labelledby="capabilities-heading"
      className="border-t py-24 md:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <h2
          id="capabilities-heading"
          className="max-w-2xl text-[34px] leading-[1.1] font-semibold tracking-[-0.03em] text-balance sm:text-[48px]"
        >
          The details are already handled.
        </h2>
        <ul className="mt-14 grid gap-px overflow-hidden rounded-2xl border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <li key={item.title} className="bg-background p-7">
              <item.icon
                aria-hidden
                className="size-6 text-foreground"
                strokeWidth={1.5}
              />
              <h3 className="mt-5 text-[17px] font-semibold tracking-[-0.01em]">
                {item.title}
              </h3>
              <p className="mt-1.5 text-[15px] leading-[1.5] text-muted-foreground">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
