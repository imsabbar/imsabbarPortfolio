/**
 * GET /api/public/tech-stack
 *
 * Returns all active *featured* tech stack items ordered by `sort_order`.
 * Cached via the tech stack repository's tag `portfolio_tech_stack`.
 */

import { findAllActiveFeaturedTechStackCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();

  try {
    const techStack = await findAllActiveFeaturedTechStackCached();
    return ok(techStack);
  } catch (e) {
    console.error('[api/public/tech-stack] failed', e);
    return err('internal_error', 'Failed to load tech stack.', 500);
  }
}
