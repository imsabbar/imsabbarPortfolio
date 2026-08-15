import React from 'react';
import dynamic from 'next/dynamic';
import type { Dictionary } from '@/types/dictionary';
import type { Locale } from '@/i18n/config';

// `react-markdown` is dynamically imported so the home page bundle is unaffected.
const Markdown = dynamic(() => import('react-markdown'), { ssr: true });

interface PrivacyPageProps {
  dict: Dictionary;
  locale: Locale;
  rtl: boolean;
  markdown: string;
}

export function PrivacyPage({ dict, locale, rtl, markdown }: PrivacyPageProps) {
  // P3.9 — `privacy.last_updated` lives in dict. The actual date is rendered
  // from a static string for the placeholder legal copy; OS can replace later.
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-8 py-16 space-y-8" dir={rtl ? 'rtl' : 'ltr'} lang={locale}>
      <header className="space-y-2">
        <h1 className="text-h1 font-display font-bold text-[var(--color-text)]">
          {dict.privacy.title}
        </h1>
        <p className="text-xs font-mono text-[var(--color-text-muted)]">
          {dict.privacy.last_updated}: {dict.privacy.last_updated_date}
        </p>
      </header>

      <article
        className="prose prose-invert max-w-none text-[var(--color-text)] font-body leading-relaxed
                    [&_h1]:hidden
                    [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4
                    [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3
                    [&_p]:my-4 [&_p]:text-[var(--color-text-muted)]
                    [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6
                    [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6
                    [&_li]:my-2 [&_li]:text-[var(--color-text-muted)]
                    [&_strong]:text-[var(--color-text)] [&_strong]:font-semibold
                    [&_a]:text-[var(--color-accent-primary)] [&_a]:underline
                    [&_table]:w-full [&_table]:my-4
                    [&_th]:text-start [&_th]:text-[var(--color-text)] [&_th]:py-2 [&_th]:pe-4
                    [&_td]:py-2 [&_td]:pr-4 [&_td]:text-[var(--color-text-muted)]"
      >
        <Markdown>{markdown}</Markdown>
      </article>
    </main>
  );
}
