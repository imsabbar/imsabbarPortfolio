/**
 * GET /api/public/case-studies/[slug]
 *
 * Returns a single active case study by its slug.
 * Returns 404 if not found or inactive.
 * Cached via the case studies repository's tag `portfolio_case_studies`.
 */

import { findCaseStudyBySlugCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  context: { params: Promise<{ slug: string }> }
) {
  if (!canQueryDb()) return dbNotConfigured();

  const { slug } = await context.params;
  if (!slug || typeof slug !== 'string') {
    return err('invalid_slug', 'Slug is required.', 400);
  }

  try {
    const caseStudy = await findCaseStudyBySlugCached(slug);
    if (!caseStudy) {
      return err('not_found', `Case study "${slug}" not found.`, 404);
    }
    return ok(caseStudy);
  } catch (e) {
    console.error(`[api/public/case-studies/${slug}] failed`, e);
    return err('internal_error', 'Failed to load case study.', 500);
  }
}
