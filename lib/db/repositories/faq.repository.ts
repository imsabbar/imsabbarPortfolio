import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { DbNotConfiguredError, isDbConfigured, query } from '@/lib/db/mysql';
import type { FAQ } from '@/types/portfolio';
import type { RowDataPacket } from 'mysql2';

interface FaqRow extends RowDataPacket {
  id: number; question: string; question_i18n: unknown; answer: string; answer_i18n: unknown;
  category: string | null; category_i18n: unknown; is_active: number | boolean; sort_order: number;
  created_at: Date | string; updated_at: Date | string;
}

const iso = (v: Date | string) => typeof v === 'string' ? v : v.toISOString();

export async function findAllActiveFaq(): Promise<FAQ[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('FAQ: DB not configured');
  const rows = await query<FaqRow>('SELECT * FROM portfolio_faq WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
  return rows.map((r) => ({
    id: r.id, question: r.question, question_i18n: (r.question_i18n as FAQ['question_i18n']) ?? undefined,
    answer: r.answer, answer_i18n: (r.answer_i18n as FAQ['answer_i18n']) ?? undefined,
    category: r.category, category_i18n: (r.category_i18n as FAQ['category_i18n']) ?? undefined,
    is_active: Boolean(r.is_active), sort_order: r.sort_order, created_at: iso(r.created_at), updated_at: iso(r.updated_at),
  }));
}

export const findAllActiveFaqCached = unstable_cache(findAllActiveFaq, ['repos', 'findAllActiveFaq'], {
  tags: [CACHE_TAGS.faq], revalidate: 3600,
});
