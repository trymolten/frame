"use client";

import Link from "next/link";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AuthCta, SignInLink } from "@/modules/marketing/components/auth-cta";
import { BrandMark } from "@/modules/marketing/components/brand-mark";

export const NAV_LINKS = [
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#developers", label: "Developers" },
  { href: "/#teams", label: "Teams" },
  { href: "/pricing", label: "Pricing" },
] as const;

export function SiteHeader() {
  const { isScrolled } = useScroll(8);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300",
        "border-b border-transparent",
        isScrolled &&
          "border-border/70 bg-background/80 backdrop-blur-xl backdrop-saturate-150"
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-5 md:px-8">
        <Link
          href="/"
          className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring"
        >
          <BrandMark size={26} />
          <span className="text-[17px] font-semibold tracking-[-0.02em]">
            {siteConfig.name}
          </span>
        </Link>

        <nav aria-label="Main" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="rounded-full font-normal text-muted-foreground hover:bg-transparent hover:text-foreground"
                >
                  <Link href={link.href}>{link.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <SignInLink className="hidden sm:inline-flex" />
          <AuthCta size="sm" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full md:hidden"
          aria-label="Open menu"
        >
          <MenuIcon />
        </Button>
      </SheetTrigger>
      <SheetContent side="top" className="rounded-b-3xl pb-6">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <BrandMark size={22} />
            {siteConfig.name}
          </SheetTitle>
        </SheetHeader>
        <nav aria-label="Mobile" className="px-4">
          <ul className="divide-y divide-border">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <SheetClose asChild>
                  <Link
                    href={link.href}
                    className="block py-3 text-[17px] tracking-[-0.01em]"
                  >
                    {link.label}
                  </Link>
                </SheetClose>
              </li>
            ))}
            <li>
              <SheetClose asChild>
                <Link
                  href="/sign-in"
                  className="block py-3 text-[17px] tracking-[-0.01em]"
                >
                  Sign in
                </Link>
              </SheetClose>
            </li>
          </ul>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
