import 'server-only';
import { getDictionary } from '@/lib/get-dictionary';
import { sendResendEmail, renderAutoReply, renderNotification } from '@/lib/email';
import { sendTelegramLeadSummary } from '@/lib/telegram';
import { trackServerEvent } from '@/lib/analytics';
import type { LeadRecord } from '@/lib/lead-ingestion';

export async function dispatchLead(lead: LeadRecord): Promise<void> {
  const dict = await getDictionary(lead.locale);
  const tasks: Promise<void>[] = [
    sendTelegramLeadSummary(lead),
  ];

  if (process.env.NOTIFICATION_EMAIL?.trim()) {
    const notification = renderNotification(dict, lead);
    tasks.push(sendResendEmail({
      to: process.env.NOTIFICATION_EMAIL.trim(),
      ...notification,
    }));
  }

  if (lead.source_type === 'form' && lead.email && lead.email !== 'n/a') {
    const autoReply = renderAutoReply(dict, lead, process.env.LEAD_SLA_NOTICE ?? '24 hours');
    tasks.push(sendResendEmail({ to: lead.email, ...autoReply }));
  }

  const results = await Promise.allSettled(tasks);
  results.forEach((result, index) => {
    if (result.status === 'rejected') {
      console.error('[lead-dispatch] task failed', { index, lead_id: lead.id, error: result.reason });
    }
  });
  trackServerEvent('lead_submitted', { source_type: lead.source_type, lead_id: lead.id });
}
