'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { TechStackItem } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import {
  serviceIconMap,
  ShieldCheckIcon,
  ClockIcon,
  BoltIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from '@/components/icons';
import { getLocalizedField } from '@/lib/db/helpers';
import { Reveal } from '@/motion/Reveal';

interface TechStackBannerProps {
  dict: Dictionary;
  locale?: Locale;
  /** Phase 2: DB-driven tech stack. */
  techStack: TechStackItem[];
}

type CategoryKey = 'all' | 'frontend' | 'automation' | 'backend' | 'data_cms';

interface CategoryTab {
  key: CategoryKey;
  label: string;
}

const CATEGORY_TABS: CategoryTab[] = [
  { key: 'all', label: 'All Core Stack' },
  { key: 'frontend', label: 'Frontend & UI' },
  { key: 'automation', label: 'Automation & AI' },
  { key: 'backend', label: 'Backend & APIs' },
  { key: 'data_cms', label: 'Databases & CMS' },
];

const ITEMS_PER_PAGE = 6;

function categorizeTech(name: string): CategoryKey {
  const n = name.toLowerCase();
  if (n.includes('next') || n.includes('react') || n.includes('typescript') || n.includes('javascript') || n.includes('html') || n.includes('css') || n.includes('tailwind') || n.includes('jquery') || n.includes('ajax') || n.includes('vue')) {
    return 'frontend';
  }
  if (n.includes('n8n') || n.includes('python') || n.includes('scraping') || n.includes('automation') || n.includes('telegram') || n.includes('webhook') || n.includes('ai')) {
    return 'automation';
  }
  if (n.includes('laravel') || n.includes('codeigniter') || n.includes('php') || n.includes('perfex') || n.includes('api') || n.includes('crm') || n.includes('node')) {
    return 'backend';
  }
  if (n.includes('sql') || n.includes('mongo') || n.includes('postgres') || n.includes('database') || n.includes('wordpress') || n.includes('woocommerce') || n.includes('redis')) {
    return 'data_cms';
  }
  return 'frontend';
}

function getTechRole(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('n8n')) return 'Workflow Orchestration';
  if (n.includes('perfex') || n.includes('crm')) return 'Enterprise Architecture';
  if (n.includes('next') || n.includes('react')) return 'App Router & SSR';
  if (n.includes('laravel') || n.includes('codeigniter')) return 'Backend APIs & MVC';
  if (n.includes('wordpress') || n.includes('woocommerce')) return 'Headless & Custom Plugins';
  if (n.includes('typescript') || n.includes('javascript')) return 'Type-Safe Architecture';
  if (n.includes('python') || n.includes('scraping')) return 'Scraping & Data Pipelines';
  if (n.includes('sql') || n.includes('mongo') || n.includes('database')) return 'Relational & NoSQL Data';
  if (n.includes('html') || n.includes('css')) return 'Semantic UI & Layouts';
  if (n.includes('php')) return 'Server-Side Core';
  return 'Core Technology';
}

function getTechBadge(idx: number): { label: string; style: string } {
  if (idx % 3 === 0) {
    return {
      label: 'Core Stack',
      style: 'bg-cyan-50 text-cyan-800 border-cyan-200 dark:bg-cyan-950/60 dark:text-cyan-300 dark:border-cyan-500/30',
    };
  }
  if (idx % 3 === 1) {
    return {
      label: 'Enterprise',
      style: 'bg-purple-50 text-purple-800 border-purple-200 dark:bg-purple-950/60 dark:text-purple-300 dark:border-purple-500/30',
    };
  }
  return {
    label: 'Production Ready',
    style: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30',
  };
}

export function TechStackBanner({ dict, locale = 'en', techStack }: TechStackBannerProps) {
  const [activeTab, setActiveTab] = useState<CategoryKey>('all');
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(1);
  const [isPaused, setIsPaused] = useState(false);

  // 1. De-duplicate tech items by normalized lowercase name
  const deduplicatedStack = useMemo(() => {
    const seen = new Set<string>();
    const list: TechStackItem[] = [];
    for (const item of techStack) {
      const key = item.name.trim().toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        list.push(item);
      }
    }
    return list;
  }, [techStack]);

  // 2. Filter items by active tab
  const filteredItems = useMemo(() => {
    if (activeTab === 'all') return deduplicatedStack;
    return deduplicatedStack.filter((item) => categorizeTech(item.name) === activeTab);
  }, [deduplicatedStack, activeTab]);

  const totalPages = Math.max(1, Math.ceil(filteredItems.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages - 1);

  const paginatedItems = useMemo(() => {
    const start = currentPage * ITEMS_PER_PAGE;
    return filteredItems.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredItems, currentPage]);

  const handleTabChange = (tab: CategoryKey) => {
    setActiveTab(tab);
    setPage(0);
    setDirection(1);
  };

  const handleNextPage = useCallback(() => {
    setDirection(1);
    setPage((prev) => (prev + 1) % totalPages);
  }, [totalPages]);

  const handlePrevPage = useCallback(() => {
    setDirection(-1);
    setPage((prev) => (prev - 1 + totalPages) % totalPages);
  }, [totalPages]);

  // Optional auto-rotation (every 7 seconds when not hovered and multiple pages exist)
  useEffect(() => {
    if (isPaused || totalPages <= 1) return;
    const interval = setInterval(() => {
      handleNextPage();
    }, 7000);
    return () => clearInterval(interval);
  }, [isPaused, totalPages, handleNextPage]);

  if (deduplicatedStack.length === 0) return null;

  return (
    <section id="tech-stack" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative space-y-12">
        {/* Section Header */}
        <div className="space-y-3 max-w-3xl">
          <div className="kicker kicker--secondary">{dict.sections.tech_kicker}</div>
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {dict.sections.tech_title}
          </h2>
          <p className="text-lead font-body text-[var(--color-text-muted)]">
            {dict.sections.tech_subtitle}
          </p>
        </div>

        {/* Row 1: Left Categorized Tools Carousel + Right Studio Portrait */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Categorized Tabs + 6-Item Grid Carousel */}
          <div
            className="lg:col-span-7 space-y-6"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-2">
              {CATEGORY_TABS.map((tab) => {
                const isActive = activeTab === tab.key;
                return (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => handleTabChange(tab.key)}
                    className={`px-3.5 py-1.5 rounded-xl font-mono text-xs font-semibold transition-all cursor-pointer border ${
                      isActive
                        ? 'bg-[var(--color-accent-primary)] text-white border-transparent shadow-md'
                        : 'bg-[var(--color-surface)] text-[var(--color-text-muted)] border-[var(--color-border)] hover:text-[var(--color-text)] hover:border-[var(--color-border-strong)]'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Animated 2x3 Grid Container with +40px Top Margin & 200ms Fast Transition */}
            <div className="relative min-h-[310px] mt-11 mb-7">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${activeTab}-${currentPage}`}
                  custom={direction}
                  initial={{ opacity: 0, x: direction > 0 ? 16 : -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction > 0 ? -16 : 16 }}
                  transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
                >
                  {paginatedItems.map((tech, idx) => {
                    const Icon = serviceIconMap[tech.icon];
                    const name = getLocalizedField(tech.name_i18n, tech.name, locale);
                    const role = getTechRole(name);
                    const badge = getTechBadge(idx);

                    return (
                      <div
                        key={tech.id}
                        className="p-4 sm:p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-cyan-500/40 hover:bg-[var(--color-surface-raised)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 group flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-cyan-500/10 to-purple-500/10 dark:from-cyan-500/20 dark:to-purple-500/20 border border-[var(--color-border-strong)] flex items-center justify-center shrink-0 text-[var(--color-accent-primary)] group-hover:scale-105 transition-transform duration-200">
                            {Icon ? <Icon className="w-5 h-5" /> : null}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-sm text-[var(--color-text)] truncate group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                              {name}
                            </h3>
                            <p className="font-mono text-[11px] text-[var(--color-text-muted)] truncate">
                              {role}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`hidden sm:inline-flex shrink-0 text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md border ${badge.style}`}
                        >
                          {badge.label}
                        </span>
                      </div>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between pt-5 mt-2 border-t border-[var(--color-border)]">
              <span className="font-mono text-xs text-[var(--color-text-muted)]">
                Showing {filteredItems.length} Technologies
              </span>

              {totalPages > 1 && (
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setDirection(i > currentPage ? 1 : -1);
                          setPage(i);
                        }}
                        aria-label={`Page ${i + 1}`}
                        className={`h-2 rounded-full transition-all ${
                          currentPage === i
                            ? 'w-6 bg-[var(--color-accent-primary)]'
                            : 'w-2 bg-[var(--color-border-strong)] hover:bg-[var(--color-text-muted)]'
                        }`}
                      />
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={handlePrevPage}
                      aria-label="Previous technologies"
                      className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent-primary)] transition-colors"
                    >
                      <ArrowLeftIcon className="w-4 h-4 rtl:rotate-180" />
                    </button>
                    <button
                      type="button"
                      onClick={handleNextPage}
                      aria-label="Next technologies"
                      className="p-2 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-accent-primary)] transition-colors"
                    >
                      <ArrowRightIcon className="w-4 h-4 rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Natural Studio Portrait */}
          <div className="lg:col-span-5">
            <div className="relative w-full aspect-[4/5] min-h-[380px] lg:min-h-[420px] rounded-3xl overflow-hidden border border-[var(--color-border)] shadow-xl bg-slate-900/10 dark:bg-slate-900/40 group">
              <Image
                src="/brand_assets/ismail-sabbar-editorial-sideview-portrait.webp"
                alt="Ismail Sabbar Technical Architecture Portrait"
                fill
                sizes="(max-width: 1024px) 100vw, 500px"
                className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500 ease-out"
                priority
              />
            </div>
          </div>
        </div>

        {/* Row 2: Spacious 2-Tier Full-Width Engineering Architecture & SLA Telemetry Banner */}
        <Reveal>
          <div className="w-full p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg space-y-6">
            {/* Top Tier: Header Identity on Left + Action CTA on Right */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--color-border)] pb-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <span className="status-dot status-dot--online" />
                  <h3 className="font-display font-bold text-base sm:text-xl text-[var(--color-text)]">
                    Engineering Architecture Standard
                  </h3>
                </div>
                <p className="text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 ps-4.5">
                  Ismail Sabbar · Systems Standard
                </p>
              </div>

              <a
                href="#contact"
                className="btn btn-primary text-white text-xs w-full sm:w-auto px-6 py-2.5 h-auto flex items-center justify-center gap-2 shadow-md shrink-0"
              >
                <span>Discuss Technical Requirements</span>
                <span className="btn-icon-hover inline-block">→</span>
              </a>
            </div>

            {/* Bottom Tier: 3 Spacious Telemetry Pillars (Zero Truncation) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Metric 1 */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:border-cyan-500/30 transition-all group">
                <span className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-105 transition-transform">
                  <BoltIcon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-sm text-[var(--color-text)]">
                    12+ Years Experience
                  </h4>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">
                    85+ Client Systems Shipped
                  </p>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:border-purple-500/30 transition-all group">
                <span className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shrink-0 group-hover:scale-105 transition-transform">
                  <ShieldCheckIcon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-sm text-[var(--color-text)]">
                    Zero-Trust Security
                  </h4>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">
                    HMAC Webhook Ingestion
                  </p>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:border-emerald-500/30 transition-all group">
                <span className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
                  <ClockIcon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <h4 className="font-display font-bold text-sm text-[var(--color-text)]">
                    Sub-100ms Execution
                  </h4>
                  <p className="text-xs font-mono text-[var(--color-text-muted)] mt-0.5">
                    Idempotent Automated Workflows
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
