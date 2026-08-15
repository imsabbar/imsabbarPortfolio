/**
 * Tech stack repository — `portfolio_tech_stack` table (PRD §7.3, §9.6).
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { query, isDbConfigured, DbNotConfiguredError } from '@/lib/db/mysql';
import type { RowDataPacket } from 'mysql2';
import type { TechStackItem } from '@/types/portfolio';

interface TechStackRowRaw extends RowDataPacket {
  id: number;
  name: string;
  name_i18n: unknown;
  category: string;
  category_i18n: unknown;
  proficiency: number;
  icon: string;
  is_featured: number | boolean;
  is_active: number | boolean;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
}

function toIso(d: Date | string): string {
  return typeof d === 'string' ? d : d.toISOString();
}

function rowToTech(r: TechStackRowRaw): TechStackItem {
  return {
    id: r.id,
    name: r.name,
    name_i18n: (r.name_i18n as TechStackItem['name_i18n']) ?? undefined,
    category: r.category,
    category_i18n: (r.category_i18n as TechStackItem['category_i18n']) ?? undefined,
    proficiency: r.proficiency,
    icon: r.icon,
    is_featured: Boolean(r.is_featured),
    is_active: Boolean(r.is_active),
    sort_order: r.sort_order,
    created_at: toIso(r.created_at),
    updated_at: toIso(r.updated_at),
  };
}

export async function findAllActiveFeaturedTechStack(): Promise<TechStackItem[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Tech stack: DB not configured');
  const rows = await query<TechStackRowRaw>(
    'SELECT * FROM portfolio_tech_stack WHERE is_active = 1 AND is_featured = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(rowToTech);
}

export const findAllActiveFeaturedTechStackCached = unstable_cache(
  findAllActiveFeaturedTechStack,
  ['repos', 'findAllActiveFeaturedTechStack'],
  { tags: [CACHE_TAGS.techStack], revalidate: 3600 }
);
