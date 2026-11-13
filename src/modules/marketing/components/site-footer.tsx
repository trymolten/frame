"use client";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { BrandMark } from "@/modules/marketing/components/brand-mark";
import { useWebsiteHomeHref } from "@/modules/marketing/hooks/use-website-home";

function footerGroups(websiteHome: string) {
  return [
    {
      title: "Product",
      links: [
        { href: `${websiteHome}#how-it-works`, label: "How it works" },
        { href: `${websiteHome}#developers`, label: "For developers" },
        { href: `${websiteHome}#teams`, label: "For teams" },
        { href: "/pricing", label: "Pricing" },
      ],
    },
    {
      title: "Account",
      links: [
        { href: "/sign-in", label: "Sign in" },
        { href: "/sign-up", label: "Create an account" },
      ],
    },
    {
      title: "Legal",
      links: [
        { href: "/privacy-policy", label: "Privacy policy" },
        { href: "/term-of-service", label: "Terms of service" },
      ],
    },
  ];
}

export function SiteFooter() {
  const websiteHome = useWebsiteHomeHref();

  return (
    <footer className="border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-5 pt-14 pb-10 md:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Link href={websiteHome} className="inline-flex items-center gap-2">
              <BrandMark size={24} />
              <span className="font-semibold tracking-[-0.02em]">
                {siteConfig.name}
              </span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              {siteConfig.tagline}
            </p>
          </div>
          {footerGroups(websiteHome).map((group) => (
            <nav key={group.title} aria-label={group.title}>
              <h2 className="text-xs font-semibold text-foreground">
                {group.title}
              </h2>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        <Separator className="mt-12 mb-6" />
        <div className="flex items-center justify-between gap-4 text-xs text-muted-foreground">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
