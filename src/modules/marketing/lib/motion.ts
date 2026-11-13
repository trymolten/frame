import type { Transition } from "motion/react";

// Apple-like springs: quick to start, settle without bounce.
export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 32,
  mass: 0.9,
};

export const gentleSpring: Transition = {
  type: "spring",
  stiffness: 140,
  damping: 26,
};

// Shared press feedback for primary actions (user-triggered motion only).
export const pressable = {
  whileHover: { scale: 1.015 },
  whileTap: { scale: 0.97 },
  transition: spring,
} as const;
