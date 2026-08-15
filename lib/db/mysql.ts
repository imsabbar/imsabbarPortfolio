/**
 * MySQL singleton pool — PRD §7.1.
 *
 * Hard requirements from the PRD:
 * - `runtime = 'nodejs'` in every route module that touches MySQL
 *   (mysql2 needs Node.js TCP; it does NOT run in the Edge Runtime).
 * - `connectionLimit: 5`
 * - SSL for production / remote hosts
 * - **Singleton pool in ALL environments** — cached on `globalThis`, not just in dev.
 *   A per-call pool in production leaks connections on shared hosting.
 *
 * `mysql2` is listed in `next.config.ts` `serverExternalPackages` so it never
 * gets bundled to the client. Any accidental client import will fail the build.
 *
 * The pool is created lazily on the first call to `getPool()` — this means
 * `next build` (which never executes queries) succeeds even without env vars.
 * The `runtime = 'nodejs'` declaration on every route file + page is what
 * guarantees the runtime used at request time.
 */

import 'server-only';
import {
  createPool,
  type Pool,
  type PoolOptions,
  type RowDataPacket,
  type ResultSetHeader,
  type ExecuteValues,
} from 'mysql2/promise';

const POOL_SYMBOL = Symbol.for('imsabbar.portfolio.mysql.pool');

interface GlobalWithPool {
  [POOL_SYMBOL]?: Pool;
}

const isProduction = process.env.NODE_ENV === 'production';

function readEnv(): PoolOptions {
  // PORTFOLIO_* is the canonical public-site configuration. DB_* aliases are
  // accepted for local compatibility with the original Hostinger setup.
  const host = process.env.PORTFOLIO_DB_HOST || process.env.DB_HOST;
  const user = process.env.PORTFOLIO_DB_USER || process.env.DB_USER;
  const password = process.env.PORTFOLIO_DB_PASSWORD || process.env.DB_PASSWORD;
  const database = process.env.PORTFOLIO_DB_NAME || process.env.DB_NAME;
  const port = Number(process.env.PORTFOLIO_DB_PORT || process.env.DB_PORT || 3306);

  if (!host || !user || !database) {
    throw new DbNotConfiguredError(
      'PORTFOLIO_DB_HOST / PORTFOLIO_DB_USER / PORTFOLIO_DB_NAME are required to query the portfolio DB.'
    );
  }

  const options: PoolOptions = {
    host,
    port,
    user,
    password,
    database,
    connectionLimit: 5,
    // mysql2 returns JSON columns as parsed objects by default — keep that.
    // Dates come back as Date objects; repositories stringify as needed.
    waitForConnections: true,
    queueLimit: 0,
    // Reasonable timeouts so a dead MySQL doesn't hang the request indefinitely.
    connectTimeout: 10_000,
    // Keep-alive prevents connection drops from Hostinger idle timeouts (wait_timeout)
    enableKeepAlive: true,
    keepAliveInitialDelay: 10_000,
  };

  // PRD §7.1: SSL for production / remote hosts.
  if (isProduction || host !== '127.0.0.1' && host !== 'localhost') {
    options.ssl = { rejectUnauthorized: false };
  }

  return options;
}

/**
 * Returns the singleton pool. Cached on `globalThis` in ALL environments
 * (PRD §7.1) — a per-call pool leaks connections on shared hosting.
 */
export function getPool(): Pool {
  const g = globalThis as GlobalWithPool;
  if (g[POOL_SYMBOL]) return g[POOL_SYMBOL];

  const pool = createPool(readEnv());
  g[POOL_SYMBOL] = pool;
  return pool;
}

/** True if all required env vars are present. Callers may use this to skip DB work in dev. */
export function isDbConfigured(): boolean {
  return Boolean(
    (process.env.PORTFOLIO_DB_HOST || process.env.DB_HOST) &&
      (process.env.PORTFOLIO_DB_USER || process.env.DB_USER) &&
      (process.env.PORTFOLIO_DB_NAME || process.env.DB_NAME)
  );
}

/** Dev-only escape hatch. When `USE_SAMPLE_DATA=true`, the sections layer skips DB queries. */
export function isSampleDataMode(): boolean {
  return process.env.USE_SAMPLE_DATA === 'true';
}

/**
 * Tagged error so the sections layer can distinguish "DB not configured" from
 * "DB query failed" and decide whether to log + hide vs. re-throw.
 */
export class DbNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DbNotConfiguredError';
  }
}

// ---------------------------------------------------------------------------
// query<T>() helper — fully typed
// ---------------------------------------------------------------------------

/** Run a SELECT and return rows typed as `T[]`. */
export async function query<T extends RowDataPacket>(sql: string, params: ExecuteValues[] = []): Promise<T[]> {
  const [rows] = await getPool().query<T[]>(sql, params);
  return rows;
}

/** Run a SELECT and return at most one row typed as `T | null`. */
export async function queryOne<T extends RowDataPacket>(
  sql: string,
  params: ExecuteValues[] = []
): Promise<T | null> {
  const rows = await query<T>(sql, params);
  return rows.length > 0 ? rows[0] : null;
}

/** Run an INSERT / UPDATE / DELETE and return the result header (affectedRows, insertId, etc). */
export async function execute(sql: string, params: ExecuteValues[] = []): Promise<ResultSetHeader> {
  const [result] = await getPool().execute<ResultSetHeader>(sql, params);
  return result;
}

/**
 * Close the pool — only useful in scripts / tests. Never call from request handlers.
 */
export async function closePool(): Promise<void> {
  const g = globalThis as GlobalWithPool;
  if (g[POOL_SYMBOL]) {
    await g[POOL_SYMBOL].end();
    delete g[POOL_SYMBOL];
  }
}
