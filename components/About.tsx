'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useInView, animate } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { AboutContent } from '@/types/portfolio';
import { Reveal } from '@/motion/Reveal';
import { SpotlightCard } from '@/components/ui/SpotlightCard';
import {
  GlobeIcon,
  BoltIcon,
  BriefcaseIcon,
  TrendingUpIcon,
  DatabaseIcon,
  ClockIcon,
  RocketIcon,
  ShieldCheckIcon,
} from '@/components/icons';

interface AboutStatsValues {
  years: string;
  clients: string;
  projects: string;
  reliability?: string;
}

interface AboutProps {
  dict: Dictionary;
  /** Phase 2: DB-driven about content (labels). */
  about: AboutContent;
  /** Phase 2: stat *values* come from settings (admin-managed). */
  statsValues: AboutStatsValues;
}

function getPrincipleIcon(text: string, index: number) {
  const t = text.toLowerCase();
  if (t.includes('web') || t.includes('stack') || t.includes('frontend')) {
    return {
      Icon: GlobeIcon,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
    };
  }
  if (t.includes('automation') || t.includes('workflow') || t.includes('pipeline')) {
    return {
      Icon: BoltIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
    };
  }
  if (t.includes('business') || t.includes('solution') || t.includes('crm') || t.includes('custom')) {
    return {
      Icon: BriefcaseIcon,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
    };
  }
  if (t.includes('data') || t.includes('insight') || t.includes('scraping')) {
    return {
      Icon: TrendingUpIcon,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10 dark:bg-sky-500/20',
    };
  }
  const defaults = [
    { Icon: GlobeIcon, color: 'text-cyan-600 dark:text-cyan-400', bg: 'bg-cyan-500/10' },
    { Icon: BoltIcon, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-500/10' },
    { Icon: BriefcaseIcon, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-500/10' },
    { Icon: DatabaseIcon, color: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-500/10' },
  ];
  return defaults[index % defaults.length];
}

function getStatIcon(index: number) {
  const statIcons = [
    {
      Icon: ClockIcon,
      color: 'text-cyan-600 dark:text-cyan-400',
      bg: 'bg-cyan-500/10 dark:bg-cyan-500/20',
      border: 'border-cyan-500/20',
    },
    {
      Icon: BriefcaseIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bg: 'bg-purple-500/10 dark:bg-purple-500/20',
      border: 'border-purple-500/20',
    },
    {
      Icon: RocketIcon,
      color: 'text-emerald-600 dark:text-emerald-400',
      bg: 'bg-emerald-500/10 dark:bg-emerald-500/20',
      border: 'border-emerald-500/20',
    },
    {
      Icon: ShieldCheckIcon,
      color: 'text-sky-600 dark:text-sky-400',
      bg: 'bg-sky-500/10 dark:bg-sky-500/20',
      border: 'border-sky-500/20',
    },
  ];
  return statIcons[index % statIcons.length];
}

/**
 * Animated number counter that counts up smoothly from 0 when scrolled into view.
 * Supports integers (e.g. "12+", "200+") and floating-point percentages (e.g. "99.8%").
 */
function AnimatedStatNumber({ rawValue }: { rawValue: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [displayValue, setDisplayValue] = useState('0');

  useEffect(() => {
    if (!isInView) return;

    // Match numeric digits (int or float) and any trailing suffix e.g. "99.8%" or "12+"
    const match = rawValue.match(/^([\d.]+)(.*)$/);
    if (!match) {
      setDisplayValue(rawValue);
      return;
    }

    const targetNum = parseFloat(match[1]);
    const suffix = match[2] || '';
    const isFloat = match[1].includes('.');

    const controls = animate(0, targetNum, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        const formatted = isFloat ? latest.toFixed(1) : Math.round(latest).toString();
        setDisplayValue(`${formatted}${suffix}`);
      },
    });

    return () => controls.stop();
  }, [isInView, rawValue]);

  return (
    <span ref={ref} className="tabular-nums" dir="ltr">
      {displayValue}
    </span>
  );
}

export function About({ dict, about, statsValues }: AboutProps) {
  const stats = [
    { value: statsValues.years, label: about.stats_years_label },
    { value: statsValues.clients, label: about.stats_clients_label },
    { value: statsValues.projects, label: about.stats_projects_label },
    {
      value: statsValues.reliability ?? '99.8%',
      label: about.stats_reliability_label ?? 'System Reliability',
    },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 relative overflow-hidden bg-[var(--color-surface)]/20">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 right-[-10%] w-[500px] h-[500px] glow glow--secondary opacity-15" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16 relative">
        {/* Top Grid: Copy on Left (Col 5) + Extra-Wide Studio Portrait on Right (Col 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Section Header, Bio Copy & 4 Engineering Principle Cards */}
          <div className="lg:col-span-5 space-y-6 order-2 lg:order-1">
            <div className="space-y-3">
              <div className="kicker kicker--tertiary">{dict.sections.about_kicker}</div>
              <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
                {dict.sections.about_title}
              </h2>
            </div>

            <p className="text-body-copy font-body text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
              {about.body}
            </p>

            {/* 4 Iconic Engineering Principle Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {about.principles.map((principle, i) => {
                const { Icon, color, bg } = getPrincipleIcon(principle, i);
                return (
                  <div
                    key={i}
                    className="p-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-[var(--color-surface-raised)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-3 group shadow-xs"
                  >
                    <div className={`w-9 h-9 rounded-xl ${bg} ${color} flex items-center justify-center shrink-0 border border-[var(--color-border)] group-hover:scale-105 transition-transform`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-mono font-bold text-[var(--color-text)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors truncate">
                      {principle}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Extra-Wide Grand Studio Portrait Card (Col 7, Cinematic 16:9 Ratio) */}
          <div className="lg:col-span-7 w-full order-1 lg:order-2">
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/9] min-h-[360px] lg:min-h-[440px] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-2xl bg-[var(--color-surface)] group">
              <Image
                src="/brand_assets/ismail-sabbar-consultant-studio-portrait.webp"
                alt="Ismail Sabbar Systems Architecture Consultant"
                fill
                sizes="(max-width: 1024px) 100vw, 750px"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

              {/* Anchored Corner Status Telemetry Badge */}
              <div className="absolute bottom-4 left-4 z-10 px-3.5 py-1.5 rounded-xl backdrop-blur-md bg-black/65 border border-white/15 text-white text-xs font-mono flex items-center gap-2 shadow-lg">
                <span className="status-dot status-dot--online" />
                <span className="font-semibold">Systems Architecture Lead</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Row: Symmetrical 4-Card Telemetry Grid with Icons and Refined Typography */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 pt-10 border-t border-[var(--color-border)]">
          {stats.map((stat, idx) => {
            const { Icon, color, bg, border } = getStatIcon(idx);
            return (
              <Reveal key={stat.label} index={idx}>
                <SpotlightCard
                  spotlightColor="rgba(6, 182, 212, 0.12)"
                  className="p-6 sm:p-7 rounded-3xl text-center space-y-3 border-[var(--color-border)] hover:border-cyan-500/40 shadow-md group"
                >
                  {/* Stat Icon Badge */}
                  <div className={`w-10 h-10 rounded-2xl ${bg} ${color} border ${border} flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  {/* Refined Proportionate Number */}
                  <div className="text-3xl sm:text-3xl lg:text-4xl font-extrabold font-mono text-[var(--color-text)] tracking-tight">
                    <AnimatedStatNumber rawValue={stat.value} />
                  </div>

                  {/* Stat Label */}
                  <p className="font-mono text-xs text-[var(--color-text-muted)] font-semibold">
                    {stat.label}
                  </p>
                </SpotlightCard>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
