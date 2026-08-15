'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useRevealOnView } from '@/hooks/useRevealOnView';
import { EASE_SNAPPY } from './variants';

/**
 * Canonical scroll-reveal wrapper — PRD §4.3.
 * opacity 0→1 + y 24→0, --dur-base, --ease-snappy, 70ms stagger per sibling,
 * once per session, opacity-only under reduced motion.
 */

interface RevealProps {
  children: React.ReactNode;
  index?: number;
  className?: string;
}

export function Reveal({ children, index = 0, className }: RevealProps) {
  const { ref, inView } = useRevealOnView<HTMLDivElement>();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.32, delay: index * 0.07, ease: EASE_SNAPPY }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
