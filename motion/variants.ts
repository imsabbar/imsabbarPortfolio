import type { Variants } from 'framer-motion';

// Cubic bezier curves matching PRD §3.4
export const EASE_SNAPPY = [0.16, 1, 0.3, 1] as const;
export const EASE_SMOOTH = [0.4, 0, 0.2, 1] as const;

/**
 * Reveal animation variant for scroll items.
 * Uses snappy cubic-bezier, translateY rise (28px -> 0px), opacity transition.
 */
export const revealVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.32,
      delay: i * 0.07,
      ease: EASE_SNAPPY,
    },
  }),
};

/**
 * Container variant for staggered children groups (max 6 items per batch).
 */
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.05,
    },
  },
};

/**
 * Hero entrance sequence variant (multi-element stagger on page load).
 */
export const heroEntranceVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.56,
      delay: 0.1 + i * 0.1,
      ease: EASE_SNAPPY,
    },
  }),
};

/**
 * Card hover lift is handled in CSS (`.card-interactive` in globals.css) —
 * PRD §4.3 hover spec is a pure CSS transition, no JS variant needed.
 */
