import type { MetadataRoute } from 'next';
import { i18n, type Locale } from '@/i18n/config';
import { getAllCaseStudySlugs } from '@/lib/sections';

function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  return process.env.NODE_ENV === 'production' ? 'https://imsabbar.com' : 'http://localhost:3000';
}

function localizedUrl(base: string, locale: Locale, path = ''): string {
  return `${base}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of i18n.locales) {
    entries.push(
      { url: localizedUrl(base, locale), changeFrequency: 'weekly', priority: 1 },
      { url: localizedUrl(base, locale, '/privacy'), changeFrequency: 'yearly', priority: 0.2 },
    );
  }

  let slugs: string[] = [];
  try {
    slugs = await getAllCaseStudySlugs();
  } catch (error) {
    console.warn('[sitemap] case-study slugs unavailable; continuing with base routes', error instanceof Error ? error.message : error);
  }

  for (const locale of i18n.locales) {
    for (const slug of slugs) {
      entries.push({
        url: localizedUrl(base, locale, `/case-studies/${encodeURIComponent(slug)}`),
        changeFrequency: 'monthly',
        priority: 0.8,
      });
    }
  }

  return entries;
}
