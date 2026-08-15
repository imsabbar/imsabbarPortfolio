/**
 * GET /api/public/content/[section]
 *
 * Returns a single content block by its section key.
 * Section keys: hero, trust_bar, about, contact, footer.
 * Cached via the content blocks repository's tag `portfolio_content_blocks`.
 */

import { findContentBlockByKeyCached, isContentSectionKey } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err, ok } from '@/lib/api-helpers';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  context: { params: Promise<{ section: string }> }
) {
  if (!canQueryDb()) return dbNotConfigured();

  const { section } = await context.params;
  if (!isContentSectionKey(section)) {
    return err('invalid_section', `Unknown content section "${section}".`, 400);
  }

  try {
    const block = await findContentBlockByKeyCached(section);
    if (!block) {
      return err('not_found', `Content block "${section}" not found.`, 404);
    }
    return ok(block);
  } catch (e) {
    console.error(`[api/public/content/${section}] failed`, e);
    return err('internal_error', 'Failed to load content block.', 500);
  }
}
