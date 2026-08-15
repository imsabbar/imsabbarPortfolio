/**
 * GET /api/public/testimonials
 *
 * Returns all active testimonials ordered by `sort_order`.
 * Cached via the testimonials repository's tag `portfolio_testimonials`.
 */

import { findAllActiveTestimonialsCached } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!canQueryDb()) return dbNotConfigured();

  try {
    const testimonials = await findAllActiveTestimonialsCached();
    return ok(testimonials);
  } catch (e) {
    console.error('[api/public/testimonials] failed', e);
    return err('internal_error', 'Failed to load testimonials.', 500);
  }
}
