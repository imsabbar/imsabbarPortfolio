'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import { BoltIcon, ArrowRightIcon, ClockIcon, TrendingUpIcon } from '@/components/icons';
import { Currency, currencySymbols, isCurrency, formatPrice } from '@/lib/currency';
import { trackEvent } from '@/lib/analytics';

/**
 * P3 — The contact form reads this from sessionStorage on mount and clears
 * the value. Kept in a single module-level constant so the LeadForm can
 * import the same key.
 */
export const ROI_SESSION_KEY = 'imsabbar.roi.estimate';

export interface RoiEstimate {
  teamSize: number;
  hoursPerWeek: number;
  hourlyRate: number;
  currency: Currency;
  annualHoursSaved: number;
  monthlyCostSaved: number;
  annualCostSaved: number;
}

interface RoiCalculatorProps {
  dict: Dictionary;
  /** P3.4: server-resolved currency from cookies. */
  initialCurrency?: Currency;
}

const SUPPORTED_CURRENCIES: Currency[] = ['MAD', 'EUR', 'USD', 'AED', 'GBP'];

/** Default hourly rate per currency — a sane starting point for the slider. */
const DEFAULT_HOURLY_RATE: Record<Currency, number> = {
  USD: 25,
  EUR: 22,
  GBP: 20,
  AED: 90,
  MAD: 200,
};

const TEAM_PRESETS = [
  { label: 'Small (3)', value: 3 },
  { label: 'Growth (10)', value: 10 },
  { label: 'Scale (25)', value: 25 },
];

export function RoiCalculator({ dict, initialCurrency = 'USD' }: RoiCalculatorProps) {
  const [currency, setCurrency] = useState<Currency>(initialCurrency);
  const [teamSize, setTeamSize] = useState<number>(5);
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(10);
  const [avgHourlyRate, setAvgHourlyRate] = useState<number>(DEFAULT_HOURLY_RATE[initialCurrency]);

  // Re-anchor the rate slider when the initial (server-resolved) currency changes
  useEffect(() => {
    setCurrency(initialCurrency);
    setAvgHourlyRate(DEFAULT_HOURLY_RATE[initialCurrency]);
  }, [initialCurrency]);

  const weeklyHoursLost = teamSize * hoursPerWeek;
  const annualHoursLost = weeklyHoursLost * 52;
  const annualHoursSaved = Math.round(annualHoursLost * 0.85);
  // 85% automation rate, 4.33 weeks/month
  const monthlyCostSaved = Math.round(weeklyHoursLost * 4.33 * avgHourlyRate * 0.85);
  const annualCostSaved = monthlyCostSaved * 12;
  const fteEquivalent = (annualHoursSaved / 1920).toFixed(1);

  const handleCurrencyChange = (curr: Currency) => {
    setCurrency(curr);
    setAvgHourlyRate((prev) =>
      prev === DEFAULT_HOURLY_RATE[currency] ? DEFAULT_HOURLY_RATE[curr] : prev
    );
  };

  const handleCtaClick = () => {
    if (typeof window === 'undefined') return;
    const estimate: RoiEstimate = {
      teamSize,
      hoursPerWeek,
      hourlyRate: avgHourlyRate,
      currency,
      annualHoursSaved,
      monthlyCostSaved,
      annualCostSaved,
    };
    try {
      window.sessionStorage.setItem(ROI_SESSION_KEY, JSON.stringify(estimate));
      trackEvent('roi_calculated', { currency, annual_savings: annualCostSaved });
    } catch {
      // sessionStorage can be disabled; silently skip pre-fill.
    }
  };

  const hourlySymbol = isCurrency(currency) ? currencySymbols[currency] : '$';

  return (
    <section id="roi" className="py-24 lg:py-32 relative overflow-hidden bg-[var(--color-surface)]/20">
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] glow glow--tertiary opacity-10" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14 relative">
        {/* Section Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="kicker kicker--tertiary justify-center">
            <BoltIcon className="w-3.5 h-3.5" />
            {dict.sections.roi_kicker}
          </div>
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {dict.sections.roi_title}
          </h2>
          <p className="text-lead font-body text-[var(--color-text-muted)]">
            {dict.sections.roi_subtitle}
          </p>
        </div>

        {/* 2-Column Calculator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch max-w-5xl mx-auto">
          {/* Left Column: Interactive Parameters & Slider Controls */}
          <div className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-7 shadow-xl backdrop-blur-xl flex flex-col justify-between">
            {/* Currency Pill Selector */}
            <div className="space-y-2.5 pb-4 border-b border-[var(--color-border)]">
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-[var(--color-text-muted)] font-medium">{dict.currency.label}</span>
                <span className="text-[11px] font-bold text-cyan-600 dark:text-cyan-400">Active Currency</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                {SUPPORTED_CURRENCIES.map((curr) => {
                  const isActive = currency === curr;
                  return (
                    <button
                      key={curr}
                      type="button"
                      onClick={() => handleCurrencyChange(curr)}
                      className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-all cursor-pointer border ${
                        isActive
                          ? 'bg-[var(--color-accent-primary)] text-white border-transparent shadow-sm'
                          : 'bg-[var(--color-surface-raised)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)]'
                      }`}
                    >
                      {curr}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Slider 1: Team Size + Quick Presets */}
            <div className="space-y-3">
              <CustomSlider
                label={dict.roi.team_size}
                value={teamSize}
                min={1}
                max={50}
                unit={dict.roi.unit_members}
                onChange={setTeamSize}
              />
              <div className="flex items-center gap-2 pt-0.5">
                <span className="text-[10px] font-mono text-[var(--color-text-muted)]">Quick Presets:</span>
                <div className="flex items-center gap-1.5">
                  {TEAM_PRESETS.map((preset) => (
                    <button
                      key={preset.value}
                      type="button"
                      onClick={() => setTeamSize(preset.value)}
                      className={`px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium transition-all cursor-pointer border ${
                        teamSize === preset.value
                          ? 'bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30'
                          : 'bg-[var(--color-bg)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text)]'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Slider 2: Manual Hours */}
            <CustomSlider
              label={dict.roi.hours_per_week}
              value={hoursPerWeek}
              min={2}
              max={30}
              unit={dict.roi.unit_hrs_week}
              onChange={setHoursPerWeek}
            />

            {/* Slider 3: Hourly Rate */}
            <CustomSlider
              label={dict.roi.hourly_rate}
              value={avgHourlyRate}
              min={5}
              max={currency === 'MAD' ? 800 : 200}
              step={currency === 'MAD' ? 10 : 5}
              prefix={hourlySymbol}
              unit={dict.roi.unit_per_hour}
              onChange={setAvgHourlyRate}
            />
          </div>

          {/* Right Column: Executive Financial Return Terminal */}
          <motion.div
            key={currency}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 p-6 sm:p-8 rounded-3xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] shadow-xl space-y-6 flex flex-col justify-between relative overflow-hidden backdrop-blur-xl group"
          >
            {/* Top Efficiency Header & Beacon */}
            <div className="space-y-3 border-b border-[var(--color-border)] pb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="status-dot status-dot--online" />
                  <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                    {dict.roi.money_saved}
                  </span>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30">
                  85% Efficiency
                </span>
              </div>

              {/* Big Monthly Number */}
              <div className="font-mono text-3xl sm:text-4xl lg:text-5xl font-black text-[var(--color-text)] tabular-nums tracking-tight" dir="ltr">
                <span className="text-cyan-600 dark:text-cyan-400">
                  {formatPrice(monthlyCostSaved, currency, 'en')}
                </span>
                <span className="text-xs font-mono font-normal text-[var(--color-text-muted)] ms-2">
                  {dict.roi.per_month}
                </span>
              </div>

              {/* Payback Speed Badge */}
              <div className="inline-flex items-center gap-2 text-xs font-mono text-cyan-700 dark:text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-xl border border-cyan-500/20">
                <BoltIcon className="w-3.5 h-3.5 text-cyan-500 shrink-0" />
                <span><strong>Estimated Payback:</strong> &lt; 30 Days</span>
              </div>
            </div>

            {/* 2 Telemetry Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              {/* Hours Recovered */}
              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <ClockIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span>{dict.roi.hours_saved}</span>
                </div>
                <p className="font-bold text-[var(--color-text)] text-sm sm:text-base tabular-nums" dir="ltr">
                  ~{annualHoursSaved.toLocaleString('en')} {dict.roi.unit_hrs_year}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  ≈ {fteEquivalent} Full-Time FTEs
                </p>
              </div>

              {/* Annual Financial ROI */}
              <div className="p-4 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-1.5 shadow-xs">
                <div className="flex items-center gap-1.5 text-[var(--color-text-muted)]">
                  <TrendingUpIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{dict.roi.annual_roi}</span>
                </div>
                <p className="font-bold text-emerald-600 dark:text-emerald-400 text-sm sm:text-base tabular-nums" dir="ltr">
                  {formatPrice(annualCostSaved, currency, 'en')}
                </p>
                <p className="text-[10px] text-[var(--color-text-muted)]">
                  Cumulative Annual Return
                </p>
              </div>
            </div>

            {/* Primary Action Button */}
            <div className="space-y-2 pt-2">
              <a
                href="#contact"
                onClick={handleCtaClick}
                className="btn btn-primary text-white text-xs w-full py-3 h-auto flex items-center justify-center gap-2 shadow-md"
              >
                <span>{dict.roi.cta_send}</span>
                <ArrowRightIcon className="w-4 h-4 btn-icon-hover rtl:rotate-180" />
              </a>

              <p className="text-[10px] font-mono text-[var(--color-text-muted)] text-center">
                {dict.roi.disclaimer}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

interface CustomSliderProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  prefix?: string;
  onChange: (value: number) => void;
}

function CustomSlider({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  prefix = '',
  onChange,
}: CustomSliderProps) {
  const percentage = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[var(--color-text)] font-semibold">{label}</span>
        <span
          className="font-bold text-cyan-800 dark:text-cyan-300 tabular-nums px-2.5 py-0.5 rounded-xl bg-cyan-50 border border-cyan-200 dark:bg-cyan-950/60 dark:border-cyan-500/30 shadow-xs"
          dir="ltr"
        >
          {prefix} {value.toLocaleString('en')} {unit}
        </span>
      </div>

      <div className="relative flex items-center">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          style={{
            background: `linear-gradient(to right, #06B6D4 0%, #06B6D4 ${percentage}%, var(--color-border) ${percentage}%, var(--color-border) 100%)`,
          }}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-[#06B6D4] transition-all"
        />
      </div>
    </div>
  );
}
