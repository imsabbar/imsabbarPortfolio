export const i18n = {
  defaultLocale: 'en',
  locales: ['en', 'fr', 'ar'],
} as const;

export type Locale = (typeof i18n)['locales'][number];

export const isRTL = (locale: string): boolean => {
  return locale === 'ar';
};

export const localeNames: Record<Locale, { name: string; nativeName: string; dir: 'ltr' | 'rtl' }> = {
  en: { name: 'English', nativeName: 'English', dir: 'ltr' },
  fr: { name: 'French', nativeName: 'Français', dir: 'ltr' },
  ar: { name: 'Arabic', nativeName: 'العربية', dir: 'rtl' },
};
