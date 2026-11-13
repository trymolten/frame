"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { isActivePath } from "@/lib/routes";

export interface PillNavItem {
  href: string;
  label: string;
  /** Stay active on pages below href, like /settings/account/security. */
  includeChildren?: boolean;
}

interface PillNavProps {
  /** Names the landmark for screen readers, e.g. "Settings". */
  label: string;
  items: readonly PillNavItem[];
  className?: string;
}

// Links between sibling pages, styled like the home page's segmented tabs.
// They are real links with aria-current rather than tabs, because each one
// is its own URL. A parent of the current page gets aria-current="true",
// since it doesn't link to the page itself.
export function PillNav({ label, items, className }: PillNavProps) {
  const pathname = usePathname();

  return (
    <nav aria-label={label} className={className}>
      <ul className="flex items-center gap-1">
        {items.map((item) => {
          const isPage = isActivePath(pathname, item.href);
          const isActive =
            isPage ||
            isActivePath(pathname, item.href, {
              includeChildren: item.includeChildren,
            });
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isPage ? "page" : isActive ? "true" : undefined}
                data-active={isActive}
                className={cn(
                  "inline-flex h-8 items-center rounded-full px-3 text-sm font-medium whitespace-nowrap text-muted-foreground transition-colors outline-none hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50",
                  "data-[active=true]:bg-muted data-[active=true]:text-foreground"
                )}
              >
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
