import 'server-only';
import { createHash } from 'node:crypto';
import { execute, queryOne } from '@/lib/db/mysql';
import type { BookingInput, LeadInput } from '@/lib/lead-schema';
import type { ExecuteValues, RowDataPacket, ResultSetHeader } from 'mysql2/promise';

export type LeadSourceType = 'form' | 'booking' | 'whatsapp';

export interface LeadRecord {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  country: string;
  currency: string;
  service_interest: string;
  estimated_budget: number | null;
  timeline: string;
  calculated_roi_savings: string;
  message: string;
  attachment_path: string | null;
  source_page: string;
  source_type: LeadSourceType;
  ip_hash: string;
  user_agent: string;
  locale: 'en' | 'fr' | 'ar';
  consent_at: string | null;
  privacy_policy_version: string;
  attachment_original_name: string | null;
  attachment_mime: string | null;
  attachment_size: number | null;
}

interface IdRow extends RowDataPacket { id: number }

export function getClientIp(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  return forwarded || request.headers.get('x-real-ip')?.trim() || null;
}

export function getUserAgent(request: Request): string {
  return (request.headers.get('user-agent') ?? '').slice(0, 255);
}

export function hashIp(ip: string | null): string {
  const pepper = process.env.PORTFOLIO_IP_HASH_PEPPER || process.env.PORTFOLIO_REVALIDATE_SECRET || 'development-only-pepper';
  return createHash('sha256').update(`${ip ?? 'unknown'}:${pepper}`).digest('hex');
}

export function hasIpHashPepper(): boolean {
  return process.env.NODE_ENV !== 'production' || Boolean(process.env.PORTFOLIO_IP_HASH_PEPPER?.trim());
}

export async function isRateLimited(ipHash: string): Promise<boolean> {
  const third = await queryOne<IdRow>(
    `SELECT id FROM portfolio_leads
     WHERE ip_hash = ? AND created_at > NOW() - INTERVAL 1 HOUR
     ORDER BY created_at DESC LIMIT 1 OFFSET 2`,
    [ipHash]
  );
  return Boolean(third);
}

function nullable(value: string | undefined): string | null {
  return value && value.length > 0 ? value : null;
}

export async function insertFormLead(input: LeadInput, ipHash: string, userAgent: string): Promise<LeadRecord> {
  const result = await execute(
    `INSERT INTO portfolio_leads
      (name, email, phone, company, country, currency, service_interest, estimated_budget,
       timeline, calculated_roi_savings, message, source_page, source_type, referrer,
       utm_source, utm_medium, utm_campaign, ip_hash, user_agent,
       locale, consent_at, privacy_policy_version)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'form', ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      input.name,
      input.email,
      nullable(input.phone),
      nullable(input.company),
      nullable(input.country),
      input.currency,
      nullable(input.service_interest),
      input.estimated_budget ?? null,
      nullable(input.timeline),
      nullable(input.calculated_roi_savings),
      nullable(input.message),
      input.source_page,
      nullable(input.referrer),
      nullable(input.utm_source),
      nullable(input.utm_medium),
      nullable(input.utm_campaign),
      ipHash,
      userAgent,
      input.locale,
      input.consent ? new Date() : null,
      input.privacy_policy_version,
    ] as ExecuteValues[]
  );
  return {
    id: result.insertId,
    name: input.name,
    email: input.email,
    phone: input.phone ?? '',
    company: input.company ?? '',
    country: input.country ?? '',
    currency: input.currency,
    service_interest: input.service_interest ?? '',
    estimated_budget: input.estimated_budget ?? null,
    timeline: input.timeline ?? '',
    calculated_roi_savings: input.calculated_roi_savings ?? '',
    message: input.message ?? '',
    attachment_path: null,
    source_page: input.source_page,
    source_type: 'form',
    ip_hash: ipHash,
    user_agent: userAgent,
    locale: input.locale,
    consent_at: input.consent ? new Date().toISOString() : null,
    privacy_policy_version: input.privacy_policy_version,
    attachment_original_name: null,
    attachment_mime: null,
    attachment_size: null,
  };
}

const bookingBudgetValue: Record<BookingInput['budget_range'], number> = {
  small: 1000,
  medium: 2250,
  large: 5000,
};

export async function insertBookingLead(input: BookingInput, ipHash: string, userAgent: string): Promise<LeadRecord> {
  const message = `Booking gate: ${input.project_type}; budget range: ${input.budget_range}`;
  const result = await execute(
    `INSERT INTO portfolio_leads
      (name, email, currency, service_interest, estimated_budget, message, source_page, source_type, ip_hash, user_agent, locale)
     VALUES (NULL, NULL, 'USD', ?, ?, ?, ?, 'booking', ?, ?, ?)`,
    [input.project_type, bookingBudgetValue[input.budget_range], message, input.source_page, ipHash, userAgent, input.locale] as ExecuteValues[]
  );
  return {
    id: result.insertId,
    name: '',
    email: '',
    phone: '',
    company: '',
    country: '',
    currency: 'USD',
    service_interest: input.project_type,
    estimated_budget: bookingBudgetValue[input.budget_range],
    timeline: '',
    calculated_roi_savings: '',
    message,
    attachment_path: null,
    source_page: input.source_page,
    source_type: 'booking',
    ip_hash: ipHash,
    user_agent: userAgent,
    locale: input.locale,
    consent_at: null,
    privacy_policy_version: '',
    attachment_original_name: null,
    attachment_mime: null,
    attachment_size: null,
  };
}

export async function insertWhatsAppLead(sourcePage: string, ipHash: string, userAgent: string, locale = 'en'): Promise<ResultSetHeader> {
  return execute(
    `INSERT INTO portfolio_leads
      (name, email, source_page, source_type, ip_hash, user_agent, locale)
     VALUES (NULL, NULL, ?, 'whatsapp', ?, ?, ?)`,
    [sourcePage, ipHash, userAgent, locale] as ExecuteValues[]
  );
}

export async function setAttachmentPath(leadId: number, relativePath: string): Promise<void> {
  await execute('UPDATE portfolio_leads SET attachment_path = ? WHERE id = ?', [relativePath, leadId] as ExecuteValues[]);
}

export async function setAttachmentMetadata(
  leadId: number,
  metadata: { relativePath: string; originalName: string; mime: string; size: number }
): Promise<void> {
  await execute(
    `UPDATE portfolio_leads
     SET attachment_path = ?, attachment_original_name = ?, attachment_mime = ?, attachment_size = ?
     WHERE id = ?`,
    [metadata.relativePath, metadata.originalName, metadata.mime, metadata.size, leadId] as ExecuteValues[]
  );
}
