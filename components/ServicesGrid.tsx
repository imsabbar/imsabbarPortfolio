'use client';

import React from 'react';
import type { Dictionary } from '@/types/dictionary';
import type { Service } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { serviceIconMap } from '@/components/icons';
import { getLocalizedField } from '@/lib/db/helpers';
import { Reveal } from '@/motion/Reveal';

interface ServicesGridProps {
  dict: Dictionary;
  locale?: Locale;
  /** Phase 2: DB-driven services. */
  services: Service[];
}

interface DomainStyle {
  iconBg: string;
  badge: string;
  hoverBorder: string;
  hoverTitle: string;
  accentDot: string;
  arrowBtnHover: string;
}

function getDomainStyle(category: string, index: number): DomainStyle {
  const cat = category.toLowerCase();
  if (cat.includes('auto') || cat.includes('n8n') || index === 1) {
    return {
      iconBg: 'bg-purple-500/10 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 border-purple-500/20 dark:border-purple-500/40 group-hover:bg-purple-500/20',
      badge: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/30',
      hoverBorder: 'hover:border-purple-400/50 dark:hover:border-purple-500/40',
      hoverTitle: 'group-hover:text-purple-600 dark:group-hover:text-purple-400',
      accentDot: 'bg-purple-500',
      arrowBtnHover: 'group-hover:bg-purple-600 group-hover:text-white',
    };
  }
  if (cat.includes('crm') || cat.includes('data') || cat.includes('scraping') || index === 2 || index === 4) {
    return {
      iconBg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 dark:border-emerald-500/40 group-hover:bg-emerald-500/20',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30',
      hoverBorder: 'hover:border-emerald-400/50 dark:hover:border-emerald-500/40',
      hoverTitle: 'group-hover:text-emerald-600 dark:group-hover:text-emerald-400',
      accentDot: 'bg-emerald-500',
      arrowBtnHover: 'group-hover:bg-emerald-600 group-hover:text-white',
    };
  }
  return {
    iconBg: 'bg-cyan-500/10 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-400 border-cyan-500/20 dark:border-cyan-500/40 group-hover:bg-cyan-500/20',
    badge: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/30',
    hoverBorder: 'hover:border-cyan-400/50 dark:hover:border-cyan-500/40',
    hoverTitle: 'group-hover:text-cyan-600 dark:group-hover:text-cyan-400',
    accentDot: 'bg-cyan-500',
    arrowBtnHover: 'group-hover:bg-cyan-600 group-hover:text-white',
  };
}

export function ServicesGrid({ dict, locale = 'en', services }: ServicesGridProps) {
  if (services.length === 0) return null;

  return (
    <section id="services" className="py-24 lg:py-32 relative overflow-hidden bg-[var(--color-surface-raised)]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14 relative">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="kicker kicker--tertiary">{dict.sections.services_kicker}</div>
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {dict.sections.services_title}
          </h2>
          <p className="text-lead font-body text-[var(--color-text-muted)] max-w-2xl">
            {dict.sections.services_subtitle}
          </p>
        </div>

        {/* 3-Column Capability Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, idx) => {
            const Icon = serviceIconMap[service.icon_name];
            const title = getLocalizedField(service.title_i18n, service.title, locale);
            const category = getLocalizedField(service.category_i18n, service.category, locale);
            const description = getLocalizedField(service.description_i18n, service.description, locale);
            const style = getDomainStyle(service.category, idx);

            return (
              <Reveal key={service.id} index={idx}>
                <div
                  className={`p-7 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] ${style.hoverBorder} shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between h-full group relative overflow-hidden`}
                >
                  <div className="space-y-6">
                    {/* Top Row: Icon + Category Badge */}
                    <div className="flex items-center justify-between gap-3">
                      <div
                        className={`w-14 h-14 rounded-2xl border flex items-center justify-center transition-all duration-300 group-hover:scale-105 ${style.iconBg}`}
                      >
                        {Icon ? <Icon className="w-7 h-7" /> : null}
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold uppercase tracking-wider px-3 py-1 rounded-full border shadow-2xs ${style.badge}`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${style.accentDot}`} />
                        {category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-2.5">
                      <h3
                        className={`font-display font-bold text-xl text-[var(--color-text)] transition-colors duration-200 ${style.hoverTitle}`}
                      >
                        {title}
                      </h3>
                      <p className="font-body text-sm text-[var(--color-text-muted)] leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>

                  {/* Bottom Strip */}
                  <div className="pt-6 mt-6 border-t border-[var(--color-border)] flex items-center justify-between">
                    <span className="flex items-center gap-2 text-xs font-mono font-medium text-[var(--color-text-muted)]">
                      <span className="status-dot status-dot--online" />
                      Production-Ready
                    </span>
                    <span
                      className={`w-8 h-8 rounded-full bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-[var(--color-text)] flex items-center justify-center text-xs font-bold transition-all duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 ${style.arrowBtnHover}`}
                    >
                      →
                    </span>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
