"use client";

import { useReducedMotion } from "motion/react";
import { LiquidMetal } from "@paper-design/shaders-react";

import { cn } from "@/lib/utils";

interface LiquidMetalFrameProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * The brand's signature: content held in a bezel of moving liquid metal.
 * A static chrome gradient sits underneath, so the frame still reads as
 * metal before WebGL starts (or where it's unavailable).
 */
export function LiquidMetalFrame({
  children,
  className,
}: LiquidMetalFrameProps) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      className={cn(
        "relative isolate rounded-[30px] p-[9px] shadow-[0_40px_120px_-40px_rgb(0_0_0/0.45),0_12px_32px_-12px_rgb(0_0_0/0.25)]",
        "bg-[linear-gradient(135deg,#f6f7f9_0%,#b8bcc6_28%,#eef0f4_48%,#8f949f_72%,#e8eaee_100%)]",
        className
      )}
    >
      <LiquidMetal
        aria-hidden
        className="absolute inset-0 -z-10 overflow-hidden rounded-[30px]"
        style={{ width: "100%", height: "100%" }}
        colorBack="#c3c7cf"
        colorTint="#ffffff"
        shape="none"
        repetition={1.6}
        softness={0.75}
        shiftRed={0.06}
        shiftBlue={0.06}
        distortion={0.04}
        contour={0.15}
        angle={70}
        speed={reduceMotion ? 0 : 0.35}
        scale={1.4}
        fit="cover"
        maxPixelCount={1600 * 1000}
      />
      <div className="relative overflow-hidden rounded-[22px] bg-background ring-1 ring-black/10 dark:ring-white/10">
        {children}
      </div>
    </div>
  );
}
