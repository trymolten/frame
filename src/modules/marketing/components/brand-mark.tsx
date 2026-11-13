"use client";

import { useReducedMotion } from "motion/react";
import { LiquidMetal } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: number;
  className?: string;
}

// Molten's logo: the liquid-metal daisy, rendered live. Holds still when the
// user prefers reduced motion.
export function BrandMark({ size = 28, className }: BrandMarkProps) {
  const reduceMotion = useReducedMotion();

  return (
    <span
      aria-hidden
      className={cn(
        "inline-block shrink-0 overflow-hidden rounded-full",
        className
      )}
      style={{ width: size, height: size }}
    >
      <LiquidMetal
        width={size}
        height={size}
        colorBack="#000000"
        colorTint="#ffffff"
        shape="daisy"
        repetition={2}
        softness={0.1}
        shiftRed={0.3}
        shiftBlue={0.3}
        distortion={0.07}
        contour={0.4}
        angle={70}
        speed={reduceMotion ? 0 : 0.8}
        scale={0.8}
        fit="cover"
      />
    </span>
  );
}
