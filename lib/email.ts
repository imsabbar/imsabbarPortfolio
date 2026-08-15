import 'server-only';
import { Resend } from 'resend';
import type { Dictionary } from '@/types/dictionary';
import type { LeadRecord } from '@/lib/lead-ingestion';

function escapeHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
}

function replaceTokens(template: string, values: Record<string, string>): string {
  return Object.entries(values).reduce((result, [key, value]) => result.replaceAll(`{${key}}`, value), template);
}

function fromAddress(): string {
  return process.env.RESEND_FROM_EMAIL?.trim() || 'Ismail Sabbar <noreply@imsabbar.com>';
}

export async function sendResendEmail(input: { to: string; subject: string; html: string; text: string }): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    console.info('[resend] skipped: credentials not configured', { to: input.to, subject: input.subject });
    return;
  }
  const resend = new Resend(apiKey);
  let timeoutId: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Resend request timed out')), 5_000);
  });
  try {
    const { error } = await Promise.race([resend.emails.send({ from: fromAddress(), ...input }), timeout]);
    if (error) throw new Error(error.message);
  } finally {
    if (timeoutId) clearTimeout(timeoutId);
  }
}

export function renderAutoReply(dict: Dictionary, lead: LeadRecord, slaNotice: string): { subject: string; html: string; text: string } {
  const whatsappLink = `https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? '212681510095').replace(/\D/g, '')}`;
  const values = {
    name: escapeHtml(lead.name),
    sla_notice: escapeHtml(slaNotice || '24 hours'),
    whatsapp_link: whatsappLink,
    date: new Intl.DateTimeFormat(lead.locale).format(new Date()),
    time: new Intl.DateTimeFormat(lead.locale, { hour: '2-digit', minute: '2-digit' }).format(new Date()),
  };
  const subject = replaceTokens(dict.email.autoreply_subject, values);
  const body = replaceTokens(dict.email.autoreply_body, values);
  const html = `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;font-family:Arial,sans-serif;color:#17202b"><tr><td style="padding:24px"><h2>${escapeHtml(subject)}</h2><p>${body.replaceAll('\n', '<br />')}</p><p><a href="${whatsappLink}">${escapeHtml(dict.email.autoreply_whatsapp_cta)}</a></p><p>${escapeHtml(dict.email.autoreply_signature)}</p></td></tr></table>`;
  return { subject, html, text: body };
}

export function renderNotification(dict: Dictionary, lead: LeadRecord): { subject: string; html: string; text: string } {
  const subject = replaceTokens(dict.email.notification_subject, {
    service_interest: lead.service_interest || lead.source_type,
    name: lead.name,
  });
  const intro = dict.email.notification_intro;
  const rows = [
    ['Name', lead.name], ['Email', lead.email], ['Company', lead.company], ['Service', lead.service_interest],
    ['Budget', `${lead.estimated_budget ?? '—'} ${lead.currency}`], ['Timeline', lead.timeline],
    ['Country', lead.country], ['Source', `${lead.source_type} · ${lead.source_page}`], ['Message', lead.message],
  ];
  const html = `<h2>${escapeHtml(subject)}</h2><p>${escapeHtml(intro)}</p><table>${rows.map(([label, value]) => `<tr><th align="left" style="padding:6px">${escapeHtml(label)}</th><td style="padding:6px">${escapeHtml(value)}</td></tr>`).join('')}</table>`;
  const text = `${intro}\n\n${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}`;
  return { subject, html, text };
}
