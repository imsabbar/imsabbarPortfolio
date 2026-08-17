import type { MetadataRoute } from 'next';
import { i18n, type Locale } from '@/i18n/config';
import { getAllCaseStudySlugs } from '@/lib/sections';
import { getSiteUrl } from '@/lib/constants';

function localizedUrl(base: string, locale: Locale, path = ''): string {
  return `${base}/${locale}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of i18n.locales) {
    entries.push(
      {
        url: localizedUrl(base, locale),
        changeFrequency: 'weekly',
        priority: 1,
        alternates: {
          languages: {
            ...Object.fromEntries(i18n.locales.map((l) => [l, localizedUrl(base, l)])),
            'x-default': localizedUrl(base, i18n.defaultLocale),
          },
        },
      },
      {
        url: localizedUrl(base, locale, '/privacy'),
        changeFrequency: 'yearly',
        priority: 0.2,
        alternates: {
          languages: {
            ...Object.fromEntries(i18n.locales.map((l) => [l, localizedUrl(base, l, '/privacy')])),
            'x-default': localizedUrl(base, i18n.defaultLocale, '/privacy'),
          },
        },
      },
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
        alternates: {
          languages: {
            ...Object.fromEntries(
              i18n.locales.map((l) => [l, localizedUrl(base, l, `/case-studies/${encodeURIComponent(slug)}`)])
            ),
            'x-default': localizedUrl(base, i18n.defaultLocale, `/case-studies/${encodeURIComponent(slug)}`),
          },
        },
      });
    }
  }

  return entries;
}
