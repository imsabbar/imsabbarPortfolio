/**
 * Server-only currency resolver (PRD §9.9). Reads the active currency from
 * request cookies in this order:
 *
 *   1. `currency_preference` cookie (set by the PricingMatrix switcher on click).
 *   2. `detected_currency` cookie (set by `middleware.ts` from request geo).
 *   3. Fallback to `USD`.
 *
 * `import 'server-only'` at the top makes accidental client-side import a
 * build-time error instead of a runtime crash.
 *
 * The pure `Currency` type lives in `lib/currency.ts` (safe everywhere).
 */

import 'server-only';
import { cookies } from 'next/headers';
import { isCurrency, type Currency } from '@/lib/currency';

const DEFAULT_CURRENCY: Currency = 'USD';

export async function resolveServerCurrency(): Promise<Currency> {
  try {
    const store = await cookies();
    const pref = store.get('currency_preference')?.value;
    if (isCurrency(pref)) return pref;
    const detected = store.get('detected_currency')?.value;
    if (isCurrency(detected)) return detected;
  } catch {
    // `cookies()` is only available during a request; outside a request it
    // throws. Default to USD in that case.
  }
  return DEFAULT_CURRENCY;
}
