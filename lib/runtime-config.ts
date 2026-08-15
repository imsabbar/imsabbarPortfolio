import 'server-only';

import { access, constants } from 'node:fs/promises';
import path from 'node:path';
import { isDbConfigured, queryOne } from '@/lib/db/mysql';

const productionRequired = [
  'PORTFOLIO_DB_HOST',
  'PORTFOLIO_DB_USER',
  'PORTFOLIO_DB_NAME',
  'PORTFOLIO_IP_HASH_PEPPER',
  'NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY',
  'CLOUDFLARE_TURNSTILE_SECRET_KEY',
  'RESEND_API_KEY',
  'RESEND_FROM_EMAIL',
  'NOTIFICATION_EMAIL',
  'TELEGRAM_BOT_TOKEN',
  'TELEGRAM_CHAT_ID',
  'NEXT_PUBLIC_SITE_URL',
] as const;

function configured(name: string): boolean {
  return Boolean(process.env[name]?.trim());
}

export function productionLeadConfigReady(): boolean {
  if (process.env.NODE_ENV !== 'production') return true;
  return productionRequired.every(configured);
}

export function getUploadRoot(): string {
  return process.env.PORTFOLIO_UPLOAD_PATH?.trim() || path.join(process.cwd(), 'uploads', 'portfolio', 'leads');
}

export async function getRuntimeHealth() {
  const environment = Object.fromEntries(productionRequired.map((key) => [key, configured(key)]));
  let database = false;
  try {
    if (isDbConfigured()) {
      await queryOne('SELECT 1 AS ok');
      database = true;
    }
  } catch {
    database = false;
  }

  let uploads = false;
  try {
    await access(getUploadRoot(), constants.W_OK);
    uploads = true;
  } catch {
    uploads = false;
  }

  const environmentReady = process.env.NODE_ENV !== 'production' || productionRequired.every(configured);
  return {
    status: environmentReady && database && uploads ? 'ok' : 'degraded',
    environment: Object.fromEntries(Object.entries(environment).map(([key, value]) => [key, value ? 'configured' : 'missing'])),
    checks: { database, uploads, environment: environmentReady },
    timestamp: new Date().toISOString(),
  } as const;
}
