/**
 * /api/revalidate — OS-triggered cache invalidation (PRD §8.1).
 *
 * The imsabbar OS Portfolio Manager module calls this endpoint after a write
 * to any portfolio_* table so the public site shows the new data immediately.
 *
 * Three layers of protection (PRD §8.1.1):
 *  1. Shared secret in the `Authorization: Bearer <secret>` header.
 *  2. Same-origin check via the `Origin` header (defense in depth — the OS posts
 *     from a known origin; a leaked secret from a different origin is rejected).
 *  3. Tag allowlist — any tag not in `CACHE_TAGS` is silently dropped (the OS
 *     should never send unknown tags, but we don't trust blindly).
 *
 * Method: POST only. GET returns 405.
 *
 * Request body (JSON):
 *   { "tags": ["portfolio_settings", "portfolio_plans"] }
 *
 * Response (200):
 *   { "revalidated": ["portfolio_settings", "portfolio_plans"], "skipped": [] }
 *
 * Errors:
 *   401 — missing/wrong secret
 *   403 — wrong origin
 *   405 — non-POST
 *   400 — bad body / no allowed tags
 */

import { NextResponse, type NextRequest } from 'next/server';
import { revalidateTag } from 'next/cache';
import { isAllowedTag, type CacheTag } from '@/lib/cache-tags';

// Revalidation is a Node.js-only Next API.
export const runtime = 'nodejs';
// Never cache this endpoint itself.
export const dynamic = 'force-dynamic';

/** Origins allowed to call this endpoint. Empty = allow only the host itself. */
function isTrustedOrigin(req: NextRequest): boolean {
  const origin = req.headers.get('origin');
  const referer = req.headers.get('referer');
  const host = req.headers.get('host');

  // No origin and no referer — this is a same-origin request from a server fetch
  // (e.g. curl, internal cron). Allow only when the request has the secret.
  if (!origin && !referer) return true;

  // Prefer the `Origin` header (set by browsers + most HTTP clients).
  if (origin) {
    try {
      const url = new URL(origin);
      return host !== null && url.host === host;
    } catch {
      return false;
    }
  }

  // Fall back to `Referer` for clients that only set that.
  if (referer) {
    try {
      const url = new URL(referer);
      return host !== null && url.host === host;
    } catch {
      return false;
    }
  }

  return false;
}

/** Pull the bearer token from the Authorization header. */
function extractBearer(req: NextRequest): string | null {
  const auth = req.headers.get('authorization');
  if (!auth) return null;
  const [scheme, token] = auth.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

function isValidSecret(token: string | null): boolean {
  const expected = process.env.PORTFOLIO_REVALIDATE_SECRET;
  if (!expected || expected.length === 0) return false;
  if (!token) return false;
  // Constant-time compare to avoid timing attacks.
  if (token.length !== expected.length) return false;
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  }
  return mismatch === 0;
}

/** Narrow an arbitrary body into `{ tags?: unknown }` shape. */
function parseBody(input: unknown): { tags?: unknown } {
  if (input && typeof input === 'object') {
    return input as { tags?: unknown };
  }
  return {};
}

export async function POST(req: NextRequest) {
  // 1. Method guard (Next.js routes this for us, but be explicit).
  // 2. Secret.
  const token = extractBearer(req);
  if (!isValidSecret(token)) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  // 3. Origin.
  if (!isTrustedOrigin(req)) {
    return NextResponse.json({ error: 'forbidden_origin' }, { status: 403 });
  }

  // 4. Body.
  let raw: unknown;
  try {
    raw = await req.json();
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 });
  }
  const { tags } = parseBody(raw);
  if (!Array.isArray(tags) || tags.length === 0) {
    return NextResponse.json({ error: 'tags_required' }, { status: 400 });
  }

  // 5. Tag allowlist.
  const allowed: CacheTag[] = [];
  const skipped: string[] = [];
  for (const t of tags) {
    if (isAllowedTag(t)) {
      allowed.push(t);
    } else {
      skipped.push(String(t));
    }
  }

  if (allowed.length === 0) {
    return NextResponse.json({ error: 'no_allowed_tags', skipped }, { status: 400 });
  }

  // 6. Revalidate.
  for (const tag of allowed) {
    revalidateTag(tag);
  }

  return NextResponse.json({ revalidated: allowed, skipped });
}

/** GET is not allowed. */
export function GET() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}

/** Other methods are not allowed either. */
export async function OPTIONS() {
  return NextResponse.json({ error: 'method_not_allowed' }, { status: 405 });
}
