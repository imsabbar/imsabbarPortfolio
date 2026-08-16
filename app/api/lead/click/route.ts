import { NextResponse } from 'next/server';
import { canQueryDb } from '@/lib/api-helpers';
import { clickInputSchema } from '@/lib/lead-schema';
import { getClientIp, getUserAgent, hashIp, hasIpHashPepper, insertWhatsAppLead } from '@/lib/lead-ingestion';
import { trackServerEvent } from '@/lib/analytics';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = clickInputSchema.safeParse(await request.json());
    if (!body.success) return NextResponse.json({ ok: true });
    if (canQueryDb() && hasIpHashPepper()) {
      const sourcePage = String(body.data.source_page || '/');
      const locale = body.data.locale || 'en';
      const result = await insertWhatsAppLead(sourcePage, hashIp(getClientIp(request)), getUserAgent(request), locale);
      trackServerEvent('whatsapp_click', { page: sourcePage, locale, lead_id: Number(result.insertId) });
    }
  } catch (error) {
    console.info('[api/lead/click] attribution skipped', error instanceof Error ? error.message : error);
  }
  return NextResponse.json({ ok: true });
}
