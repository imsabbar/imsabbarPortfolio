'use client';

import React, { useCallback, useEffect, useState } from 'react';
import type { Dictionary } from '@/types/dictionary';
import type { Locale } from '@/i18n/config';
import type { PortfolioSettings } from '@/types/portfolio';
import { Modal } from '@/components/ui/Modal';
import { bookingProjectTypes, bookingBudgetRanges } from '@/lib/sample-data';
import { TurnstileWidget } from '@/components/TurnstileWidget';
import { trackEvent, trackWhatsAppClick } from '@/lib/analytics';
import { whatsappUrl } from '@/lib/constants';
import { CalEmbed } from '@/components/CalEmbed';

interface BookingGateModalProps {
  isOpen: boolean;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  settings: PortfolioSettings;
}

export function BookingGateModal({ isOpen, onClose, dict, locale, settings }: BookingGateModalProps) {
  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [formStartTime, setFormStartTime] = useState(0);
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [error, setError] = useState('');
  const [schedulerOpen, setSchedulerOpen] = useState(false);
  const [schedulerError, setSchedulerError] = useState(false);
  const [schedulerReady, setSchedulerReady] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setFormStartTime(Date.now());
      trackEvent('booking_gate_started', { locale });
    }
  }, [isOpen, locale]);

  const reset = () => {
    setStep(1);
    setProjectType('');
    setBudgetRange('');
    setTurnstileToken('');
    setFormStartTime(0);
    setStatus('idle');
    setError('');
    setSchedulerOpen(false);
    setSchedulerError(false);
    setSchedulerReady(false);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);

  const submitBooking = async () => {
    if (process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY && !turnstileToken) {
      setError(dict.booking.turnstile_required);
      return;
    }
    setStatus('saving');
    setError('');
    try {
      const response = await fetch('/api/lead/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_type: projectType,
          budget_range: budgetRange,
          source_page: window.location.pathname,
          locale,
          turnstile_token: turnstileToken,
          form_start_time: formStartTime,
        }),
      });
      const data = await response.json() as { success?: boolean; error?: { message?: string } };
      if (!response.ok || !data.success) {
        setStatus('error');
        setError(data.error?.message || dict.booking.booking_error);
        return;
      }
      trackEvent('booking_gate_completed', { locale, project_type: projectType, budget_range: budgetRange });
      if (settings.scheduling_link) {
        setSchedulerOpen(true);
      } else {
        trackEvent('booking_fallback', { locale, project_type: projectType, budget_range: budgetRange });
        setStatus('saved');
      }
    } catch {
      setStatus('error');
      setError(dict.booking.booking_error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={dict.booking.title} subtitle={`${dict.booking.step_label} 0${step}`} closeLabel={dict.common.close} maxWidth="max-w-lg">
      {status === 'saved' ? (
        <div className="space-y-5 text-center">
          <p className="font-display font-bold text-lg text-[var(--color-text)]">{dict.booking.fallback_title}</p>
          <p className="text-sm text-[var(--color-text-muted)]">{dict.booking.fallback_body}</p>
          <a href={whatsappUrl(dict.common.whatsapp_prefill)} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsAppClick()} className="btn btn-primary w-full">{dict.forms.states.whatsapp_fallback}</a>
        </div>
      ) : schedulerOpen ? (
        <div className="space-y-5">
          {schedulerError ? <div className="space-y-4"><p role="alert" className="text-sm text-red-300">{dict.booking.embed_error}</p><a href={settings.scheduling_link} target="_blank" rel="noopener noreferrer" onClick={() => { trackEvent('booking_handoff', { locale, project_type: projectType, budget_range: budgetRange }); }} className="btn btn-primary w-full">{dict.booking.open_scheduler}</a></div> : <><div className={schedulerReady ? 'hidden' : 'skeleton min-h-[520px] w-full rounded-xl'} aria-hidden="true" /><CalEmbed calLink={settings.scheduling_link} metadata={{ project_type: projectType, budget_range: budgetRange }} onReady={() => setSchedulerReady(true)} onSuccess={() => { trackEvent('booking_confirmed', { locale, project_type: projectType, budget_range: budgetRange }); setStatus('saved'); setSchedulerOpen(false); }} onError={() => setSchedulerError(true)} /></>}
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2" aria-hidden="true">{[1, 2, 3].map((value) => <div key={value} className={`h-1.5 rounded-full transition-colors ${value <= step ? 'w-8 bg-[var(--color-accent-primary)]' : 'w-4 bg-[var(--color-border-strong)]'}`} />)}</div>

          {step === 1 && <div className="space-y-4"><label className="block text-xs font-mono text-[var(--color-text-muted)]">{dict.booking.step_type}</label><div className="space-y-2">{bookingProjectTypes.map(({ key, dictKey }) => { const label = dict.booking[dictKey]; return <button key={key} type="button" onClick={() => setProjectType(key)} className={`w-full p-3 rounded-xl text-start font-body text-xs border transition-colors ${projectType === key ? 'border-[var(--color-accent-primary)] bg-cyan-500/10 text-[var(--color-text)] font-semibold' : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]'}`}>{label}</button>; })}</div></div>}

          {step === 2 && <div className="space-y-4"><label className="block text-xs font-mono text-[var(--color-text-muted)]">{dict.booking.step_budget}</label><div className="space-y-2">{bookingBudgetRanges.map(({ key, dictKey }) => { const label = dict.booking[dictKey]; return <button key={key} type="button" onClick={() => setBudgetRange(key)} className={`w-full p-3 rounded-xl text-start font-mono text-xs border transition-colors ${budgetRange === key ? 'border-[var(--color-accent-primary)] bg-cyan-500/10 text-[var(--color-text)] font-semibold' : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)]'}`}>{label}</button>; })}</div></div>}

          {step === 3 && <div className="space-y-4"><p className="font-body text-xs text-[var(--color-text-muted)]">{dict.booking.step_confirm}</p><div className="p-4 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-xs font-mono space-y-1 text-start"><p>{dict.booking.project_label}: <span className="text-[var(--color-text)] font-semibold">{projectType ? dict.booking[`type_${projectType}` as keyof typeof dict.booking] : '—'}</span></p><p>{dict.booking.budget_label}: <span className="text-[var(--color-text)] font-semibold">{budgetRange ? dict.booking[`budget_${budgetRange}` as keyof typeof dict.booking] : '—'}</span></p></div><p className="text-[10px] font-mono text-[var(--color-text-muted)]">{dict.booking.turnstile_label}</p><TurnstileWidget onToken={handleTurnstileToken} onError={() => setError(dict.booking.turnstile_required)} />{error && <p role="alert" className="text-xs text-red-300">{error}</p>}</div>}

          {status === 'error' && error && <p role="alert" className="text-xs text-red-300">{error}</p>}
          <button type="button" onClick={() => { if (step < 3) setStep((current) => current + 1); else void submitBooking(); }} disabled={(step === 1 && !projectType) || (step === 2 && !budgetRange) || status === 'saving'} className="w-full btn btn-primary">{status === 'saving' ? dict.booking.saving : step < 3 ? dict.booking.continue : dict.booking.confirm}</button>
        </div>
      )}
    </Modal>
  );
}
