'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { ContactContent, PortfolioSettings, Service } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { SUPPORTED_CURRENCIES, type Currency } from '@/lib/currency';
import {
  MailIcon,
  PhoneIcon,
  MessageCircleIcon,
  CheckCircleIcon,
  SendIcon,
  CheckIcon,
  BoltIcon,
  LayersIcon,
  DocumentIcon,
  ArrowRightIcon,
} from '@/components/icons';
import { TurnstileWidget, type TurnstileWidgetHandle } from '@/components/TurnstileWidget';
import { ROI_SESSION_KEY, type RoiEstimate } from '@/components/RoiCalculator';
import { trackEvent, trackWhatsAppClick } from '@/lib/analytics';
import { getLocalizedField } from '@/lib/db/helpers';

interface LeadFormProps {
  dict: Dictionary;
  locale?: Locale;
  settings: PortfolioSettings;
  contact?: ContactContent | null;
  initialCurrency?: Currency;
  services?: Service[];
}

interface FormValues {
  name: string;
  email: string;
  company: string;
  phone: string;
  country: string;
  serviceInterest: string;
  estimatedBudget: string;
  currency: Currency;
  timeline: string;
  message: string;
  calculatedRoiSavings: string;
}

const EMPTY_VALUES: FormValues = {
  name: '',
  email: '',
  company: '',
  phone: '',
  country: '',
  serviceInterest: '',
  estimatedBudget: '2250',
  currency: 'USD',
  timeline: '1_month',
  message: '',
  calculatedRoiSavings: '',
};

const ALLOWED_FILE_EXTENSIONS = ['pdf', 'doc', 'docx', 'png', 'jpg', 'jpeg'];
const ALLOWED_FILE_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'image/png',
  'image/jpeg',
]);

function phoneToIntl(phone: string): string {
  return phone.replace(/\D/g, '');
}

function isRoiEstimate(v: unknown): v is RoiEstimate {
  if (!v || typeof v !== 'object') return false;
  const e = v as Record<string, unknown>;
  return (
    typeof e.teamSize === 'number' &&
    typeof e.hoursPerWeek === 'number' &&
    typeof e.currency === 'string' &&
    typeof e.monthlyCostSaved === 'number' &&
    typeof e.annualCostSaved === 'number'
  );
}

function inputClass(hasError = false): string {
  return `w-full px-4 py-3 rounded-xl bg-[var(--color-bg)] border ${
    hasError
      ? 'border-red-400 focus:border-red-500'
      : 'border-[var(--color-border)] focus:border-cyan-500'
  } text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none transition-all shadow-xs`;
}

export function LeadForm({
  dict,
  locale = 'en',
  settings,
  contact,
  initialCurrency = 'USD',
  services = [],
}: LeadFormProps) {
  const serviceOptions =
    services.length > 0
      ? services.map((service) => ({
          value: service.slug,
          label: getLocalizedField(service.title_i18n, service.title, locale),
        }))
      : [
          { value: 'automation', label: 'n8n Workflow Automation' },
          { value: 'crm', label: 'Perfex CRM Custom Modules' },
          { value: 'web', label: 'Next.js 15 Web Applications' },
          { value: 'consulting', label: 'Systems & API Consulting' },
        ];

  const [values, setValues] = useState<FormValues>({
    ...EMPTY_VALUES,
    currency: initialCurrency,
    serviceInterest: serviceOptions[0]?.value ?? 'automation',
  });
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attachment, setAttachment] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState('');
  const [formStartTime, setFormStartTime] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consent, setConsent] = useState(false);
  const [hasRoiEstimate, setHasRoiEstimate] = useState(false);
  const [attribution, setAttribution] = useState<{
    referrer?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
  }>({});
  const fieldRefs = useRef<Record<string, HTMLElement | null>>({});
  const turnstileRef = useRef<TurnstileWidgetHandle>(null);

  useEffect(() => {
    setFormStartTime(Date.now());

    // Capture UTM parameters & Referrer on mount
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        setAttribution({
          referrer: document.referrer || undefined,
          utmSource: params.get('utm_source') || undefined,
          utmMedium: params.get('utm_medium') || undefined,
          utmCampaign: params.get('utm_campaign') || undefined,
        });
      } catch {}
    }

    const applyEstimate = (estimate: unknown) => {
      if (!isRoiEstimate(estimate)) return;
      const fmt = (n: number) => n.toLocaleString();
      const filled = dict.roi.prefill_template
        .replace('{team_size}', String(estimate.teamSize))
        .replace('{hours_per_week}', String(estimate.hoursPerWeek))
        .replace('{currency}', estimate.currency)
        .replace('{monthly_cost}', fmt(estimate.monthlyCostSaved))
        .replace('{annual_cost}', fmt(estimate.annualCostSaved));

      setValues((prev) => ({
        ...prev,
        currency: estimate.currency,
        message: filled,
        calculatedRoiSavings: String(estimate.annualCostSaved),
      }));
      setHasRoiEstimate(true);
    };

    // Check sessionStorage on initial load
    try {
      const raw = window.sessionStorage.getItem(ROI_SESSION_KEY);
      if (raw) {
        applyEstimate(JSON.parse(raw));
        window.sessionStorage.removeItem(ROI_SESSION_KEY);
      }
    } catch {}

    // Listen to real-time custom event when user clicks ROI CTA
    const handleRoiEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        applyEstimate(customEvent.detail);
      }
    };

    window.addEventListener('roi_estimate_ready', handleRoiEvent);
    return () => {
      window.removeEventListener('roi_estimate_ready', handleRoiEvent);
    };
  }, [dict.roi.prefill_template]);

  const update = (key: keyof FormValues, value: string) => {
    setValues((previous) => ({ ...previous, [key]: value }));
    setErrors((previous) => ({ ...previous, [key]: '' }));
  };

  const handleTurnstileToken = useCallback((token: string) => setTurnstileToken(token), []);
  const handleTurnstileError = useCallback(
    () =>
      setErrors((previous) => ({
        ...previous,
        turnstile: dict.forms.validation.turnstile_required,
      })),
    [dict.forms.validation.turnstile_required]
  );

  const validateStep = (targetStep: number): boolean => {
    const nextErrors: Record<string, string> = {};
    if (targetStep === 1) {
      if (!values.name.trim()) nextErrors.name = dict.forms.validation.required;
      if (!values.email.trim()) nextErrors.email = dict.forms.validation.required;
      else if (!/^\S+@\S+\.\S+$/.test(values.email))
        nextErrors.email = dict.forms.validation.email_invalid;
    }
    if (targetStep === 2) {
      if (!values.serviceInterest) nextErrors.serviceInterest = dict.forms.validation.required;
      if (!values.estimatedBudget) nextErrors.estimatedBudget = dict.forms.validation.required;
      if (!values.timeline) nextErrors.timeline = dict.forms.validation.required;
    }
    if (targetStep === 4 && !consent) nextErrors.consent = dict.forms.validation.required;
    setErrors(nextErrors);
    const first = Object.keys(nextErrors)[0];
    if (first) fieldRefs.current[first]?.focus();
    return Object.keys(nextErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(step)) setStep((current) => Math.min(4, current + 1));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (step < 4) {
      nextStep();
      return;
    }
    if (!validateStep(4)) return;
    if (process.env.NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY && !turnstileToken) {
      setErrors({ turnstile: dict.forms.validation.turnstile_required });
      return;
    }
    setIsSubmitting(true);
    setStatusMsg('');
    setStatusType(null);

    const payload = new FormData();
    payload.set('name', values.name);
    payload.set('email', values.email);
    payload.set('company', values.company);
    payload.set('phone', values.phone);
    payload.set('country', values.country);
    payload.set('service_interest', values.serviceInterest);
    payload.set('estimated_budget', values.estimatedBudget);
    payload.set('currency', values.currency);
    payload.set('timeline', values.timeline);
    payload.set('message', values.message);
    payload.set('calculated_roi_savings', values.calculatedRoiSavings);
    payload.set('source_page', typeof window !== 'undefined' ? window.location.pathname : '');
    payload.set('locale', locale);
    payload.set('consent', String(consent));
    payload.set('privacy_policy_version', '2026-08-13');
    payload.set('turnstile_token', turnstileToken);
    payload.set('honeypot', honeypot);
    payload.set('form_start_time', String(formStartTime));
    if (attachment) payload.set('attachment', attachment);
    if (attribution.referrer) payload.set('referrer', attribution.referrer);
    if (attribution.utmSource) payload.set('utm_source', attribution.utmSource);
    if (attribution.utmMedium) payload.set('utm_medium', attribution.utmMedium);
    if (attribution.utmCampaign) payload.set('utm_campaign', attribution.utmCampaign);

    try {
      const response = await fetch('/api/lead', { method: 'POST', body: payload });
      const data = (await response.json()) as {
        success?: boolean;
        error?: { message?: string } | string;
      };
      if (response.ok && data.success) {
        trackEvent('lead_submitted', { source_type: 'form', locale });
        setStatusType('success');
        setStatusMsg(dict.forms.states.success_body);
      } else {
        const message = typeof data.error === 'string' ? data.error : data.error?.message;
        setStatusType('error');
        setStatusMsg(message || dict.forms.states.error_body);
        turnstileRef.current?.reset();
      }
    } catch {
      setStatusType('error');
      setStatusMsg(dict.forms.states.error_body);
      turnstileRef.current?.reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactEmail = settings.contact_email;
  const whatsappHref = `https://wa.me/${phoneToIntl(settings.contact_phone)}`;

  const budgetOptions = [
    { value: '1000', label: dict.forms.budget_ranges.small, subtitle: '< $1,000 Starter Sprint' },
    { value: '2250', label: dict.forms.budget_ranges.medium, subtitle: '$1,000 - $3,500 Full System' },
    { value: '5000', label: dict.forms.budget_ranges.large, subtitle: '$5,000+ Enterprise Scale' },
  ];

  const timelineOptions = [
    { value: 'asap', label: dict.forms.timeline.asap, badge: '⚡ Priority' },
    { value: '1_month', label: dict.forms.timeline['1_month'], badge: 'Standard' },
    { value: '2_3_months', label: dict.forms.timeline['2_3_months'], badge: 'Roadmap' },
    { value: 'flexible', label: dict.forms.timeline.flexible, badge: 'Exploratory' },
  ];

  const stepsList = [
    { number: 1, key: 'contact', title: dict.forms.steps.contact },
    { number: 2, key: 'project', title: dict.forms.steps.project },
    { number: 3, key: 'message', title: dict.forms.steps.message },
    { number: 4, key: 'review', title: dict.forms.steps.review },
  ] as const;

  return (
    <section id="contact" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 right-1/4 w-[600px] h-[500px] glow glow--primary opacity-10" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 relative">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="kicker kicker--tertiary justify-center">{dict.sections.contact_kicker}</div>
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {contact?.title ?? dict.sections.contact_title}
          </h2>
          <p className="text-lead font-body text-[var(--color-text-muted)] max-w-2xl mx-auto">
            {contact?.body ?? dict.sections.contact_subtitle}
          </p>
        </div>

        {/* Top Direct Channel Cards (High-Authority Dispatch Bar) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto font-mono text-xs">
          {/* Email Direct Card */}
          <a
            href={`mailto:${contactEmail}`}
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between gap-3.5 hover:border-cyan-500/50 hover:bg-[var(--color-surface-raised)] hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 group-hover:scale-105 transition-all">
                <MailIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[var(--color-text-muted)] text-[11px] font-medium">{dict.forms.direct_email}</p>
                <p className="font-bold text-[var(--color-text)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                  {contactEmail}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-block px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[10px] font-bold border border-cyan-500/20">
              ⚡ &lt; 24h SLA
            </span>
          </a>

          {/* WhatsApp Direct Card */}
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick()}
            className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] flex items-center justify-between gap-3.5 hover:border-emerald-500/50 hover:bg-emerald-500/5 hover:shadow-lg transition-all duration-300 group"
          >
            <div className="flex items-center gap-3.5">
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 group-hover:scale-105 transition-all">
                <MessageCircleIcon className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[var(--color-text-muted)] text-[11px] font-medium">{dict.forms.direct_whatsapp}</p>
                <p className="font-bold text-[var(--color-text)] group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                  {settings.contact_phone}
                </p>
              </div>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold border border-emerald-500/20">
              <span className="status-dot status-dot--online" />
              Direct Line
            </span>
          </a>
        </div>

        {/* Form Container */}
        {statusType === 'success' ? (
          <div
            className="p-8 sm:p-12 rounded-3xl bg-[var(--color-surface)] border border-emerald-500/40 shadow-2xl max-w-3xl mx-auto text-center space-y-6 backdrop-blur-xl"
            role="status"
            aria-live="polite"
          >
            <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircleIcon className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-2xl font-display font-bold text-[var(--color-text)]">
              {dict.forms.states.success_title}
            </h3>
            <p className="text-[var(--color-text-muted)] max-w-xl mx-auto leading-relaxed">
              {statusMsg}
            </p>
            {settings.sla_notice && (
              <p className="text-xs font-mono text-[var(--color-text-muted)] bg-[var(--color-bg)] p-3 rounded-xl border border-[var(--color-border)] inline-block">
                {settings.sla_notice}
              </p>
            )}
            <div className="pt-2">
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick()}
                className="btn btn-secondary text-xs px-6 py-3 rounded-xl font-semibold inline-flex items-center gap-2 cursor-pointer"
              >
                <MessageCircleIcon className="w-4 h-4 text-emerald-500" />
                <span>{dict.forms.states.whatsapp_fallback}</span>
              </a>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-2xl space-y-8 max-w-3xl mx-auto backdrop-blur-xl"
          >
            <input
              type="text"
              name="website_url"
              value={honeypot}
              onChange={(event) => setHoneypot(event.target.value)}
              className="absolute -left-[9999px]"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            {/* Numbered Stepper Header */}
            <div className="grid grid-cols-4 gap-2 sm:gap-3" aria-label={dict.forms.steps_edit}>
              {stepsList.map(({ number, key, title }) => {
                const isActive = step === number;
                const isCompleted = step > number;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => number < step && setStep(number)}
                    disabled={number > step}
                    className={`text-start font-mono text-[11px] sm:text-xs uppercase tracking-wider transition-all p-2 sm:p-2.5 rounded-xl sm:rounded-2xl border flex items-center justify-center sm:justify-start gap-2 sm:gap-2.5 ${
                      isActive
                        ? 'border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs shadow-cyan-500/10'
                        : isCompleted
                        ? 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)] hover:border-cyan-500/30 hover:bg-cyan-500/5 cursor-pointer'
                        : 'border-transparent text-[var(--color-text-muted)] opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-lg sm:rounded-xl flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-all ${
                        isActive
                          ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white shadow-xs shadow-cyan-500/30 scale-105'
                          : isCompleted
                          ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                          : 'bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-muted)]'
                      }`}
                    >
                      {isCompleted ? '✓' : number}
                    </span>
                    <span className="truncate hidden sm:inline">{title}</span>
                  </button>
                );
              })}
            </div>

            {/* Step 1: Contact Info */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Field
                    id="lead-name"
                    label={dict.forms.fields.name}
                    value={values.name}
                    required
                    error={errors.name}
                    placeholder={dict.forms.fields.name_placeholder}
                    inputRef={(element) => {
                      fieldRefs.current.name = element;
                    }}
                    onChange={(value) => update('name', value)}
                  />
                  <Field
                    id="lead-email"
                    type="email"
                    label={dict.forms.fields.email}
                    value={values.email}
                    required
                    error={errors.email}
                    placeholder={dict.forms.fields.email_placeholder}
                    inputRef={(element) => {
                      fieldRefs.current.email = element;
                    }}
                    onChange={(value) => update('email', value)}
                  />
                  <Field
                    id="lead-company"
                    label={dict.forms.fields.company}
                    value={values.company}
                    placeholder={dict.forms.fields.company_placeholder}
                    onChange={(value) => update('company', value)}
                  />
                  <Field
                    id="lead-phone"
                    label={dict.forms.fields.phone}
                    value={values.phone}
                    placeholder={dict.forms.fields.phone_placeholder}
                    onChange={(value) => update('phone', value)}
                  />
                </div>
                <Field
                  id="lead-country"
                  label={dict.forms.fields.country}
                  value={values.country}
                  placeholder={dict.forms.fields.country_placeholder}
                  onChange={(value) => update('country', value)}
                />
              </div>
            )}

            {/* Step 2: Project Scope Configurator (Interactive Choice Cards) */}
            {step === 2 && (
              <div className="space-y-7">
                {/* Service Choice Pills */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-mono text-[var(--color-text)] font-semibold">
                    {dict.forms.fields.service} *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {serviceOptions.map((option) => {
                      const isSelected = values.serviceInterest === option.value;
                      return (
                        <button
                          key={option.value}
                          type="button"
                          onClick={() => update('serviceInterest', option.value)}
                          className={`p-3.5 rounded-xl border text-start font-mono text-xs font-semibold transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 shadow-xs'
                              : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)]'
                          }`}
                        >
                          <span className="truncate">{option.label}</span>
                          {isSelected && <CheckIcon className="w-4 h-4 text-cyan-600 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Estimated Budget Cards */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <label className="text-[var(--color-text)] font-semibold">
                      {dict.forms.fields.budget} *
                    </label>
                    <div className="flex items-center gap-1">
                      {SUPPORTED_CURRENCIES.map((curr) => (
                        <button
                          key={curr}
                          type="button"
                          onClick={() => update('currency', curr)}
                          className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer border ${
                            values.currency === curr
                              ? 'bg-[var(--color-accent-primary)] text-white border-transparent'
                              : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border-[var(--color-border)]'
                          }`}
                        >
                          {curr}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {budgetOptions.map((budget) => {
                      const isSelected = values.estimatedBudget === budget.value;
                      return (
                        <button
                          key={budget.value}
                          type="button"
                          onClick={() => update('estimatedBudget', budget.value)}
                          className={`p-4 rounded-2xl border text-start transition-all cursor-pointer space-y-1 ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500/10 text-[var(--color-text)] shadow-xs'
                              : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'
                          }`}
                        >
                          <p className="font-mono text-xs font-bold text-[var(--color-text)]">
                            {budget.label}
                          </p>
                          <p className="text-[11px] font-mono text-[var(--color-text-muted)]">
                            {budget.subtitle}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Timeline Selection Pills */}
                <div className="space-y-2.5">
                  <label className="block text-xs font-mono text-[var(--color-text)] font-semibold">
                    {dict.forms.fields.timeline} *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {timelineOptions.map((t) => {
                      const isSelected = values.timeline === t.value;
                      return (
                        <button
                          key={t.value}
                          type="button"
                          onClick={() => update('timeline', t.value)}
                          className={`p-3 rounded-xl border text-center font-mono text-xs transition-all cursor-pointer space-y-0.5 ${
                            isSelected
                              ? 'border-cyan-500 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 font-bold shadow-xs'
                              : 'border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-text-muted)] hover:border-[var(--color-border-strong)]'
                          }`}
                        >
                          <p className="font-semibold truncate">{t.label}</p>
                          <span className="text-[10px] opacity-75">{t.badge}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Brief, Specs & File Attachment */}
            {step === 3 && (
              <div className="space-y-6">
                {/* ROI Attachment Badge if available */}
                {hasRoiEstimate && (
                  <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between gap-3 text-xs font-mono">
                    <div className="flex items-center gap-2 text-cyan-700 dark:text-cyan-300">
                      <BoltIcon className="w-4 h-4 text-cyan-500 shrink-0" />
                      <span>
                        <strong>ROI Estimate Attached:</strong> Parameters pre-filled in project brief.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setHasRoiEstimate(false)}
                      className="text-[11px] text-[var(--color-text-muted)] underline hover:text-[var(--color-text)]"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div>
                  <label
                    htmlFor="lead-message"
                    className="block text-xs font-mono text-[var(--color-text)] mb-2 font-semibold"
                  >
                    {dict.forms.fields.message}
                  </label>
                  <textarea
                    id="lead-message"
                    rows={6}
                    value={values.message}
                    onChange={(event) => update('message', event.target.value)}
                    className={inputClass()}
                    placeholder={dict.forms.fields.message_placeholder}
                  />
                </div>

                <FileDropzone dict={dict} file={attachment} onFile={setAttachment} />
              </div>
            )}

            {/* Step 4: Review & Security Consent */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-base font-display font-bold text-[var(--color-text)]">
                  {dict.forms.review.title}
                </h3>
                <dl className="divide-y divide-[var(--color-border)] border border-[var(--color-border)] rounded-2xl overflow-hidden bg-[var(--color-bg)]/60">
                  <ReviewRow
                    label={dict.forms.review.contact_label}
                    value={`${values.name} · ${values.email}${values.company ? ` · ${values.company}` : ''}${values.country ? ` (${values.country})` : ''}`}
                    onEdit={() => setStep(1)}
                    editLabel={dict.forms.review.edit_step}
                  />
                  <ReviewRow
                    label={dict.forms.review.project_label}
                    value={`${values.serviceInterest} · Budget: ${values.currency} ${values.estimatedBudget} · Timeline: ${values.timeline}`}
                    onEdit={() => setStep(2)}
                    editLabel={dict.forms.review.edit_step}
                  />
                  <ReviewRow
                    label={dict.forms.review.message_label}
                    value={values.message || '—'}
                    onEdit={() => setStep(3)}
                    editLabel={dict.forms.review.edit_step}
                  />
                  <ReviewRow
                    label={dict.forms.review.attachment_label}
                    value={attachment?.name || '—'}
                    onEdit={() => setStep(3)}
                    editLabel={dict.forms.review.edit_step}
                  />
                </dl>

                <label className="flex items-start gap-3 text-xs text-[var(--color-text-muted)] cursor-pointer">
                  <input
                    ref={(element) => {
                      fieldRefs.current.consent = element;
                    }}
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => {
                      setConsent(event.target.checked);
                      setErrors((previous) => ({ ...previous, consent: '' }));
                    }}
                    className="mt-0.5 accent-cyan-500 w-4 h-4 rounded cursor-pointer"
                  />
                  <span>
                    {dict.forms.review.consent}{' '}
                    <a href={`/${locale}/privacy`} className="text-cyan-600 dark:text-cyan-400 underline font-semibold">
                      {dict.footer.privacy_link}
                    </a>
                  </span>
                </label>
                {errors.consent && (
                  <p role="alert" className="text-xs text-red-400 font-mono">
                    {errors.consent}
                  </p>
                )}
              </div>
            )}

            <TurnstileWidget ref={turnstileRef} onToken={handleTurnstileToken} onError={handleTurnstileError} />
            {errors.turnstile && (
              <p role="alert" className="text-xs text-red-400 font-mono">
                {errors.turnstile}
              </p>
            )}
            {statusType === 'error' && (
              <div
                role="alert"
                className="p-4 rounded-xl border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-mono"
              >
                {statusMsg}
              </div>
            )}

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-4 pt-2">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep((current) => current - 1)}
                  className="btn btn-secondary text-xs px-6 py-3 rounded-xl font-semibold flex-1 cursor-pointer"
                >
                  {dict.common.back}
                </button>
              )}
              {step < 4 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="btn btn-primary text-white text-xs px-6 py-3 rounded-xl font-semibold flex-1 flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>{dict.booking.continue}</span>
                  <ArrowRightIcon className="w-4 h-4 btn-icon-hover rtl:rotate-180" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary text-white text-xs px-6 py-3 rounded-xl font-semibold flex-1 flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <BoltIcon className="w-4 h-4 animate-spin" />
                      <span>{dict.forms.states.sending}</span>
                    </>
                  ) : (
                    <>
                      <SendIcon className="w-4 h-4" />
                      <span>{dict.forms.review.confirm_submit}</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  error,
  inputRef,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  type?: string;
  error?: string;
  inputRef?: (element: HTMLInputElement | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-mono text-[var(--color-text)] font-semibold">
        {label}
        {required ? ' *' : ''}
      </label>
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={inputClass(Boolean(error))}
        placeholder={placeholder}
        required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-400 font-mono">
          {error}
        </p>
      )}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  onEdit,
  editLabel,
}: {
  label: string;
  value: string;
  onEdit: () => void;
  editLabel: string;
}) {
  return (
    <div className="p-4 flex items-start justify-between gap-4">
      <div className="space-y-1">
        <dt className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] font-semibold">
          {label}
        </dt>
        <dd className="text-xs font-mono text-[var(--color-text)] whitespace-pre-wrap break-words">
          {value}
        </dd>
      </div>
      <button
        type="button"
        onClick={onEdit}
        className="text-xs font-mono text-cyan-600 dark:text-cyan-400 underline shrink-0 cursor-pointer font-medium"
      >
        {editLabel}
      </button>
    </div>
  );
}

function FileDropzone({
  dict,
  file,
  onFile,
}: {
  dict: Dictionary;
  file: File | null;
  onFile: (file: File | null) => void;
}) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const choose = (candidate: File | null) => {
    if (!candidate) return;
    const extension = candidate.name.toLowerCase().split('.').pop() ?? '';
    if (candidate.size > 5 * 1024 * 1024) {
      setError(dict.forms.validation.file_too_large);
      onFile(null);
      return;
    }
    if (
      (candidate.type && !ALLOWED_FILE_TYPES.has(candidate.type)) ||
      !ALLOWED_FILE_EXTENSIONS.includes(extension)
    ) {
      setError(dict.forms.validation.file_type_invalid);
      onFile(null);
      return;
    }
    setError('');
    onFile(candidate);
    trackEvent('file_attached', {
      name: candidate.name,
      size_kb: Math.round(candidate.size / 1024),
    });
  };

  return (
    <div className="space-y-2">
      <span className="block text-xs font-mono text-[var(--color-text)] font-semibold">
        {dict.forms.fields.attachment}
      </span>
      {file ? (
        <div className="flex items-center justify-between gap-3 p-4 rounded-xl bg-[var(--color-bg)] border border-cyan-500/30 text-xs font-mono">
          <div className="flex items-center gap-2 truncate">
            <DocumentIcon className="w-4 h-4 text-cyan-500 shrink-0" />
            <span className="truncate text-[var(--color-text)]">
              {file.name} · {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
          <button
            type="button"
            onClick={() => onFile(null)}
            className="text-red-400 underline shrink-0 cursor-pointer font-semibold"
          >
            {dict.forms.file_remove}
          </button>
        </div>
      ) : (
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click();
          }}
          onDragOver={(event) => {
            event.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setDragging(false);
            choose(event.dataTransfer.files[0] ?? null);
          }}
          className={`p-8 text-center rounded-2xl border-2 border-dashed cursor-pointer transition-all ${
            dragging
              ? 'border-cyan-500 bg-cyan-500/10'
              : 'border-[var(--color-border)] hover:border-cyan-500/50 bg-[var(--color-bg)]/50'
          }`}
        >
          <DocumentIcon className="w-6 h-6 text-cyan-600 dark:text-cyan-400 mx-auto mb-2 opacity-80" />
          <p className="text-xs font-mono font-semibold text-[var(--color-text)]">
            {dict.forms.fields.attachment}
          </p>
          <p className="mt-1 text-[11px] font-mono text-[var(--color-text-muted)]">
            {dict.forms.file_help} (PDF, DOCX, PNG, JPG max 5MB)
          </p>
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
            onChange={(event) => choose(event.target.files?.[0] ?? null)}
          />
        </div>
      )}
      {error && (
        <p role="alert" className="text-xs text-red-400 font-mono">
          {error}
        </p>
      )}
    </div>
  );
}
