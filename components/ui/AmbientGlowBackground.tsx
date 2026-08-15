'use client';

import React from 'react';

interface AmbientGlowBackgroundProps {
  className?: string;
}

/**
 * Lightweight, high-performance ambient background lighting.
 * Pure CSS with zero JS event listeners or mouse-tracking overhead.
 */
export function AmbientGlowBackground({
  className = '',
}: AmbientGlowBackgroundProps) {
  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`} aria-hidden="true">
      {/* Top Ambient Glow Orb (Cyan) */}
      <div className="glow glow--primary top-[-5%] right-[5%] w-[450px] h-[450px] opacity-20 dark:opacity-15" />

      {/* Middle Ambient Glow Orb (Violet) */}
      <div className="glow glow--secondary top-[40%] left-[-5%] w-[400px] h-[400px] opacity-15 dark:opacity-10" />

      {/* Bottom Ambient Glow Orb (Emerald) */}
      <div className="glow glow--tertiary bottom-[15%] right-[10%] w-[380px] h-[380px] opacity-15 dark:opacity-10" />
    </div>
  );
}
