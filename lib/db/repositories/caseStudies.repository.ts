/**
 * Case studies repository — `portfolio_case_studies` table (PRD §7.3, §9.3, §9.4).
 *
 * Holds the heavy content: cover image, before/after metrics, X-Ray specs,
 * n8n nodes for the simulator, and `body_i18n` markdown for the detail page.
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { query, queryOne, isDbConfigured, DbNotConfiguredError } from '@/lib/db/mysql';
import type { RowDataPacket } from 'mysql2';
import type { CaseStudy, CaseStudyXRaySpecs, N8nNode } from '@/types/portfolio';

interface CaseStudyRowRaw extends RowDataPacket {
  id: number;
  slug: string;
  title: string;
  title_i18n: unknown;
  summary: string;
  summary_i18n: unknown;
  client_name: string | null;
  client_region: string | null;
  client_region_i18n: unknown;
  impact_metric: string | null;
  impact_metric_i18n: unknown;
  before_metric: string | null;
  before_metric_i18n: unknown;
  after_metric: string | null;
  after_metric_i18n: unknown;
  improvement_percent: number | null;
  demo_url: string | null;
  github_url: string | null;
  image_url: string | null;
  xray_specs_json: unknown;
  n8n_nodes_json: unknown;
  body_i18n: unknown;
  is_featured: number | boolean;
  is_active: number | boolean;
  sort_order: number;
  created_at: Date | string;
  updated_at: Date | string;
}

function toIso(d: Date | string): string {
  return typeof d === 'string' ? d : d.toISOString();
}

function rowToCaseStudy(r: CaseStudyRowRaw): CaseStudy {
  return {
    id: r.id,
    slug: r.slug,
    title: r.title,
    title_i18n: (r.title_i18n as CaseStudy['title_i18n']) ?? undefined,
    summary: r.summary ?? '',
    summary_i18n: (r.summary_i18n as CaseStudy['summary_i18n']) ?? undefined,
    client_name: r.client_name,
    client_region: r.client_region,
    client_region_i18n: (r.client_region_i18n as CaseStudy['client_region_i18n']) ?? undefined,
    impact_metric: r.impact_metric,
    impact_metric_i18n: (r.impact_metric_i18n as CaseStudy['impact_metric_i18n']) ?? undefined,
    before_metric: r.before_metric,
    before_metric_i18n: (r.before_metric_i18n as CaseStudy['before_metric_i18n']) ?? undefined,
    after_metric: r.after_metric,
    after_metric_i18n: (r.after_metric_i18n as CaseStudy['after_metric_i18n']) ?? undefined,
    improvement_percent: r.improvement_percent,
    demo_url: r.demo_url,
    github_url: r.github_url,
    image_url: r.image_url,
    xray_specs_json: (r.xray_specs_json as CaseStudyXRaySpecs | null) ?? null,
    n8n_nodes_json: (r.n8n_nodes_json as N8nNode[] | null) ?? null,
    body_i18n: (r.body_i18n as CaseStudy['body_i18n']) ?? undefined,
    is_featured: Boolean(r.is_featured),
    is_active: Boolean(r.is_active),
    sort_order: r.sort_order,
    created_at: toIso(r.created_at),
    updated_at: toIso(r.updated_at),
  };
}

export async function findAllActiveCaseStudies(): Promise<CaseStudy[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Case studies: DB not configured');
  const rows = await query<CaseStudyRowRaw>(
    'SELECT * FROM portfolio_case_studies WHERE is_active = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(rowToCaseStudy);
}

export async function findFeaturedCaseStudies(): Promise<CaseStudy[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Case studies: DB not configured');
  const rows = await query<CaseStudyRowRaw>(
    'SELECT * FROM portfolio_case_studies WHERE is_active = 1 AND is_featured = 1 ORDER BY sort_order ASC, id ASC'
  );
  return rows.map(rowToCaseStudy);
}

export async function findCaseStudyBySlug(slug: string): Promise<CaseStudy | null> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Case studies: DB not configured');
  const row = await queryOne<CaseStudyRowRaw>(
    'SELECT * FROM portfolio_case_studies WHERE slug = ? AND is_active = 1 LIMIT 1',
    [slug]
  );
  return row ? rowToCaseStudy(row) : null;
}

/** For `generateStaticParams` on the detail page (Phase 3). */
export async function findAllActiveCaseStudySlugs(): Promise<string[]> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Case studies: DB not configured');
  const rows = await query<{ slug: string } & RowDataPacket>(
    'SELECT slug FROM portfolio_case_studies WHERE is_active = 1'
  );
  return rows.map((r) => r.slug);
}

export const findAllActiveCaseStudiesCached = unstable_cache(
  findAllActiveCaseStudies,
  ['repos', 'findAllActiveCaseStudies'],
  { tags: [CACHE_TAGS.caseStudies], revalidate: 3600 }
);

export const findFeaturedCaseStudiesCached = unstable_cache(
  findFeaturedCaseStudies,
  ['repos', 'findFeaturedCaseStudies'],
  { tags: [CACHE_TAGS.caseStudies], revalidate: 3600 }
);

export const findAllActiveCaseStudySlugsCached = unstable_cache(
  findAllActiveCaseStudySlugs,
  ['repos', 'findAllActiveCaseStudySlugs'],
  { tags: [CACHE_TAGS.caseStudies], revalidate: 3600 }
);

export const findCaseStudyBySlugCached = (slug: string) =>
  unstable_cache(
    async () => findCaseStudyBySlug(slug),
    ['repos', 'findCaseStudyBySlug', slug],
    { tags: [CACHE_TAGS.caseStudies], revalidate: 3600 }
  )();
