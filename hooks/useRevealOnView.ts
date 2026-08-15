'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * PRD §4.3 — IntersectionObserver-based reveal trigger.
 * Reveals once per session (observer disconnects after first intersection),
 * never uses scroll listeners, and short-circuits to visible under
 * prefers-reduced-motion.
 */
export function useRevealOnView<T extends HTMLElement = HTMLDivElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect(); // reveal once, never repeat on re-scroll
        }
      },
      { threshold, rootMargin: '-5% 0px 0px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}
