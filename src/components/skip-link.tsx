import { MAIN_CONTENT_ID } from "@/lib/routes";

// First stop for keyboard users: jumps past the sidebar to the page itself.
// Sits above the viewport until it receives focus.
export function SkipLink() {
  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="fixed top-3 left-3 z-[60] -translate-y-[calc(100%+1rem)] rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background shadow-lg outline-none focus:translate-y-0 focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      Skip to content
    </a>
  );
}
