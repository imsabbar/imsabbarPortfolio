/**
 * Plans repository — `portfolio_plans` table (PRD §7.3, §9.9).
 *
 * Plans are pricing packages with 5-currency prices (MAD/EUR/USD/GBP/AED).
 * The active currency is selected at the page level via the currency switcher.
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { query, isDbConfigured, DbNotConfiguredError } from '@/lib/db/mysql';
import type { RowDataPacket } from 'mysql2';
import type { Plan, PlanBillingType, PlanCtaType } from '@/types/portfolio';

interface PlanRowRaw extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  title_i18n: unknown;
  badge: string | null;
  badge_i18n: unknown;
  price_mad: number | string;
  price_eur: number | string;
  price_usd: number | string;
  price_gbp: number | string;
  price_aed: number | string;
  billing_type: PlanBillingType;
  features_json: unknown;
  turnaround: string;
  turnaround_i18n: unknown;
  cta_type: PlanCtaType;
  is_popular: number | boolean;
  is_active: number | boolean;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
}

function toIso(d: Date | string): string {
  return typeof d === 'string' ? d : d.toISOString();
}

function toNumber(v: number | string): number {
  return typeof v === 'string' ? Number(v) : v;
}

function rowToPlan(r: PlanRowRaw): Plan {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    title_i18n: (r.title_i18n as Plan['title_i18n']) ?? undefined,
    badge: r.badge,
    badge_i18n: (r.badge_i18n as Plan['badge_i18n']) ?? undefined,
    price_mad: toNumber(r.price_mad),
    price_eur: toNumber(r.price_eur),
    price_usd: toNumber(r.price_usd),
    price_gbp: toNumber(r.price_gbp),
    price_aed: toNumber(r.price_aed),
    billing_type: r.billing_type,
    features_json: (r.features_json as Plan['features_json']) ?? { en: [] },
    turnaround: r.turnaround,
    turnaround_i18n: (r.turnaround_i18n as Plan['turnaround_i18n']) ?? undefined,
    cta_type: r.cta_type,
    is_popular: Boolean(r.is_popular),
    is_active: Boolean(r.is_active),
    sort_order: r.sort_order,
    created_at: toIso(r.created_at),
    updated_at: toIso(r.updated_at),
  };
}

export async function findAllActivePlans(): Promise<Plan[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Plans: DB not configured');
  const rows = await query<PlanRowRaw>(
    'SELECT * FROM portfolio_plans WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(rowToPlan);
}

export const findAllActivePlansCached = unstable_cache(findAllActivePlans, ['repos', 'findAllActivePlans'], {
  tags: [CACHE_TAGS.plans],
  revalidate: 3600,
});
