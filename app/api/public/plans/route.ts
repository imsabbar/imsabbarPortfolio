/**
 * GET /api/public/plans
 *
 * Returns all active plans ordered by `sort_order`.
 * Cached via the plans repository's tag `portfolio_plans`.
 */

import { findAllActivePlansCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();

  try {
    const plans = await findAllActivePlansCached();
    return ok(plans);
  } catch (e) {
    console.error('[api/public/plans] failed', e);
    return err('internal_error', 'Failed to load plans.', 500);
  }
}
