/**
 * Currency types and pure helpers — safe to import from both server and client
 * components. Does NOT import `next/headers` (see `lib/currency-server.ts` for
 * the cookie-reading server-side resolver).
 */

export const SUPPORTED_CURRENCIES = ['USD', 'EUR', 'GBP', 'AED', 'MAD'] as const;
export type Currency = (typeof SUPPORTED_CURRENCIES)[number];

export const currencySymbols: Record<Currency, string> = {
  USD: '$',
  EUR: '€',
  GBP: '£',
  AED: 'AED',
  MAD: 'MAD',
};

export function isCurrency(value: unknown): value is Currency {
  return typeof value === 'string' && (SUPPORTED_CURRENCIES as readonly string[]).includes(value);
}

/**
 * Locale-aware price formatter. Number formatting matches the active locale;
 * for RTL the digits are still LTR (Western Arabic numerals) per PRD §4.2.
 */
export function formatPrice(amount: number, currency: Currency, locale: string): string {
  const formatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
  });
  return `${currencySymbols[currency]} ${formatter.format(amount)}`;
}
