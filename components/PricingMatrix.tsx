'use client';

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { Plan } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { getLocalizedField, getLocalizedList } from '@/lib/db/helpers';
import { Currency, SUPPORTED_CURRENCIES, formatPrice } from '@/lib/currency';
import { DocumentIcon, ClockIcon, CheckIcon, SparklesIcon } from '@/components/icons';
import { trackEvent } from '@/lib/analytics';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface PricingMatrixProps {
  dict: Dictionary;
  locale?: Locale;
  /** P3.4: server-resolved currency from cookies. */
  initialCurrency?: Currency;
  onOpenPdfEstimate?: (planId: number, currency: Currency) => void;
  /** Phase 2: DB-driven plans. */
  plans?: Plan[];
}

function priceFor(plan: Plan, currency: Currency): number {
  switch (currency) {
    case 'MAD': return plan.price_mad;
    case 'EUR': return plan.price_eur;
    case 'USD': return plan.price_usd;
    case 'GBP': return plan.price_gbp;
    case 'AED': return plan.price_aed;
  }
}

export function PricingMatrix({
  dict,
  locale = 'en',
  initialCurrency = 'USD',
  onOpenPdfEstimate,
  plans = [],
}: PricingMatrixProps) {
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(initialCurrency);
  const viewedPlanIds = useRef(new Set<number>());

  // PRD §6.3: hide section if no plans are configured.
  if (plans.length === 0) return null;

  const handleCurrencyChange = (curr: Currency) => {
    setSelectedCurrency(curr);
    document.cookie = `currency_preference=${curr}; path=/; max-age=${60 * 60 * 24 * 30}`;
    trackEvent('currency_changed', { currency: curr });
  };

  const handlePlanView = (planId: number) => {
    if (viewedPlanIds.current.has(planId)) return;
    viewedPlanIds.current.add(planId);
    trackEvent('plan_view', { plan_id: planId, currency: selectedCurrency });
  };

  return (
    <section id="pricing" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 right-[-5%] w-[500px] h-[500px] glow glow--primary opacity-15" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14 relative">
        {/* Header & currency switcher */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="kicker kicker--tertiary">{dict.sections.pricing_kicker}</div>
            <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
              {dict.sections.pricing_title}
            </h2>
            <p className="text-lead font-body text-[var(--color-text-muted)] max-w-2xl">
              {dict.sections.pricing_subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {onOpenPdfEstimate && (
              <button
                type="button"
                onClick={() => onOpenPdfEstimate(plans.find((plan) => plan.is_popular)?.id ?? plans[0].id, selectedCurrency)}
                className="btn btn-secondary btn-sm"
              >
                <DocumentIcon className="w-3.5 h-3.5" />
                {dict.pricing.pdf_proposal}
              </button>
            )}

            {/* Currency switcher */}
            <div className="flex items-center gap-1 p-1 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono relative backdrop-blur-md">
              {SUPPORTED_CURRENCIES.map((curr) => {
                const isSelected = selectedCurrency === curr;
                return (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => handleCurrencyChange(curr)}
                    aria-pressed={isSelected}
                    className={`relative px-3 py-1.5 rounded-xl transition-colors z-10 ${
                      isSelected ? 'text-white font-bold' : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                    }`}
                  >
                    {isSelected && (
                      <motion.div
                        layoutId="activeCurrencyPill"
                        className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-xl -z-10 shadow-[0_0_12px_rgba(6,182,212,0.4)]"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    {curr}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {plans.map((plan) => {
            const price = priceFor(plan, selectedCurrency);
            const title = getLocalizedField(plan.title_i18n, plan.title, locale);
            const badge = plan.badge ? getLocalizedField(plan.badge_i18n, plan.badge, locale) : '';
            const turnaround = getLocalizedField(plan.turnaround_i18n, plan.turnaround, locale);
            const features = getLocalizedList(plan.features_json, locale);

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onViewportEnter={() => handlePlanView(plan.id)}
                className="flex"
              >
                <SpotlightCard
                  spotlightColor={plan.is_popular ? 'rgba(6, 182, 212, 0.20)' : 'rgba(255, 255, 255, 0.05)'}
                  className={`p-7 sm:p-9 rounded-3xl flex flex-col justify-between space-y-7 relative w-full ${
                    plan.is_popular
                      ? 'border-cyan-400/60 shadow-[0_0_35px_rgba(6,182,212,0.22)] bg-gradient-to-b from-[var(--color-surface)] to-[var(--color-surface-raised)]/90'
                      : 'border-[var(--color-border)]'
                  }`}
                >
                  {plan.is_popular && badge && (
                    <span className="absolute -top-3.5 left-7 px-3.5 py-1 rounded-full bg-gradient-to-r from-cyan-600 to-cyan-700 text-white text-[10px] font-mono font-bold tracking-wider uppercase shadow-md">
                      {badge}
                    </span>
                  )}

                  <div className="space-y-5">
                    <h3 className="font-display font-bold text-2xl text-[var(--color-text)]">{title}</h3>
                    <div className="font-mono" dir="ltr">
                      <span className="text-3xl sm:text-4xl font-extrabold text-[var(--color-text)] tabular-nums tracking-tight">
                        {formatPrice(price, selectedCurrency, locale)}
                      </span>
                      <span className="text-xs text-[var(--color-text-muted)] ms-1.5">{dict.pricing.per_project}</span>
                    </div>

                    <div className="text-xs font-mono text-[var(--color-text-muted)] border-t border-b border-[var(--color-border)] py-2.5 flex items-center gap-2">
                      <ClockIcon className="w-4 h-4 text-cyan-400" />
                      <span>{dict.pricing.turnaround}: <strong className="text-[var(--color-text)]">{turnaround}</strong></span>
                    </div>

                    <ul className="space-y-3 text-xs font-body text-[var(--color-text-muted)]">
                      {features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2.5 group/item">
                          <CheckIcon className="w-4 h-4 text-[var(--color-accent-tertiary)] shrink-0 mt-0.5" />
                          <span className="leading-relaxed group-hover/item:text-[var(--color-text)] transition-colors">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <a
                    href="#contact"
                    className={`btn w-full ${plan.is_popular ? 'btn-primary text-white shadow-md' : 'btn-secondary'}`}
                  >
                    <span>{dict.pricing.select_package}</span>
                    <span className="btn-icon-hover inline-block">→</span>
                  </a>
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs font-mono text-[var(--color-text-muted)]">
          {dict.currency.note}
        </p>
      </div>
    </section>
  );
}
