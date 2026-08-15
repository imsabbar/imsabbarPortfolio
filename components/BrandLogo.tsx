'use client';

import React from 'react';

interface BrandLogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ className = '', showText = true, size = 'md' }: BrandLogoProps) {
  const badgeHeight =
    size === 'sm'
      ? 'h-7 px-2 rounded-lg'
      : size === 'lg'
        ? 'h-11 px-3.5 rounded-2xl'
        : 'h-8 sm:h-9 px-2.5 rounded-xl';
  const textSize = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl sm:text-2xl';
  const iconSize = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-lg' : 'text-sm sm:text-base';
  const dotSize = size === 'sm' ? 'w-2 h-2' : size === 'lg' ? 'w-3 h-3' : 'w-2.5 h-2.5';

  return (
    <div className={`inline-flex items-center gap-2.5 group select-none cursor-pointer ${className}`} dir="ltr">
      {/* CLI Prompt Badge (Compact Tech Capsule) */}
      <div
        className={`relative flex items-center justify-center ${badgeHeight} bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-xs transition-all duration-300 group-hover:border-cyan-500/40 group-hover:bg-[var(--color-surface-raised)] group-hover:shadow-[0_0_10px_rgba(6,182,212,0.12)]`}
      >
        <span className={`font-mono ${iconSize} font-black text-cyan-600 dark:text-cyan-400 tracking-tight flex items-center gap-0.5`}>
          <span className="leading-none">&gt;</span>
          <span className="animate-pulse text-cyan-500 dark:text-cyan-300 font-extrabold leading-none">_</span>
        </span>
      </div>

      {/* Dual-Tone Engineered Wordmark */}
      {showText && (
        <div className="flex items-center gap-2">
          <div className="flex items-baseline tracking-tight">
            {/* Tech Prefix */}
            <span className={`font-mono font-bold ${textSize} text-cyan-600 dark:text-cyan-400 group-hover:text-cyan-500 transition-colors`}>
              im
            </span>
            {/* Bold Display Suffix */}
            <span className={`font-display font-black ${textSize} text-[var(--color-text)] transition-colors duration-200 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 ms-0.5`}>
              sabbar
            </span>
          </div>

          {/* Infinitely Smooth Bouncing & Glowing Cyan Dot */}
          <span
            className={`${dotSize} rounded-full bg-cyan-500 dark:bg-cyan-400 animate-dot-bounce shrink-0`}
            aria-hidden="true"
          />
        </div>
      )}
    </div>
  );
}
