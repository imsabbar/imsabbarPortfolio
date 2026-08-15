'use client';

import React from 'react';

interface SpotlightCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  spotlightColor?: string;
}

/**
 * High-performance Glass Card component.
 * Uses native CSS transitions for smooth, instant responsiveness with zero mouse tracking lag.
 */
export function SpotlightCard({
  children,
  className = '',
  spotlightColor,
  ...props
}: SpotlightCardProps) {
  return (
    <div
      className={`relative rounded-2xl glass-card card-interactive transition-all duration-300 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
