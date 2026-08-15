'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { Testimonial } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { getLocalizedField } from '@/lib/db/helpers';
import { Reveal } from '@/motion/Reveal';
import { ArrowLeftIcon, ArrowRightIcon } from '@/components/icons';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

interface TestimonialCarouselProps {
  dict: Dictionary;
  locale?: Locale;
  /** Phase 2: DB-driven testimonials. */
  testimonials?: Testimonial[];
}

export function TestimonialCarousel({ dict, locale = 'en', testimonials = [] }: TestimonialCarouselProps) {
  // PRD §6.3: omit section entirely if no real testimonials exist yet.
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  // PRD §9.8: ≤3 items = static grid; >3 items = manual-control carousel.
  if (testimonials.length >= 4) {
    return <Carousel dict={dict} locale={locale} testimonials={testimonials} />;
  }
  return <Grid dict={dict} locale={locale} testimonials={testimonials} />;
}

function Grid({ dict, locale, testimonials }: Required<Omit<TestimonialCarouselProps, 'testimonials'>> & { testimonials: Testimonial[] }) {
  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12 relative">
        <div className="space-y-3">
          <div className="kicker kicker--secondary">{dict.sections.testimonials_kicker}</div>
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {dict.sections.testimonials_title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {testimonials.map((item, idx) => (
            <Reveal key={item.id} index={idx}>
              <TestimonialCard item={item} locale={locale} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Carousel({ dict, locale, testimonials }: Required<Omit<TestimonialCarouselProps, 'testimonials'>> & { testimonials: Testimonial[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = testimonials[activeIndex];
  if (!active) return null;

  const goTo = (i: number) => setActiveIndex(((i % testimonials.length) + testimonials.length) % testimonials.length);

  return (
    <section className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10 text-center relative">
        <div className="space-y-3">
          <div className="kicker kicker--secondary justify-center">{dict.sections.testimonials_kicker}</div>
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {dict.sections.testimonials_title}
          </h2>
        </div>

        <SpotlightCard
          spotlightColor="rgba(139, 92, 246, 0.12)"
          className="p-8 sm:p-12 rounded-3xl border-purple-500/20 shadow-xl backdrop-blur-xl"
        >
          <motion.figure
            key={active.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <blockquote className="text-lg sm:text-xl font-body text-[var(--color-text)] leading-relaxed italic">
              &ldquo;{getLocalizedField(active.quote_i18n, active.quote, locale)}&rdquo;
            </blockquote>
            <figcaption className="text-xs font-mono text-[var(--color-text-muted)] pt-2 border-t border-[var(--color-border)]">
              <span className="font-bold text-sm text-[var(--color-text)]">
                {getLocalizedField(active.client_name_i18n, active.client_name, locale)}
              </span>
              {active.company && <span className="text-purple-400"> · {getLocalizedField(active.company_i18n, active.company, locale)}</span>}
              {active.country && <span> ({getLocalizedField(active.country_i18n, active.country, locale)})</span>}
            </figcaption>
          </motion.figure>
        </SpotlightCard>

        {/* Manual prev/next controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            aria-label={dict.a11y.carousel_prev}
            className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-cyan-300 hover:border-cyan-500/40 hover:shadow-lg transition-all"
          >
            <ArrowLeftIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
          <span className="font-mono text-xs text-[var(--color-text-muted)] tabular-nums px-3 py-1 rounded-lg bg-[var(--color-surface)] border border-[var(--color-border)]">
            {activeIndex + 1} / {testimonials.length}
          </span>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            aria-label={dict.a11y.carousel_next}
            className="p-3 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-cyan-300 hover:border-cyan-500/40 hover:shadow-lg transition-all"
          >
            <ArrowRightIcon className="w-5 h-5 rtl:rotate-180" />
          </button>
        </div>
      </div>
    </section>
  );
}

function TestimonialCard({ item, locale }: { item: Testimonial; locale: Locale }) {
  const clientName = getLocalizedField(item.client_name_i18n, item.client_name, locale);
  const company = getLocalizedField(item.company_i18n, item.company ?? '', locale);
  const country = getLocalizedField(item.country_i18n, item.country ?? '', locale);
  const quote = getLocalizedField(item.quote_i18n, item.quote, locale);
  return (
    <SpotlightCard
      spotlightColor="rgba(139, 92, 246, 0.12)"
      className="p-7 sm:p-9 rounded-3xl space-y-5 font-body border-[var(--color-border)] hover:border-purple-500/30 flex flex-col justify-between h-full"
    >
      <p className="text-sm sm:text-base text-[var(--color-text)] leading-relaxed italic">&ldquo;{quote}&rdquo;</p>
      <div className="text-xs font-mono text-[var(--color-text-muted)] pt-3 border-t border-[var(--color-border)]">
        <span className="font-bold text-[var(--color-text)]">{clientName}</span>
        {company && <span className="text-purple-400"> · {company}</span>}
        {country && <span> ({country})</span>}
      </div>
    </SpotlightCard>
  );
}
