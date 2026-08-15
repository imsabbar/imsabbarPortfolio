/**
 * Localized 404 (PRD §9.15).
 * Next.js App Router renders this for any `notFound()` call inside the
 * `app/[locale]/` segment, and for unmatched URLs that resolve to this
 * segment after the middleware's locale routing.
 */

'use client';

import React from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/types/dictionary';
import type { Locale } from '@/i18n/config';

interface NotFoundProps {
  dict: Dictionary;
  locale: Locale;
}

export function NotFoundClient({ dict, locale }: NotFoundProps) {
  // Build a small blueprint grid + glow effect on the client (CSS only).
  return (
    <main className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Blueprint grid background */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(6,182,212,0.06) 1px, transparent 1px),' +
            'linear-gradient(to bottom, rgba(6,182,212,0.06) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      {/* Soft glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(6,182,212,0.18), transparent 70%)' }}
      />

      <div className="relative z-10 max-w-xl mx-auto px-4 sm:px-8 text-center space-y-6">
        <div className="kicker justify-center">404</div>
        <h1 className="text-h1 font-display font-bold text-[var(--color-text)]">
          {dict.notfound.title}
        </h1>
        <p className="text-body-copy font-body text-[var(--color-text-muted)]">
          {dict.notfound.body}
        </p>
        <Link href={`/${locale}`} className="btn btn-primary inline-flex">
          {dict.notfound.cta_home}
        </Link>
      </div>
    </main>
  );
}
