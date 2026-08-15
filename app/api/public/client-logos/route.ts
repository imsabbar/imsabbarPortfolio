import { findAllActiveClientLogosCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();
  try { return ok(await findAllActiveClientLogosCached()); }
  catch (error) { console.error('[api/public/client-logos] failed', error); return err('internal_error', 'Failed to load client logos.', 500); }
}
