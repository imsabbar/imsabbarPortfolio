'use client';

import React from 'react';
import { SOCIAL_LINKS } from '@/lib/constants';
import type { SocialLinks as SocialLinksMap } from '@/types/portfolio';

export interface SocialProfile {
  name: string;
  url: string;
  svgPath: React.ReactNode;
}

interface SocialLinksProps {
  className?: string;
  /** DB-driven links. Falls back to `SOCIAL_LINKS` constants when absent. */
  links?: SocialLinksMap | null;
}

function resolveUrl(
  key: keyof SocialLinksMap,
  links: SocialLinksMap | null | undefined,
  fallback: string
): string {
  const value = links?.[key];
  return typeof value === 'string' && value.trim().length > 0 ? value : fallback;
}

export function SocialLinks({ className = '', links }: SocialLinksProps) {
  const profiles: SocialProfile[] = [
    {
      name: 'LinkedIn',
      url: resolveUrl('linkedin', links, SOCIAL_LINKS.linkedin),
      svgPath: (
        <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
      ),
    },
    {
      name: 'GitHub',
      url: resolveUrl('github', links, SOCIAL_LINKS.github),
      svgPath: (
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      ),
    },
    {
      name: 'YouTube',
      url: resolveUrl('youtube', links, SOCIAL_LINKS.youtube),
      svgPath: (
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      ),
    },
    {
      name: 'Telegram',
      url: resolveUrl('telegram', links, SOCIAL_LINKS.telegram),
      svgPath: (
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 0 0-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .38z" />
      ),
    },
    {
      name: 'WhatsApp',
      url: resolveUrl('whatsapp', links, SOCIAL_LINKS.whatsapp),
      svgPath: (
        <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.84 9.84 0 0 0 12.04 2zm5.8 14.16c-.24.68-1.2 1.33-1.95 1.43-.51.07-1.17.1-3.39-.82-2.84-1.18-4.67-4.06-4.81-4.25-.14-.19-1.16-1.54-1.16-2.94 0-1.4.73-2.09 1-2.37.26-.28.57-.35.76-.35.19 0 .38 0 .55.01.18.01.43-.07.67.51.24.58.83 2.03.9 2.18.07.15.12.33.02.53-.1.19-.15.31-.3.49-.15.18-.31.39-.44.53-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.07 1.31 2.36 1.46.29.15.46.13.63-.07.17-.2.73-.85.92-1.14.19-.29.38-.24.64-.15.26.09 1.66.78 1.95.92.29.15.48.22.55.34.07.12.07.69-.17 1.37z" />
      ),
    },
    {
      name: 'Email',
      url: resolveUrl('email', links, SOCIAL_LINKS.email),
      svgPath: (
        <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
      ),
    },
  ];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {profiles.map((profile) => (
        <a
          key={profile.name}
          href={profile.url}
          target="_blank"
          rel="noopener noreferrer"
          title={profile.name}
          className="p-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 hover:border-cyan-500/60 dark:hover:border-cyan-500/50 hover:text-cyan-600 dark:hover:text-cyan-400 hover:shadow-xs hover:shadow-cyan-500/10 transition-all duration-200 hover:-translate-y-0.5 cursor-pointer"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
            {profile.svgPath}
          </svg>
          <span className="sr-only">{profile.name}</span>
        </a>
      ))}
    </div>
  );
}
