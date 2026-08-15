'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import { ArrowRightIcon, BoltIcon, LayersIcon } from '@/components/icons';
import { XRayDrawer } from './XRayDrawer';
import type { CaseStudy, CaseStudyXRaySpecs } from '@/types/portfolio';
import { getLocalizedField } from '@/lib/db/helpers';
import type { Locale } from '@/i18n/config';
import { trackEvent } from '@/lib/analytics';
import { SpotlightCard } from '@/components/ui/SpotlightCard';

// PRD §12.3 — the simulator is client-only and code-split out of the main bundle.
const N8nFlowSimulator = dynamic(() => import('./N8nFlowSimulator').then((m) => m.N8nFlowSimulator), { ssr: false });

interface CaseStudyGridProps {
  dict: Dictionary;
  locale?: Locale;
  /** Phase 2: DB-driven case studies. */
  caseStudies: CaseStudy[];
  /** The case study driving the embedded n8n simulator. */
  featuredCaseStudy?: CaseStudy | null;
}

const INITIAL_VISIBLE_COUNT = 3;
const STEP_VISIBLE_COUNT = 3;

/**
 * Fallback resolution for case study screenshots when DB image_url is missing.
 */
function resolveCaseStudyImage(slug: string, rawImageUrl?: string | null): string {
  if (rawImageUrl && rawImageUrl.trim().length > 0 && !rawImageUrl.includes('placeholder')) {
    return rawImageUrl;
  }
  const s = slug.toLowerCase();
  if (s.includes('janna') || s.includes('jana')) return '/images/jana_thumbnail.jpg';
  if (s.includes('digi')) return '/images/digiprod_thumbnail.jpg';
  if (s.includes('marketing')) return '/images/marketing_thumbnail.jpg';
  if (s.includes('pso')) return '/images/pso-thumbnail.jpg';
  return '/images/pso-thumbnail.jpg';
}

function getCaseStudyTags(slug: string, specs?: CaseStudyXRaySpecs | null): string[] {
  if (specs?.stack && specs.stack.length > 0) {
    return specs.stack.slice(0, 4);
  }
  const s = slug.toLowerCase();
  if (s.includes('janna') || s.includes('jana')) {
    return ['Next.js 15', 'React 19', 'Tailwind CSS', 'Responsive UI'];
  }
  if (s.includes('digiprod')) {
    return ['Next.js', 'TypeScript', 'Tailwind CSS', 'Performance Engine'];
  }
  if (s.includes('perfex') || s.includes('n8n')) {
    return ['n8n Engine', 'Perfex CRM', 'MySQL', 'Telegram API'];
  }
  return ['Next.js 15', 'TypeScript', 'Modern UI', 'API Integration'];
}

export function CaseStudyGrid({ dict, locale = 'en', caseStudies, featuredCaseStudy }: CaseStudyGridProps) {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (caseStudies.length === 0) return null;

  const visibleStudies = caseStudies.slice(0, visibleCount);
  const hasMore = visibleCount < caseStudies.length;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    trackEvent('case_study_load_more', { current_count: visibleCount });
    // Smooth tactile delay
    setTimeout(() => {
      setVisibleCount((prev) => prev + STEP_VISIBLE_COUNT);
      setIsLoadingMore(false);
    }, 200);
  };

  return (
    <section id="work" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/3 left-0 w-[500px] h-[350px] glow glow--secondary opacity-20" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-14 relative">
        {/* Section Header */}
        <div className="space-y-3">
          <div className="kicker">{dict.sections.work_kicker}</div>
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {dict.sections.work_title}
          </h2>
          <p className="text-lead font-body text-[var(--color-text-muted)] max-w-2xl">
            {dict.sections.work_subtitle}
          </p>
        </div>

        {/* Case Study Cards (Progressively Rendered with One-by-One Staggered Motion) */}
        <div className="space-y-12">
          {visibleStudies.map((item, index) => {
            const isFeatured = featuredCaseStudy?.id === item.id;
            const title = getLocalizedField(item.title_i18n, item.title, locale);
            const summary = getLocalizedField(item.summary_i18n, item.summary, locale);
            const clientRegion = getLocalizedField(item.client_region_i18n, item.client_region ?? '', locale);
            const impactMetric = getLocalizedField(item.impact_metric_i18n, item.impact_metric ?? '', locale);
            const imageUrl = resolveCaseStudyImage(item.slug, item.image_url);
            const techTags = getCaseStudyTags(item.slug, item.xray_specs_json);

            // Stagger animation: 0.12s between each card in the current batch
            const staggerDelay = (index % STEP_VISIBLE_COUNT) * 0.12;

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 36, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.45,
                  delay: staggerDelay,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <SpotlightCard
                  spotlightColor="rgba(6, 182, 212, 0.12)"
                  className="p-6 sm:p-8 lg:p-10 space-y-8 group border-[var(--color-border)] hover:border-cyan-500/40 hover:shadow-xl transition-all duration-300"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                    {/* Left Column: Metadata, Title, Summary, Impact Box, Tech Tags & Actions */}
                    <div className="lg:col-span-7 space-y-6">
                      {/* Top Chips */}
                      <div className="flex flex-wrap items-center gap-2.5 text-xs font-mono">
                        {clientRegion && (
                          <span className="px-3 py-1 rounded-xl bg-cyan-50 text-cyan-800 border border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/30 font-semibold shadow-xs">
                            {clientRegion}
                          </span>
                        )}
                        {item.client_name && (
                          <span className="text-[var(--color-text-muted)] font-medium">
                            {item.client_name}
                          </span>
                        )}
                        {isFeatured && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-purple-50 text-purple-800 border border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/30 text-[10px] font-bold uppercase tracking-wider shadow-xs">
                            <BoltIcon className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                            Featured
                          </span>
                        )}
                      </div>

                      {/* Main Title */}
                      <h3 className="font-display text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--color-text)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                        {title}
                      </h3>

                      {/* Summary Paragraph */}
                      <p className="font-body text-sm sm:text-base text-[var(--color-text-muted)] leading-relaxed">
                        {summary}
                      </p>

                      {/* Verified Production Impact Box */}
                      {impactMetric && (
                        <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-500/30 shadow-xs space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="status-dot status-dot--online" />
                            <span className="text-[11px] font-mono font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-wider">
                              Verified Production Impact
                            </span>
                          </div>
                          <p className="font-display font-semibold text-xs sm:text-sm text-emerald-950 dark:text-emerald-200 ps-4.5">
                            {impactMetric}
                          </p>
                        </div>
                      )}

                      {/* Tech Stack Pills */}
                      <div className="space-y-2 pt-1">
                        <div className="flex items-center gap-1.5 text-xs font-mono text-[var(--color-text-muted)]">
                          <LayersIcon className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400 shrink-0" />
                          <span>Engineered with:</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          {techTags.map((tag) => (
                            <span
                              key={tag}
                              className="px-2.5 py-1 rounded-lg bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-xs font-mono font-medium text-[var(--color-text)]"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Action Triggers */}
                      <div className="flex flex-wrap items-center gap-3.5 pt-2">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedStudy(item);
                            trackEvent('case_study_expand', { case_study_id: item.id });
                          }}
                          className="btn btn-secondary text-xs px-5 py-2.5 h-auto rounded-xl font-semibold flex items-center gap-2 hover:border-cyan-500/40 hover:bg-cyan-500/10 transition-all cursor-pointer"
                        >
                          <span>{dict.common.see_breakdown}</span>
                        </button>
                        <Link
                          href={`/${locale}/case-studies/${item.slug}`}
                          onClick={() =>
                            trackEvent('case_study_navigate', {
                              case_study_id: item.id,
                              slug: item.slug,
                            })
                          }
                          className="btn btn-primary text-white text-xs px-5 py-2.5 h-auto rounded-xl font-semibold flex items-center gap-2 shadow-md"
                        >
                          <span>{dict.common.read_full_case}</span>
                          <ArrowRightIcon className="w-3.5 h-3.5 btn-icon-hover rtl:rotate-180" />
                        </Link>
                      </div>
                    </div>

                    {/* Right Column: Luxury App Browser Viewport Frame */}
                    <div className="lg:col-span-5">
                      <div className="relative w-full rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-xl bg-[var(--color-surface-raised)] group/mockup">
                        {/* Browser Window Header */}
                        <div className="flex items-center justify-between px-4 py-2.5 bg-[var(--color-surface)] border-b border-[var(--color-border)]">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                          </div>
                          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-[var(--color-bg)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-text-muted)] truncate max-w-[180px]">
                            <span>🔒</span>
                            <span className="truncate">{item.slug}.prod</span>
                          </div>
                          <div className="w-6" />
                        </div>

                        {/* Screenshot Canvas */}
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-950/10 dark:bg-slate-950/40">
                          <Image
                            src={imageUrl}
                            alt={title}
                            fill
                            sizes="(max-width: 1024px) 100vw, 550px"
                            className="object-cover object-top group-hover/mockup:scale-105 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Embedded simulator inside featured case study */}
                  {isFeatured && featuredCaseStudy && featuredCaseStudy.n8n_nodes_json?.length ? (
                    <div className="pt-6 border-t border-[var(--color-border)]">
                      <N8nFlowSimulator dict={dict} nodes={featuredCaseStudy.n8n_nodes_json} />
                    </div>
                  ) : null}
                </SpotlightCard>
              </motion.div>
            );
          })}
        </div>

        {/* Clean 'Explore More' Trigger (No Numbers) */}
        <AnimatePresence>
          {hasMore && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex items-center justify-center pt-6"
            >
              <button
                type="button"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="px-8 py-3.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-accent-primary)] hover:border-[var(--color-accent-primary)] hover:text-white font-mono text-xs font-semibold text-[var(--color-text)] flex items-center gap-3 cursor-pointer transition-all duration-300 disabled:opacity-60 group shadow-none hover:shadow-none"
              >
                {isLoadingMore ? (
                  <>
                    <BoltIcon className="w-4 h-4 text-cyan-500 group-hover:text-white animate-spin" />
                    <span>Fetching Deliveries...</span>
                  </>
                ) : (
                  <>
                    <span>Explore More Deliveries</span>
                    <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 group-hover:bg-white/20 group-hover:text-white group-hover:translate-y-0.5 transition-all">
                      ↓
                    </span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <XRayDrawer
          isOpen={selectedStudy !== null}
          onClose={() => setSelectedStudy(null)}
          dict={dict}
          specs={selectedStudy?.xray_specs_json}
          title={selectedStudy ? getLocalizedField(selectedStudy.title_i18n, selectedStudy.title, locale) : ''}
        />
      </div>
    </section>
  );
}
