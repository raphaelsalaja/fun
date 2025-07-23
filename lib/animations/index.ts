import type { Transition } from "motion/react";

export const ANIMATION_CONFIG = {
  ease: [1, -0.4, 0.35, 0.95] as const,
} satisfies Transition;

export const SPRING_CONFIG = {
  type: "spring" as const,
  stiffness: 900,
  damping: 80,
  mass: 10,
};

export const scale = {
  initial: { opacity: 0, scale: 0 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
  transition: ANIMATION_CONFIG,
};

export const blur = {
  initial: { opacity: 0, filter: "blur(4px)" },
  animate: { opacity: 1, filter: "blur(0px)" },
  exit: { opacity: 0, filter: "blur(4px)" },
  transition: ANIMATION_CONFIG,
};

export const loading = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
  transition: ANIMATION_CONFIG,
};
