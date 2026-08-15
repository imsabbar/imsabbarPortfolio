import { findAllActiveFaqCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();
  try { return ok(await findAllActiveFaqCached()); }
  catch (error) { console.error('[api/public/faq] failed', error); return err('internal_error', 'Failed to load FAQ.', 500); }
}
