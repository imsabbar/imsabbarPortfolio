/**
 * /{locale}/privacy — privacy policy page (PRD §9.15).
 *
 * Plain markdown file per locale in `/content/privacy.{locale}.md`, read with
 * `fs` at request time. No DB. SSG via the parent's `generateStaticParams`.
 */

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import type { Locale } from '@/i18n/config';
import { i18n, isRTL } from '@/i18n/config';
import { getDictionary } from '@/lib/get-dictionary';
import { PrivacyPage } from '@/components/PrivacyPage';

export const runtime = 'nodejs';
export const dynamic = 'force-static';

const SUPPORTED_LOCALES = i18n.locales;

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateStaticParams() {
  return SUPPORTED_LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  const locale = (SUPPORTED_LOCALES as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : i18n.defaultLocale;
  const dict = await getDictionary(locale);

  return {
    title: dict.privacy.title,
    description: dict.privacy.body_intro,
    alternates: {
      canonical: `/${locale}/privacy`,
      languages: {
        ...Object.fromEntries(
          SUPPORTED_LOCALES.map((l) => [l, `/${l}/privacy`])
        ),
        'x-default': `/${i18n.defaultLocale}/privacy`,
      },
    },
  };
}

async function loadPrivacyMarkdown(locale: string): Promise<string> {
  // en falls back to en (no fr/ar fallbacks — legal text is per-locale).
  const safeLocale = (SUPPORTED_LOCALES as readonly string[]).includes(locale)
    ? locale
    : i18n.defaultLocale;
  const filePath = path.join(process.cwd(), 'content', `privacy.${safeLocale}.md`);
  return readFile(filePath, 'utf-8');
}

export default async function PrivacyPageRoute({ params }: PageProps) {
  const { locale: rawLocale } = await params;
  if (!(SUPPORTED_LOCALES as readonly string[]).includes(rawLocale)) {
    notFound();
  }
  const locale = rawLocale as Locale;
  const rtl = isRTL(locale);
  const [dict, body] = await Promise.all([
    getDictionary(locale),
    loadPrivacyMarkdown(locale),
  ]);

  return <PrivacyPage dict={dict} locale={locale} rtl={rtl} markdown={body} />;
}
