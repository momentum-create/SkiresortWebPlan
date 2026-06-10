"use client";

import { useReducedMotion } from "framer-motion";
import {
  chipSlide,
  fadeUp,
  staticContainer,
  staticVisible,
  staggerContainer,
} from "@/lib/motion";

type ViewportMargin = "-20px" | "-40px";

export function useScrollReveal(viewportMargin: ViewportMargin = "-40px") {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return {
      prefersReducedMotion: true,
      containerVariants: staticContainer,
      itemVariants: staticVisible,
      chipVariants: staticVisible,
      motionProps: {
        initial: "visible" as const,
        animate: "visible" as const,
      },
    };
  }

  return {
    prefersReducedMotion: false,
    containerVariants: staggerContainer,
    itemVariants: fadeUp,
    chipVariants: chipSlide,
    motionProps: {
      initial: "hidden" as const,
      whileInView: "visible" as const,
      viewport: { once: true, margin: viewportMargin },
    },
  };
}
