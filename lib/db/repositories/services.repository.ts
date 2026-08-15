/**
 * Services repository — `portfolio_services` table (PRD §7.3).
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { query, isDbConfigured, DbNotConfiguredError } from '@/lib/db/mysql';
import type { RowDataPacket } from 'mysql2';
import type { Service } from '@/types/portfolio';

interface ServiceRowRaw extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  title_i18n: unknown;
  category: string;
  category_i18n: unknown;
  description: string;
  description_i18n: unknown;
  icon_name: string;
  is_active: number | boolean;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
}

function toIso(d: Date | string): string {
  return typeof d === 'string' ? d : d.toISOString();
}

function rowToService(r: ServiceRowRaw): Service {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    title_i18n: (r.title_i18n as Service['title_i18n']) ?? undefined,
    category: r.category,
    category_i18n: (r.category_i18n as Service['category_i18n']) ?? undefined,
    description: r.description,
    description_i18n: (r.description_i18n as Service['description_i18n']) ?? undefined,
    icon_name: r.icon_name,
    is_active: Boolean(r.is_active),
    sort_order: r.sort_order,
    created_at: toIso(r.created_at),
    updated_at: toIso(r.updated_at),
  };
}

/** All active services, ordered by `sort_order` then `id`. */
export async function findAllActiveServices(): Promise<Service[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Services: DB not configured');
  const rows = await query<ServiceRowRaw>(
    'SELECT * FROM portfolio_services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(rowToService);
}

export const findAllActiveServicesCached = unstable_cache(findAllActiveServices, ['repos', 'findAllActiveServices'], {
  tags: [CACHE_TAGS.services],
  revalidate: 3600,
});
