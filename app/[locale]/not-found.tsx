/**
 * Localized 404 — `notFound()` in `app/[locale]/*` will render this.
 *
 * It's a server component that reads the dictionary for the active locale,
 * then hands off to a client component for the blueprint + glow background.
 */

import { getDictionary } from '@/lib/get-dictionary';
import { i18n, type Locale } from '@/i18n/config';
import { NotFoundClient } from '@/components/NotFoundClient';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic'; // We don't know the locale at build time.

interface NotFoundProps {
  params: Promise<{ locale: string }>;
}

export default async function LocaleNotFound({ params }: NotFoundProps) {
  // `not-found.tsx` nested under `[locale]` receives the resolved locale param.
  // Fall back to `en` only for genuinely unknown locales, so FR/AR visitors
  // get localized 404 copy (PRD §9.15).
  let locale: Locale = i18n.defaultLocale;
  try {
    const resolved = await params;
    if ((i18n.locales as readonly string[]).includes(resolved.locale)) {
      locale = resolved.locale as Locale;
    }
  } catch {
    // Keep the default when params aren't available (rare edge path).
  }

  const dict = await getDictionary(locale);
  return <NotFoundClient dict={dict} locale={locale} />;
}
