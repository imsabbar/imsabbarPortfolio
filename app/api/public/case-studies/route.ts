/**
 * GET /api/public/case-studies
 *
 * Returns all active case studies ordered by `sort_order`.
 * Cached via the case studies repository's tag `portfolio_case_studies`.
 */

import { findAllActiveCaseStudiesCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();

  try {
    const caseStudies = await findAllActiveCaseStudiesCached();
    return ok(caseStudies);
  } catch (e) {
    console.error('[api/public/case-studies] failed', e);
    return err('internal_error', 'Failed to load case studies.', 500);
  }
}
