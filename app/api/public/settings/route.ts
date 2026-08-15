/**
 * GET /api/public/settings
 *
 * Returns the full `PortfolioSettings` object.
 * Cached via the settings repository's tag `portfolio_settings`.
 */

import { findSettingsCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();

  try {
    const settings = await findSettingsCached();
    return ok(settings);
  } catch (e) {
    console.error('[api/public/settings] failed', e);
    return err('internal_error', 'Failed to load settings.', 500);
  }
}
