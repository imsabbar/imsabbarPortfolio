import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { DbNotConfiguredError, isDbConfigured, query } from '@/lib/db/mysql';
import type { ClientLogo } from '@/types/portfolio';
import type { RowDataPacket } from 'mysql2';

interface LogoRow extends RowDataPacket {
  id: number; company_name: string; company_name_i18n: unknown; logo_url: string; website_url: string | null;
  is_active: number | boolean; sort_order: number; created_at: Date | string; updated_at: Date | string;
}

const iso = (v: Date | string) => typeof v === 'string' ? v : v.toISOString();

export async function findAllActiveClientLogos(): Promise<ClientLogo[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Client logos: DB not configured');
  const rows = await query<LogoRow>('SELECT * FROM portfolio_client_logos WHERE is_active = 1 ORDER BY sort_order ASC, id ASC');
  return rows.map((r) => ({
    id: r.id, company_name: r.company_name, company_name_i18n: (r.company_name_i18n as ClientLogo['company_name_i18n']) ?? undefined,
    logo_url: r.logo_url, website_url: r.website_url, is_active: Boolean(r.is_active), sort_order: r.sort_order,
    created_at: iso(r.created_at), updated_at: iso(r.updated_at),
  }));
}

export const findAllActiveClientLogosCached = unstable_cache(findAllActiveClientLogos, ['repos', 'findAllActiveClientLogos'], {
  tags: [CACHE_TAGS.clientLogos], revalidate: 3600,
});
