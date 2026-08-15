import { after, NextResponse } from 'next/server';
import { canQueryDb, dbNotConfigured, err } from '@/lib/api-helpers';
import { bookingInputSchema } from '@/lib/lead-schema';
import { verifyTurnstile } from '@/lib/turnstile';
import { dispatchLead } from '@/lib/lead-dispatch';
import { getClientIp, getUserAgent, hashIp, hasIpHashPepper, insertBookingLead, isRateLimited } from '@/lib/lead-ingestion';
import { productionLeadConfigReady } from '@/lib/runtime-config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const isDev = process.env.NODE_ENV !== 'production';
  if (!canQueryDb()) {
    if (isDev) {
      console.log('[api/lead/booking] [DEV SIMULATION] Database not configured, simulating successful booking lead.');
      return NextResponse.json({ success: true, leadId: 9999, devMode: true });
    }
    return dbNotConfigured();
  }
  if (!hasIpHashPepper()) return err('server_misconfigured', 'Lead security is not configured.', 503);
  if (!productionLeadConfigReady()) return err('server_misconfigured', 'Lead delivery is not configured.', 503);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return err('invalid_json', 'The booking request could not be read.', 400);
  }
  const result = bookingInputSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: { code: 'validation_error', message: 'Please complete the booking gate.' }, fields: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const input = result.data;
  if (Date.now() - input.form_start_time < 3_000) return err('too_fast', 'Please take a moment before continuing.', 400);

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  if (await isRateLimited(ipHash)) return err('rate_limited', 'Too many submissions. Please try again later.', 429);
  if (!(await verifyTurnstile(input.turnstile_token, ip))) return err('turnstile_failed', 'Security verification failed.', 400);

  try {
    const lead = await insertBookingLead(input, ipHash, getUserAgent(request));
    after(() => dispatchLead(lead).catch((error) => console.error('[api/lead/booking] async dispatch failed', error)));
    return NextResponse.json({ success: true, leadId: lead.id });
  } catch (error) {
    console.error('[api/lead/booking] insert failed', error);
    return err('internal_error', 'The booking request could not be saved.', 500);
  }
}
