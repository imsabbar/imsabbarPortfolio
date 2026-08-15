/**
 * Content blocks repository — `portfolio_content_blocks` table (PRD §7.3, §6.2).
 *
 * Each row has a `section_key` (hero | trust_bar | about | contact | footer)
 * and a `content_i18n` JSON column with the localized shape per section.
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { query, isDbConfigured, DbNotConfiguredError } from '@/lib/db/mysql';
import type { RowDataPacket } from 'mysql2';
import type { ContentBlockRow } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';

interface ContentBlockRowRaw extends RowDataPacket {
  section_key: string;
  content_i18n: unknown;
  updated_at: Date | string;
}

function normalizeRow(r: ContentBlockRowRaw): ContentBlockRow {
  return {
    section_key: r.section_key as ContentBlockRow['section_key'],
    content_i18n: (r.content_i18n ?? {}) as ContentBlockRow['content_i18n'],
    updated_at: typeof r.updated_at === 'string' ? r.updated_at : r.updated_at.toISOString(),
  };
}

export type ContentSectionKey = 'hero' | 'trust_bar' | 'about' | 'contact' | 'footer';

const ALLOWED_SECTION_KEYS: ReadonlySet<ContentSectionKey> = new Set([
  'hero',
  'trust_bar',
  'about',
  'contact',
  'footer',
]);

export function isContentSectionKey(key: string): key is ContentSectionKey {
  return (ALLOWED_SECTION_KEYS as ReadonlySet<string>).has(key);
}

/**
 * Returns one content block row by section key, or `null` if not found.
 * The caller is responsible for `getLocalizedField` resolution per locale.
 */
export async function findContentBlockByKey(sectionKey: ContentSectionKey): Promise<ContentBlockRow | null> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Content blocks: DB not configured');
  const rows = await query<ContentBlockRowRaw>(
    'SELECT section_key, content_i18n, updated_at FROM portfolio_content_blocks WHERE section_key = ? LIMIT 1',
    [sectionKey]
  );
  if (rows.length === 0) return null;
  return normalizeRow(rows[0]);
}

/** Return all content blocks at once — used by the sections aggregator. */
export async function findAllContentBlocks(): Promise<ContentBlockRow[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Content blocks: DB not configured');
  const rows = await query<ContentBlockRowRaw>(
    'SELECT section_key, content_i18n, updated_at FROM portfolio_content_blocks'
  );
  return rows.map(normalizeRow);
}

/** Convenience: get the i18n object for a single section in a single locale. */
export function getLocalizedSectionContent<T extends Record<string, unknown>>(
  row: ContentBlockRow | null,
  locale: Locale
): T | null {
  if (!row) return null;
  const i18n = row.content_i18n ?? {};
  const value = i18n[locale] ?? i18n.en;
  return (value as T | undefined) ?? null;
}

export const findAllContentBlocksCached = unstable_cache(findAllContentBlocks, ['repos', 'findAllContentBlocks'], {
  tags: [CACHE_TAGS.contentBlocks],
  revalidate: 3600,
});

export const findContentBlockByKeyCached = (key: ContentSectionKey) =>
  unstable_cache(
    async () => findContentBlockByKey(key),
    ['repos', 'findContentBlockByKey', key],
    { tags: [CACHE_TAGS.contentBlocks], revalidate: 3600 }
  )();
