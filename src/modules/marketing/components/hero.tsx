"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { AuthCta } from "@/modules/marketing/components/auth-cta";
import { ProductDemo } from "@/modules/marketing/components/product-demo";
import { LiquidMetalFrame } from "@/modules/marketing/components/liquid-metal-frame";

export function Hero() {
  const windowRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // The product window settles from a slight tilt as it scrolls into view.
  const { scrollYProgress } = useScroll({
    target: windowRef,
    offset: ["start end", "start 30%"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);

  return (
    <section className="relative overflow-hidden pt-32 pb-24 sm:pt-40 md:pb-32">
      <div className="mx-auto max-w-6xl px-5 md:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-[44px] leading-[1.04] font-semibold tracking-[-0.035em] text-balance sm:text-[64px] lg:text-[80px]">
            From a sentence to a running app.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-[19px] leading-[1.45] text-pretty text-muted-foreground sm:text-[21px]">
            Frame writes real Next.js code, runs it in a live sandbox and keeps
            every version. Build on your own, or with your whole team.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <AuthCta />
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 rounded-full px-6 text-[17px] text-brand hover:bg-brand/8 hover:text-brand"
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>
          <p className="mt-4 text-[13px] text-muted-foreground">
            Free to start. No credit card needed.
          </p>
        </div>

        <div ref={windowRef} className="mt-16 [perspective:1600px] sm:mt-20">
          <motion.div
            style={reduceMotion ? undefined : { scale, rotateX }}
            className="origin-top will-change-transform"
          >
            <LiquidMetalFrame>
              <ProductDemo />
            </LiquidMetalFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
