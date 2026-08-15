import { NextResponse } from 'next/server';
import { getRuntimeHealth } from '@/lib/runtime-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  const health = await getRuntimeHealth();
  return NextResponse.json(health, { status: health.status === 'ok' ? 200 : 503 });
}
