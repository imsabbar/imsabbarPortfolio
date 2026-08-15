import { after, NextResponse } from 'next/server';
import { canQueryDb, dbNotConfigured, err } from '@/lib/api-helpers';
import { leadInputSchema } from '@/lib/lead-schema';
import { verifyTurnstile } from '@/lib/turnstile';
import { validateLeadAttachment, saveLeadAttachment, deleteLeadAttachment } from '@/lib/upload';
import { dispatchLead } from '@/lib/lead-dispatch';
import { productionLeadConfigReady } from '@/lib/runtime-config';
import {
  getClientIp,
  getUserAgent,
  hashIp,
  insertFormLead,
  isRateLimited,
  hasIpHashPepper,
  setAttachmentMetadata,
} from '@/lib/lead-ingestion';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const MAX_MULTIPART_BYTES = 5 * 1024 * 1024;

function field(form: FormData, name: string): string {
  const value = form.get(name);
  return typeof value === 'string' ? value : '';
}

export async function POST(request: Request) {
  const isDev = process.env.NODE_ENV !== 'production';
  if (!canQueryDb()) {
    if (isDev) {
      console.log('[api/lead] [DEV SIMULATION] Database not configured, simulating successful lead submission.');
      return NextResponse.json({ success: true, leadId: 9999, devMode: true });
    }
    return dbNotConfigured();
  }
  if (!hasIpHashPepper()) return err('server_misconfigured', 'Lead security is not configured.', 503);
  if (!productionLeadConfigReady()) return err('server_misconfigured', 'Lead delivery is not configured.', 503);

  const contentLength = Number(request.headers.get('content-length') ?? 0);
  if (contentLength > MAX_MULTIPART_BYTES) return err('payload_too_large', 'The submission is too large.', 413);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return err('invalid_form_data', 'The submission could not be read.', 400);
  }

  const inputResult = leadInputSchema.safeParse({
    name: field(form, 'name'),
    email: field(form, 'email'),
    phone: field(form, 'phone'),
    company: field(form, 'company'),
    country: field(form, 'country'),
    service_interest: field(form, 'service_interest'),
    estimated_budget: field(form, 'estimated_budget'),
    currency: field(form, 'currency') || 'USD',
    timeline: field(form, 'timeline'),
    message: field(form, 'message'),
    calculated_roi_savings: field(form, 'calculated_roi_savings'),
    source_page: field(form, 'source_page') || '/',
    locale: field(form, 'locale') || 'en',
    consent: field(form, 'consent'),
    privacy_policy_version: field(form, 'privacy_policy_version') || '2026-08-13',
    turnstile_token: field(form, 'turnstile_token'),
    honeypot: field(form, 'honeypot'),
    form_start_time: field(form, 'form_start_time'),
  });

  if (!inputResult.success) {
    return NextResponse.json(
      { error: { code: 'validation_error', message: 'Please check the submitted fields.' }, fields: inputResult.error.flatten().fieldErrors },
      { status: 400 }
    );
  }
  const input = inputResult.data;

  if (input.honeypot) return NextResponse.json({ success: true });
  if (Date.now() - input.form_start_time < 3_000) return err('too_fast', 'Please take a moment before submitting.', 400);

  const ip = getClientIp(request);
  const ipHash = hashIp(ip);
  if (await isRateLimited(ipHash)) return err('rate_limited', 'Too many submissions. Please try again later.', 429);

  if (!(await verifyTurnstile(input.turnstile_token, ip))) return err('turnstile_failed', 'Security verification failed.', 400);

  const attachmentValue = form.get('attachment');
  const attachment = attachmentValue instanceof File && attachmentValue.size > 0 ? attachmentValue : null;
  let validatedAttachment = null;
  if (attachment) {
    try {
      validatedAttachment = await validateLeadAttachment(attachment);
    } catch (error) {
      const code = error instanceof Error && error.message === 'file_too_large' ? 'file_too_large' : 'file_type_invalid';
      return err(code, code === 'file_too_large' ? 'The attachment exceeds the 5 MB limit.' : 'The attachment type is not allowed.', 400);
    }
  }

  let lead;
  try {
    lead = await insertFormLead(input, ipHash, getUserAgent(request));
    if (validatedAttachment && attachment) {
      const saved = await saveLeadAttachment(validatedAttachment, lead.id);
      try {
        await setAttachmentMetadata(lead.id, {
          relativePath: saved.relativePath,
          originalName: attachment.name.slice(0, 255),
          mime: saved.mime,
          size: saved.bytes,
        });
        lead.attachment_path = saved.relativePath;
        lead.attachment_original_name = attachment.name.slice(0, 255);
        lead.attachment_mime = saved.mime;
        lead.attachment_size = saved.bytes;
      } catch (error) {
        await deleteLeadAttachment(saved.relativePath);
        throw error;
      }
    }
  } catch (error) {
    console.error('[api/lead] insert or attachment failed', error);
    return err('internal_error', 'The request could not be saved.', 500);
  }

  after(() => dispatchLead(lead).catch((error) => console.error('[api/lead] async dispatch failed', error)));
  return NextResponse.json({ success: true, leadId: lead.id });
}
