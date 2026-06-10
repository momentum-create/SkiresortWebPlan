import type { Variants } from "framer-motion";

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

export const cardLift: Variants = {
  rest: { y: 0, boxShadow: "0 1px 3px rgba(26,31,46,0.08)" },
  hover: {
    y: -4,
    boxShadow: "0 8px 24px rgba(26,31,46,0.12)",
    transition: { duration: 0.2 },
  },
};

export const chipSlide: Variants = {
  hidden: { opacity: 0, x: -16 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, ease: "easeOut" },
  },
};

/** prefers-reduced-motion 時にアニメーションを無効化する静的 variant */
export const staticVisible: Variants = {
  hidden: { opacity: 1, y: 0, x: 0 },
  visible: { opacity: 1, y: 0, x: 0 },
};

export const staticContainer: Variants = {
  hidden: {},
  visible: {},
};
