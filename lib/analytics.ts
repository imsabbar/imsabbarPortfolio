/**
 * PRD §13 — Analytics: Cloudflare Web Analytics Beacon (pageviews + Web Vitals,
 * automatic) + Cloudflare Zaraz for custom events.
 *
 * Zaraz is loaded from the Cloudflare dashboard — no npm dependency, no script
 * tag in this repo. `trackEvent` is a typed no-op-safe wrapper around
 * `window.zaraz.track` (absent on localhost → events are silently skipped).
 */

export type AnalyticsEvent =
  | 'plan_view'
  | 'case_study_expand'
  | 'case_study_navigate'
  | 'case_study_load_more'
  | 'n8n_simulator_play'
  | 'roi_calculated'
  | 'currency_changed'
  | 'language_changed'
  | 'lead_submitted'
  | 'booking_gate_started'
  | 'booking_gate_completed'
  | 'booking_handoff'
  | 'booking_confirmed'
  | 'booking_fallback'
  | 'faq_expanded'
  | 'file_attached'
  | 'whatsapp_click';

type EventProps = Record<string, string | number | boolean | undefined>;

interface ZarazGlobal {
  track: (event: string, props?: EventProps) => void;
}

declare global {
  interface Window {
    zaraz?: ZarazGlobal;
  }
}

export function trackEvent(event: AnalyticsEvent, props?: EventProps): void {
  if (typeof window === 'undefined') return;
  try {
    window.zaraz?.track(event, props);
  } catch {
    // Analytics must never break UX.
  }
}

/** Server-side observability shim for events that also create a lead row. */
export function trackServerEvent(event: AnalyticsEvent, props?: EventProps): void {
  console.info('[analytics]', JSON.stringify({ event, props: props ?? {} }));
}

/** Fire a non-blocking WhatsApp attribution request before the browser navigates. */
export function trackWhatsAppClick(sourcePage?: string, locale?: string): void {
  const page = sourcePage ?? (typeof window !== 'undefined' ? window.location.pathname : '/');
  trackEvent('whatsapp_click', { page, locale });
  if (typeof window === 'undefined') return;
  void fetch('/api/lead/click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ source_page: page, locale: locale || 'en' }),
    keepalive: true,
  }).catch(() => {
    // Attribution must never block or interrupt the WhatsApp navigation.
  });
}
