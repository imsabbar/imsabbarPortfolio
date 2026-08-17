/**
 * /{locale}/case-studies/[slug] — case-study detail page (PRD §9.14).
 *
 * SSG via `generateStaticParams`. Unknown / inactive slugs render a localized
 * 404 via `notFound()`.
 */

import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { i18n } from '@/i18n/config';
import { getDictionary } from '@/lib/get-dictionary';
import { getCaseStudyDetail, getNextCaseStudy, getAllCaseStudySlugs } from '@/lib/sections';
import { getLocalizedField } from '@/lib/db/helpers';
import { CaseStudyDetail } from '@/components/CaseStudyDetail';

// DB is read at build time — must run on Node.
export const runtime = 'nodejs';
// SSG unless the DB throws or returns no slugs (e.g. dev with USE_SAMPLE_DATA).
// The page itself falls back gracefully inside the component if data is null.
export const dynamic = 'force-static';
// Cache revalidation is handled via `revalidateTag()` in `/api/revalidate`.
export const revalidate = 3600;

export async function generateStaticParams() {
  const out: Array<{ locale: string; slug: string }> = [];
  for (const locale of i18n.locales) {
    try {
      const slugs = await getAllCaseStudySlugs();
      for (const slug of slugs) out.push({ locale, slug });
    } catch (e) {
      console.error(`[case-studies/${locale}/generateStaticParams] failed`, e);
    }
  }
  return out;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = (i18n.locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : i18n.defaultLocale;

  const caseStudy = await getCaseStudyDetail(slug);
  if (!caseStudy) {
    const dict = await getDictionary(locale);
    return { title: dict.notfound.title };
  }

  const title = getLocalizedField(caseStudy.title_i18n, caseStudy.title, locale);
  const summary = getLocalizedField(caseStudy.summary_i18n, caseStudy.summary, locale);
  const description = summary.length > 200 ? summary.slice(0, 197) + '…' : summary;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'article',
      locale,
      images: caseStudy.image_url ? [{ url: caseStudy.image_url }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: caseStudy.image_url ? [caseStudy.image_url] : undefined,
    },
    alternates: {
      canonical: `/${locale}/case-studies/${caseStudy.slug}`,
      languages: {
        ...Object.fromEntries(
          i18n.locales.map((l) => [l, `/${l}/case-studies/${caseStudy.slug}`])
        ),
        'x-default': `/${i18n.defaultLocale}/case-studies/${caseStudy.slug}`,
      },
    },
  };
}

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function CaseStudyDetailPage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = (i18n.locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : i18n.defaultLocale;

  const caseStudy = await getCaseStudyDetail(slug);
  if (!caseStudy) notFound();

  const [dict, nextCaseStudy] = await Promise.all([
    getDictionary(locale),
    getNextCaseStudy(slug),
  ]);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://imsabbar.com';
  const caseStudyTitle = getLocalizedField(caseStudy.title_i18n, caseStudy.title, locale);
  const caseStudySummary = getLocalizedField(caseStudy.summary_i18n, caseStudy.summary, locale);

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        '@id': `${siteUrl}/${locale}/case-studies/${caseStudy.slug}#article`,
        headline: caseStudyTitle,
        description: caseStudySummary,
        image: caseStudy.image_url || undefined,
        author: {
          '@type': 'Person',
          name: 'Ismail Sabbar',
          url: siteUrl,
        },
        publisher: {
          '@type': 'Person',
          name: 'Ismail Sabbar',
          url: siteUrl,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteUrl}/${locale}/case-studies/${caseStudy.slug}`,
        },
        inLanguage: locale,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${siteUrl}/${locale}/case-studies/${caseStudy.slug}#breadcrumb`,
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: locale === 'ar' ? 'الرئيسية' : locale === 'fr' ? 'Accueil' : 'Home',
            item: `${siteUrl}/${locale}`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: dict.nav.work || (locale === 'ar' ? 'سجل الأعمال' : locale === 'fr' ? 'Études de cas' : 'Case Studies'),
            item: `${siteUrl}/${locale}#case-studies`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: caseStudyTitle,
            item: `${siteUrl}/${locale}/case-studies/${caseStudy.slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <CaseStudyDetail
        dict={dict}
        locale={locale}
        caseStudy={caseStudy}
        nextCaseStudy={nextCaseStudy}
      />
    </>
  );
}
