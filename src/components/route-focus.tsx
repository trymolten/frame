"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

import { MAIN_CONTENT_ID } from "@/lib/routes";

interface ActivatedLink {
  href: string;
  navLabel: string;
}

// Next announces the new page title after a client navigation but leaves
// focus alone. When the focused element was removed with the old page (the
// card someone opened, a "View all" link), focus falls back to <body> and the
// next Tab starts from the top of the document. Move it somewhere useful:
// the same link in the same labelled <nav> if the new page has one (All /
// Starred on the projects page), otherwise the page's main region. Focus
// that survived the navigation, like a sidebar link, stays put.
export function RouteFocus() {
  const pathname = usePathname();
  const previousPathname = useRef(pathname);
  const lastLink = useRef<ActivatedLink | null>(null);

  useEffect(() => {
    // Enter on a link fires click too, so this covers keyboard use.
    const onClick = (event: MouseEvent) => {
      lastLink.current = null;
      // Modified clicks open a new tab or window; nothing navigates here.
      const opensElsewhere =
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey;
      if (opensElsewhere || !(event.target instanceof Element)) return;

      const link = event.target.closest("nav[aria-label] a[href]");
      const navLabel = link?.closest("nav")?.getAttribute("aria-label");
      if (link && navLabel) {
        lastLink.current = { href: link.getAttribute("href") ?? "", navLabel };
      }
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  useEffect(() => {
    if (previousPathname.current === pathname) return;
    previousPathname.current = pathname;

    const last = lastLink.current;
    lastLink.current = null;

    const focused = document.activeElement;
    if (focused && focused !== document.body) return;

    const sameLink = last
      ? Array.from(
          document.querySelectorAll<HTMLAnchorElement>(
            `nav[aria-label="${CSS.escape(last.navLabel)}"] a[href]`
          )
        ).find((link) => link.getAttribute("href") === last.href)
      : undefined;
    const target = sameLink ?? document.getElementById(MAIN_CONTENT_ID);
    target?.focus({ preventScroll: true });
  }, [pathname]);

  return null;
}
