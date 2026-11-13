import Link from "next/link";
import type { Metadata } from "next";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FREE_USAGE_POINTS, PRO_USAGE_POINTS } from "@/constants/usage";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Start free with Molten. Upgrade to Pro for more monthly credits, or bring your team to a shared workspace.",
};

const PLANS = [
  {
    name: "Free",
    description: "For trying Molten and small experiments.",
    features: [
      `${FREE_USAGE_POINTS} credits every 30 days`,
      "Personal workspace",
      "Live preview and code view",
      "Version history",
      "Sign in with GitHub, Google or email",
    ],
    cta: { label: "Start building", href: "/sign-up" },
  },
  {
    name: "Pro",
    description: "For building seriously on your own.",
    features: [
      `${PRO_USAGE_POINTS} credits every 30 days`,
      "Everything in Free",
    ],
    cta: { label: "Start with Pro", href: "/sign-up" },
    featured: true,
  },
  {
    name: "Teams",
    description: "For companies building together.",
    features: [
      "Organizations with shared projects",
      "Admin, member and viewer roles",
      "Credits shared across the workspace",
      "Single sign-on",
    ],
    soon: true,
  },
] as const;

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-32 pb-24 sm:pt-40 md:px-8 md:pb-32">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-[40px] leading-[1.05] font-semibold tracking-[-0.035em] text-balance sm:text-[64px]">
          Simple plans. Start free.
        </h1>
        <p className="mx-auto mt-5 max-w-lg text-[19px] leading-[1.45] text-pretty text-muted-foreground">
          Every message that builds or changes your app uses one credit. Credits
          reset 30 days after you first use them.
        </p>
      </div>

      <ul className="mt-16 grid gap-5 md:grid-cols-3">
        {PLANS.map((plan) => {
          const featured = "featured" in plan && plan.featured;
          const soon = "soon" in plan && plan.soon;
          return (
            <li key={plan.name} className="flex">
              <Card
                className={cn(
                  "w-full gap-0 rounded-3xl py-0 shadow-none",
                  featured &&
                    "border-foreground/80 shadow-[0_24px_64px_-32px_rgb(0_0_0/0.35)]"
                )}
              >
                <CardHeader className="gap-2 px-7 pt-7">
                  <CardTitle className="flex items-center gap-2 text-[21px] font-semibold tracking-[-0.02em]">
                    {plan.name}
                    {soon && (
                      <Badge variant="secondary" className="font-medium">
                        Soon
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="text-[15px]">
                    {plan.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 px-7 pt-6">
                  <ul className="space-y-3">
                    {plan.features.map((feature) => (
                      <li
                        key={feature}
                        className="flex items-start gap-2.5 text-[15px]"
                      >
                        <CheckIcon
                          aria-hidden
                          className="mt-0.5 size-4 shrink-0 text-brand"
                          strokeWidth={2.5}
                        />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="px-7 pt-8 pb-7">
                  {"cta" in plan ? (
                    <Button
                      asChild
                      variant={featured ? "default" : "outline"}
                      className="h-11 w-full rounded-full text-[15px]"
                    >
                      <Link href={plan.cta.href}>{plan.cta.label}</Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="h-11 w-full rounded-full text-[15px]"
                    >
                      Coming soon
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
