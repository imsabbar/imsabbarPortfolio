'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { heroEntranceVariant } from '@/motion/variants';
import { serviceIconMap } from '@/components/icons';
import type { Dictionary } from '@/types/dictionary';
import type { Locale } from '@/i18n/config';
import { RESUME_FILES, CONTACT, SITE } from '@/lib/constants';
import { SocialLinks } from './SocialLinks';
import { DownloadIcon } from '@/components/icons';
import type { SocialLinks as SocialLinksMap } from '@/types/portfolio';

interface HeroProps {
  dict: Dictionary;
  currentLocale?: Locale;
  availabilityStatus?: string;
  availabilityMessage?: string;
  /** Phase 2: spec chips from the `hero` content block. Falls back to sample data. */
  specChips?: string[];
  /** DB-driven social links (PRD §7.4). */
  socialLinks?: SocialLinksMap | null;
  onOpenBooking?: () => void;
}

interface SpecChip {
  label: string;
  icon: string;
}

export function Hero({
  dict,
  currentLocale = 'en',
  availabilityStatus = 'online',
  availabilityMessage,
  specChips,
  socialLinks,
  onOpenBooking,
}: HeroProps) {
  const isAvailable = availabilityStatus === 'online';
  const resumeFilename = RESUME_FILES[currentLocale as keyof typeof RESUME_FILES] || RESUME_FILES.en;
  const resumePath = `/files/${resumeFilename}`;

  // Phase 2: DB-driven chips. Empty means the OS hasn't configured them yet —
  // per PRD §4.8/§6.3 we omit the row rather than show placeholder content.
  const chips: SpecChip[] = (specChips ?? []).map((label) => ({ label, icon: 'Bolt' }));

  return (
    <section id="hero" className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden">
      {/* Ambient glow — PRD §4.5 cyan top-right */}
      <div
        className="absolute top-1/4 right-0 w-[500px] h-[300px] glow glow--primary"
        aria-hidden="true"
      />
      {/* Blueprint grid */}
      <div className="absolute inset-0 bg-blueprint opacity-50" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Copy column */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 flex flex-col items-start gap-6 text-start"
          >
            {/* Status pill + experience badge */}
            <motion.div custom={0} variants={heroEntranceVariant} className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-xs font-mono">
                <span className="status-dot status-dot--online" />
                <span className="text-[var(--color-text-muted)]">
                  {availabilityMessage || (isAvailable ? dict.hero.available : dict.hero.busy)}
                </span>
              </div>

              <div className="data-chip text-cyan-300 border-cyan-500/20">
                {dict.hero.badge_experience}
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              custom={1}
              variants={heroEntranceVariant}
              className="font-display font-bold text-[var(--color-text)] text-[clamp(2rem,1.1rem+3vw,3rem)] leading-tight"
            >
              {dict.hero.headline}
            </motion.h1>

            {/* Subhead */}
            <motion.p
              custom={2}
              variants={heroEntranceVariant}
              className="text-lead font-body text-[var(--color-text-muted)] max-w-2xl"
            >
              {dict.hero.subhead}
            </motion.p>

            {/* CTAs */}
            <motion.div custom={3} variants={heroEntranceVariant} className="space-y-4 pt-2 w-full">
              {/* Primary Action Buttons */}
              <div className="flex flex-wrap items-center gap-3.5">
                <a
                  href="#work"
                  className="btn btn-primary group"
                >
                  <span>{dict.hero.cta_work}</span>
                  <span className="btn-icon-hover inline-block">→</span>
                </a>

                <button
                  type="button"
                  onClick={() => (onOpenBooking ? onOpenBooking() : (window.location.href = '#contact'))}
                  className="btn btn-secondary"
                >
                  {dict.hero.cta_book}
                </button>

                <a
                  href={resumePath}
                  download={resumeFilename}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={`${dict.hero.download_resume} (${currentLocale.toUpperCase()})`}
                  className="btn btn-ghost group"
                >
                  <DownloadIcon className="w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-y-0.5" />
                  <span>{dict.hero.download_resume}</span>
                </a>
              </div>

              {/* Social Channels (Flush Left with Generous Breathing Room) */}
              <div className="pt-3 sm:pt-4">
                <SocialLinks links={socialLinks} />
              </div>
            </motion.div>

            {/* Spec chips */}
            {chips.length > 0 && (
              <motion.div
                custom={4}
                variants={heroEntranceVariant}
                className="pt-6 border-t border-[var(--color-border)] w-full flex flex-wrap gap-x-6 gap-y-3 text-xs font-mono text-[var(--color-text-muted)]"
              >
                {chips.map((chip) => {
                  const Icon = serviceIconMap[chip.icon];
                  return (
                    <span key={chip.label} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--color-surface)]/60 border border-[var(--color-border)] hover:border-[var(--color-accent-primary)]/40 hover:text-[var(--color-text)] transition-colors duration-200">
                      {Icon && <Icon className="w-3.5 h-3.5 text-[var(--color-accent-primary)]" />}
                      {chip.label}
                    </span>
                  );
                })}
              </motion.div>
            )}
          </motion.div>

          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.56, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex justify-end"
          >
            <div className="relative w-full max-w-md aspect-[3/4] rounded-3xl overflow-hidden border border-[var(--color-border-strong)] shadow-2xl shadow-cyan-950/30 group transition-colors duration-500 hover:border-cyan-500/40">
              <Image
                src="/brand_assets/sabbar-ismail-shoot.webp"
                alt={`${SITE.name} — ${dict.hero.portrait_role}`}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 400px"
                className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 via-[#0B0F19]/20 to-transparent opacity-80 pointer-events-none" />

              {/* Subtle White Binary Matrix Grid (Opacity 0.04, dissolves on hover) */}
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none transition-opacity duration-500 ease-out opacity-[0.04] group-hover:opacity-0 z-10 select-none overflow-hidden p-3 font-mono text-[9px] sm:text-[10px] leading-[14px] sm:leading-[16px] tracking-[0.24em] text-white break-all"
              >
                01001001 01101101 01110011 01100001 01100010 01100010 01100001 01110010
                01000011 01010010 01001101 00111010 01101110 00111000 01101110 00100000
                01110111 01101111 01110010 01101011 01100110 01101100 01101111 01110111
                01010011 01011001 01010011 01010100 01000101 01001101 01010011 00100000
                01100001 01110101 01110100 01101111 01101101 01100001 01110100 01101001
                01101111 01101110 00100000 01100001 01110000 01101001 00100000 01100100
                01100001 01110100 01100001 00100000 01110011 01111001 01101110 01100011
                01010000 01100101 01110010 01100110 01100101 01111000 00100000 01000011
                01010010 01001101 00100000 01101101 01101111 01100100 01110101 01101100
                01100101 00100000 01101000 01101111 01101111 01101011 01110011 00100000
                01001110 01100101 01111000 01110100 01101010 01110011 00100000 01110111
                01100101 01100010 01110011 01101001 01110100 01100101 00100000 01100011
                01101111 01100100 01100101 00100000 01110011 01100011 01100001 01101100
                01100101 00100000 01101101 01101111 01100100 01100101 01110010 01101110
                01100101 01101110 01100111 01101001 01101110 01100101 01100101 01110010
                01000001 01110101 01110100 01101111 01101101 01100001 01110100 01101001
                01101111 01101110 00100000 01000101 01101110 01100111 01101001 01101110
                01100101 01100101 01110010 00100000 01101001 01101101 01110011 01100001
                01100010 01100010 01100001 01110010 00100000 00110010 00110000 00110010
                00110110 00100000 01100011 01101111 01100100 01100101 00100000 01100010
              </div>

              <div className="absolute bottom-5 left-5 right-5 p-4 rounded-2xl backdrop-blur-xl bg-black/50 border border-white/15 text-white text-xs font-mono shadow-lg transition-transform duration-300 group-hover:-translate-y-1 z-20">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm tracking-wide">{SITE.name}</p>
                    <p className="text-cyan-300/90 text-[11px] mt-0.5">{dict.hero.portrait_role} · {dict.hero.badge_experience.replace(/\D+$/, '')}</p>
                  </div>
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
