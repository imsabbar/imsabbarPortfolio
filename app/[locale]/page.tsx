// Phase 2: this page fetches MySQL data via `lib/sections`. mysql2 needs Node.js TCP.
export const runtime = 'nodejs';
// PRD §7.6 — route-level revalidation safety net. The OS-triggered
// /api/revalidate is the primary invalidation path; this prevents a stale
// static page from outliving an hour.
export const revalidate = 3600;

import React from 'react';
import type { Metadata } from 'next';
import { getDictionary } from '@/lib/get-dictionary';
import { i18n, type Locale } from '@/i18n/config';
import { displayNameForLocale } from '@/lib/constants';
import { JsonLd } from '@/components/JsonLd';
import { ClientHomeShell } from '@/components/ClientHomeShell';
import { getHomePageSections } from '@/lib/sections';
import { resolveServerCurrency } from '@/lib/currency-server';

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * P3.6 — Per-locale home-page metadata.
 * Title and description come from the DB-driven `hero` content block; when
 * the DB is empty / down we fall back to the static English copy from the
 * layout. Hreflang alternates are emitted for every supported locale.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const locale = (i18n.locales as readonly string[]).includes(resolvedParams.locale)
    ? (resolvedParams.locale as Locale)
    : i18n.defaultLocale;

  const sections = await getHomePageSections(locale);
  const hero = sections.contentBlocks.hero;
  const displayName = displayNameForLocale(locale);
  // `getHomePageSections` already resolves the per-locale shape, so
  // `headline` / `subhead` are plain strings here.
  const title = hero?.headline
    ? `${hero.headline} | ${displayName}`
    : `${displayName} | Full-Stack Developer & Automation Engineer`;
  const description = hero?.subhead
    ? hero.subhead
    : 'Specializing in n8n workflow automation, Perfex CRM module engineering, and WordPress/Next.js web builds.';

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ...Object.fromEntries(
          i18n.locales.map((l) => [l, `/${l}`])
        ),
        'x-default': `/${i18n.defaultLocale}`,
      },
    },
    openGraph: {
      title,
      description,
      url: `/${locale}`,
      locale,
      type: 'website',
      images: [{
        url: `/${locale}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: `${displayName} — Automation & CRM Engineering`,
      }],
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const resolvedParams = await params;
  const locale = (resolvedParams.locale as Locale) || 'en';
  const dict = await getDictionary(locale);

  // Phase 2: fetch all home-page section data in one call. Returns null per section on
  // DB error/empty; the sections layer logs server-side and the UI hides gracefully.
  const sections = await getHomePageSections(locale);

  // P3.4: resolve the active currency from cookies (cookie → geo → USD).
  const initialCurrency = await resolveServerCurrency();

  return (
    <>
      {/* SEO JSON-LD Structured Data */}
      <JsonLd />

      {/* Stateful Client Shell — receives DB-driven section data. */}
      <ClientHomeShell
        dict={dict}
        locale={locale}
        sections={sections}
        initialCurrency={initialCurrency}
      />
    </>
  );
}
