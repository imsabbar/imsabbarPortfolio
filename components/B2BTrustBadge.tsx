'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { Locale } from '@/i18n/config';
import { FALLBACK_ICE_NUMBER } from '@/lib/constants';
import { ShieldCheckIcon, DocumentIcon, GlobeIcon } from '@/components/icons';

interface B2BTrustBadgeProps {
  dict: Dictionary;
  locale?: Locale;
  iceNumber?: string;
  badge?: string;
}

export function B2BTrustBadge({
  dict,
  locale = 'en',
  iceNumber = FALLBACK_ICE_NUMBER,
  badge,
}: B2BTrustBadgeProps) {
  const content = {
    en: {
      reg_title: badge || 'Registered Independent Engineer',
      reg_sub: `ICE: ${iceNumber} · Auto-Entrepreneur`,
      invoice_title: 'Official B2B Invoicing',
      invoice_sub: 'Tax-compliant invoices & multi-currency wire',
      remote_title: '100% Remote & Global',
      remote_sub: 'Serving clients across GMT, CET, EST & GST',
    },
    fr: {
      reg_title: badge || 'Ingénieur Indépendant Enregistré',
      reg_sub: `ICE: ${iceNumber} · Auto-Entrepreneur`,
      invoice_title: 'Facturation B2B Officielle',
      invoice_sub: 'Factures conformes aux normes fiscales & virement',
      remote_title: '100% Télétravail & International',
      remote_sub: 'Collaboration fluide sur les fuseaux GMT, CET, EST',
    },
    ar: {
      reg_title: badge || 'مهندس مستقل معتمد رسمياً',
      reg_sub: `رقم التعريف الضريبي ICE: ${iceNumber}`,
      invoice_title: 'فواتير رسمية للشركات B2B',
      invoice_sub: 'فواتير ضريبية معتمدة وتعاملات بنكية دولية',
      remote_title: 'عمل عن بُعد لجميع دول العالم',
      remote_sub: 'تغطية كاملة للمناطق الزمنية GMT, CET, EST',
    },
  }[locale] || {
    reg_title: badge || 'Registered Independent Engineer',
    reg_sub: `ICE: ${iceNumber} · Auto-Entrepreneur`,
    invoice_title: 'Official B2B Invoicing',
    invoice_sub: 'Tax-compliant invoices & multi-currency wire',
    remote_title: '100% Remote & Global',
    remote_sub: 'Serving clients across GMT, CET, EST & GST',
  };

  const pillars = [
    {
      id: 'registration',
      icon: ShieldCheckIcon,
      title: content.reg_title,
      subtitle: content.reg_sub,
      status: 'Verified',
      statusType: 'online' as const,
    },
    {
      id: 'invoicing',
      icon: DocumentIcon,
      title: content.invoice_title,
      subtitle: content.invoice_sub,
      status: 'Tax-Compliant',
      statusType: 'neutral' as const,
    },
    {
      id: 'remote',
      icon: GlobeIcon,
      title: content.remote_title,
      subtitle: content.remote_sub,
      status: 'Worldwide',
      statusType: 'neutral' as const,
    },
  ];

  return (
    <section className="py-6 sm:py-7 border-y border-[var(--color-border)] bg-[var(--color-surface)]/60 backdrop-blur-xl relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-4 lg:gap-8 items-center">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20px' }}
                transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                className={`flex items-center gap-3.5 sm:gap-4 p-2 sm:p-2.5 rounded-2xl transition-all duration-300 group hover:bg-[var(--color-surface-raised)]/40 ${
                  idx < pillars.length - 1 ? 'md:border-e md:border-[var(--color-border)]/60 md:pe-4 lg:pe-8' : ''
                }`}
              >
                {/* Icon Capsule */}
                <div className="p-3 rounded-2xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-105 group-hover:border-cyan-500/50 transition-all shadow-2xs">
                  <Icon className="w-5 h-5" />
                </div>

                {/* Content */}
                <div className="space-y-0.5 min-w-0 flex-grow">
                  <h3 className="font-display font-bold text-xs sm:text-sm text-[var(--color-text)] tracking-tight truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="font-mono text-[11px] text-[var(--color-text-muted)] leading-tight truncate">
                    {pillar.subtitle}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
