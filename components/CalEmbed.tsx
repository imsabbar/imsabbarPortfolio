'use client';

import React, { useEffect, useRef, useState } from 'react';

type CalNamespace = ((...args: unknown[]) => void) & { q?: unknown[] };
type CalGlobal = CalNamespace & { ns?: Record<string, CalNamespace> };

declare global { interface Window { Cal?: CalGlobal } }

let loaderPromise: Promise<void> | null = null;

function loadCalScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('browser_required'));
  if (window.Cal && window.Cal.ns) return Promise.resolve();
  if (loaderPromise) return loaderPromise;
  loaderPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-cal-embed]');
    if (existing) { existing.addEventListener('load', () => resolve(), { once: true }); existing.addEventListener('error', () => reject(new Error('cal_script_failed')), { once: true }); return; }
    const script = document.createElement('script');
    script.src = 'https://app.cal.com/embed/embed.js'; script.async = true; script.dataset.calEmbed = 'true';
    script.onload = () => resolve(); script.onerror = () => reject(new Error('cal_script_failed')); document.head.appendChild(script);
  });
  return loaderPromise;
}

function parseLink(value: string): { origin: string; path: string } {
  const url = new URL(value);
  if (url.protocol !== 'https:') throw new Error('invalid_cal_url');
  const configured = (process.env.NEXT_PUBLIC_CAL_EMBED_ALLOWED_ORIGINS ?? '')
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);
  const allowed = new Set(['https://cal.com', 'https://app.cal.com', ...configured]);
  if (!allowed.has(url.origin)) throw new Error('cal_origin_not_allowed');
  return { origin: url.origin, path: `${url.pathname.replace(/^\//, '')}${url.search}` };
}

export function CalEmbed({ calLink, metadata, onReady, onSuccess, onError }: { calLink: string; metadata: Record<string, string>; onReady?: () => void; onSuccess?: (data: unknown) => void; onError?: () => void }) {
  const elementRef = useRef<HTMLDivElement>(null);
  const [loadError, setLoadError] = useState(false);
  const namespaceRef = useRef<string>('');

  useEffect(() => {
    let active = true;
    try {
      const parsed = parseLink(calLink);
      const namespace = `portfolio_${Math.random().toString(36).slice(2, 10)}`;
      namespaceRef.current = namespace;
      void loadCalScript().then(() => {
        if (!active || !window.Cal || !elementRef.current) return;
        const cal = window.Cal;
        cal('init', namespace, { origin: parsed.origin });
        const scoped = cal.ns?.[namespace];
        if (!scoped) throw new Error('cal_namespace_unavailable');
        scoped('on', { action: 'linkReady', callback: () => { if (active) onReady?.(); } });
        scoped('on', { action: 'bookingSuccessfulV2', callback: (event: { detail?: { data?: unknown } }) => { if (active) onSuccess?.(event.detail?.data); } });
        scoped('on', { action: 'linkFailed', callback: () => { if (active) { setLoadError(true); onError?.(); } } });
        scoped('inline', { elementOrSelector: elementRef.current, calLink: parsed.path, config: { ...Object.fromEntries(Object.entries(metadata).map(([key, value]) => [`metadata[${key}]`, value])) } });
      }).catch(() => { if (active) { setLoadError(true); onError?.(); } });
    } catch { setLoadError(true); onError?.(); }
    return () => { active = false; namespaceRef.current = ''; if (elementRef.current) elementRef.current.innerHTML = ''; };
  }, [calLink, metadata, onError, onReady, onSuccess]);

  if (loadError) return null;
  return <div ref={elementRef} className="min-h-[520px] w-full" aria-label="Cal.com scheduler" />;
}
