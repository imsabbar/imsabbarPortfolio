import 'server-only';
import type { LeadRecord } from '@/lib/lead-ingestion';

function escapeTelegramHtml(value: string): string {
  return value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;');
}

export async function sendTelegramLeadSummary(lead: LeadRecord): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_CHAT_ID?.trim();
  if (!token || !chatId) {
    console.info('[telegram] skipped: credentials not configured', { source_type: lead.source_type, lead_id: lead.id });
    return;
  }

  const text = [
    `🆕 New lead via <b>${escapeTelegramHtml(lead.source_type)}</b>`,
    `<b>${escapeTelegramHtml(lead.name)}</b> (${escapeTelegramHtml(lead.email)}) — ${escapeTelegramHtml(lead.company)}`,
    `Service: ${escapeTelegramHtml(lead.service_interest)} · Budget: ${lead.estimated_budget ?? '—'} ${escapeTelegramHtml(lead.currency)}`,
    `Timeline: ${escapeTelegramHtml(lead.timeline)}`,
    `Country: ${escapeTelegramHtml(lead.country)}`,
    `ROI prefill: ${escapeTelegramHtml(lead.calculated_roi_savings)}`,
    '---',
    escapeTelegramHtml(lead.message),
    '---',
    `IP hash: <code>${escapeTelegramHtml(lead.ip_hash.slice(0, 12))}</code> · Page: ${escapeTelegramHtml(lead.source_page)}`,
  ].join('\n');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5_000);
  try {
    const response = await fetch(`https://api.telegram.org/bot${encodeURIComponent(token)}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML', disable_web_page_preview: true }),
      signal: controller.signal,
    });
    if (!response.ok) throw new Error(`Telegram returned ${response.status}`);
  } finally {
    clearTimeout(timeout);
  }
}
