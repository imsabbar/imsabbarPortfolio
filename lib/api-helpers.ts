/**
 * Shared helpers for public API routes.
 *
 * Public API design (PRD §7.7):
 *  - Always JSON
 *  - Always `{ data: ... }` envelope for collections + singles, so clients can
 *    distinguish "no rows" (`{ data: null }`) from "endpoint missing" (404).
 *  - Errors return `{ error: { code, message } }` with an appropriate HTTP status.
 *  - Endpoints are **read-only** (GET only). Writes go through /api/lead or
 *    the OS app.
 *  - Each route is `runtime = 'nodejs'` because the repositories use mysql2.
 */

import { NextResponse } from 'next/server';
import { isDbConfigured, isSampleDataMode } from '@/lib/db/mysql';

/** Wrap a successful payload in the standard envelope. */
export function ok<T>(data: T, init?: { status?: number; headers?: HeadersInit }): NextResponse {
  return NextResponse.json({ data }, init);
}

/** Standard error envelope. */
export function err(
  code: string,
  message: string,
  status: number
): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status });
}

/** Common error when the DB layer is unavailable in production. */
export function dbNotConfigured(): NextResponse {
  return err(
    'db_not_configured',
    'Database is not configured for this environment.',
    503
  );
}

/**
 * Returns true if the route should even attempt to talk to MySQL.
 * In dev without MySQL, the home page falls back to sample data, but the
 * public API should still 503 — sample data is not a production substitute.
 */
export function canQueryDb(): boolean {
  return isDbConfigured() && !isSampleDataMode();
}
