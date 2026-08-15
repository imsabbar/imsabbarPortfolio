/**
 * Testimonials repository — `portfolio_testimonials` table (PRD §7.3, §9.8).
 *
 * Per PRD §6.3: "If portfolio_testimonials is empty, omit the section entirely."
 * The repository always returns [] on empty; the sections layer is responsible
 * for hiding the section when the list is empty.
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { query, isDbConfigured, DbNotConfiguredError } from '@/lib/db/mysql';
import type { RowDataPacket } from 'mysql2';
import type { Testimonial } from '@/types/portfolio';

interface TestimonialRowRaw extends RowDataPacket {
  id: number;
  client_name: string;
  client_name_i18n: unknown;
  company: string | null;
  company_i18n: unknown;
  country: string | null;
  country_i18n: unknown;
  quote: string;
  quote_i18n: unknown;
  rating: number;
  is_b2b_verified: number | boolean;
  is_active: number | boolean;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
}

function toIso(d: Date | string): string {
  return typeof d === 'string' ? d : d.toISOString();
}

function rowToTestimonial(r: TestimonialRowRaw): Testimonial {
  return {
    id: r.id,
    client_name: r.client_name,
    client_name_i18n: (r.client_name_i18n as Testimonial['client_name_i18n']) ?? undefined,
    company: r.company,
    company_i18n: (r.company_i18n as Testimonial['company_i18n']) ?? undefined,
    country: r.country,
    country_i18n: (r.country_i18n as Testimonial['country_i18n']) ?? undefined,
    quote: r.quote,
    quote_i18n: (r.quote_i18n as Testimonial['quote_i18n']) ?? undefined,
    rating: r.rating,
    is_b2b_verified: Boolean(r.is_b2b_verified),
    is_active: Boolean(r.is_active),
    sort_order: r.sort_order,
    created_at: toIso(r.created_at),
    updated_at: toIso(r.updated_at),
  };
}

export async function findAllActiveTestimonials(): Promise<Testimonial[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Testimonials: DB not configured');
  const rows = await query<TestimonialRowRaw>(
    'SELECT * FROM portfolio_testimonials WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(rowToTestimonial);
}

export const findAllActiveTestimonialsCached = unstable_cache(
  findAllActiveTestimonials,
  ['repos', 'findAllActiveTestimonials'],
  { tags: [CACHE_TAGS.testimonials], revalidate: 3600 }
);
