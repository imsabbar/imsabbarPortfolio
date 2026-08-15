/**
 * GET /api/public/services
 *
 * Returns all active services ordered by `sort_order`.
 * Cached via the services repository's tag `portfolio_services`.
 */

import { findAllActiveServicesCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();

  try {
    const services = await findAllActiveServicesCached();
    return ok(services);
  } catch (e) {
    console.error('[api/public/services] failed', e);
    return err('internal_error', 'Failed to load services.', 500);
  }
}
