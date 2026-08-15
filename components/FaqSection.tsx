'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { FAQ } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { getLocalizedField } from '@/lib/db/helpers';
import { trackEvent } from '@/lib/analytics';
import { PlusIcon, SearchIcon, MessageCircleIcon, CalendarIcon } from '@/components/icons';

interface FaqSectionProps {
  dict: Dictionary;
  faqs: FAQ[];
  locale: Locale;
  onOpenBooking?: () => void;
}

export function FaqSection({ dict, faqs, locale, onOpenBooking }: FaqSectionProps) {
  const [openId, setOpenId] = useState<number | null>(faqs.length > 0 ? faqs[0].id : null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set<string>();
    faqs.forEach((f) => {
      const cat = f.category ? getLocalizedField(f.category_i18n, f.category, locale) : null;
      if (cat) set.add(cat);
    });
    return Array.from(set);
  }, [faqs, locale]);

  // Filter FAQs by category & live search
  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const question = getLocalizedField(faq.question_i18n, faq.question, locale).toLowerCase();
      const answer = getLocalizedField(faq.answer_i18n, faq.answer, locale).toLowerCase();
      const category = (faq.category ? getLocalizedField(faq.category_i18n, faq.category, locale) : '').toLowerCase();

      const matchesCategory =
        selectedCategory === 'all' ||
        category === selectedCategory.toLowerCase();

      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        question.includes(query) ||
        answer.includes(query) ||
        category.includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [faqs, locale, selectedCategory, searchQuery]);

  if (faqs.length === 0) return null;

  return (
    <section
      id="faq"
      className="py-24 lg:py-32 relative overflow-hidden bg-[var(--color-surface)]/20"
      aria-labelledby="faq-title"
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-8 space-y-10 relative">
        {/* Section Header with Smooth Scroll Reveal */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3 text-center sm:text-left rtl:sm:text-right"
        >
          <div className="inline-flex items-center gap-2">
            <span className="kicker kicker--secondary">{dict.sections.faq_kicker}</span>
          </div>
          <h2 id="faq-title" className="text-h2 font-display font-bold text-[var(--color-text)] tracking-tight">
            {dict.sections.faq_title}
          </h2>
          <p className="text-sm sm:text-base font-body text-[var(--color-text-muted)] max-w-2xl">
            Everything you need to know about automation architecture, custom Perfex CRM builds, security, and project delivery SLAs.
          </p>
        </motion.div>

        {/* Search & Category Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-4"
        >
          {/* Real-Time Live Search Input */}
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 start-0 ps-3.5 flex items-center pointer-events-none text-[var(--color-text-muted)]">
              <SearchIcon className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions (e.g. n8n, CRM, SLA, security...)"
              className="w-full ps-10 pe-9 py-2.5 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)] text-sm text-[var(--color-text)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute inset-y-0 end-0 pe-3 flex items-center text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-text)] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Interactive Category Filter Pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold shadow-xs shadow-cyan-500/25 scale-[1.02]'
                    : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-cyan-500/40 hover:bg-cyan-500/5'
                }`}
              >
                All ({faqs.length})
              </button>
              {categories.map((cat) => {
                const count = faqs.filter((f) => (f.category ? getLocalizedField(f.category_i18n, f.category, locale) : '') === cat).length;
                const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(isSelected ? 'all' : cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold shadow-xs shadow-cyan-500/25 scale-[1.02]'
                        : 'bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-cyan-500/40 hover:bg-cyan-500/5'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* 60fps GPU-Accelerated Accordion List */}
        <div className="space-y-3.5">
          {filteredFaqs.length === 0 ? (
            <div className="p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-center space-y-2">
              <p className="text-sm font-medium text-[var(--color-text)]">No matching inquiries found</p>
              <p className="text-xs text-[var(--color-text-muted)]">
                Try searching for different keywords or reset your category filter.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-2 text-xs font-mono font-bold text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer"
              >
                Reset Search Filters
              </button>
            </div>
          ) : (
            filteredFaqs.map((faq, idx) => {
              const open = openId === faq.id;
              const answerId = `faq-answer-${faq.id}`;
              const question = getLocalizedField(faq.question_i18n, faq.question, locale);
              const answer = getLocalizedField(faq.answer_i18n, faq.answer, locale);
              const category = faq.category ? getLocalizedField(faq.category_i18n, faq.category, locale) : null;
              const formattedIndex = String(idx + 1).padStart(2, '0');

              return (
                <motion.div
                  key={faq.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-20px' }}
                  transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.3), ease: [0.16, 1, 0.3, 1] }}
                  className={`rounded-2xl transition-all duration-300 border ${
                    open
                      ? 'border-cyan-500/50 bg-[var(--color-surface-raised)] shadow-md shadow-cyan-950/10 dark:shadow-cyan-950/30'
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-cyan-500/30 hover:bg-[var(--color-surface-raised)]/50'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={answerId}
                    onClick={() => {
                      setOpenId(open ? null : faq.id);
                      if (!open) trackEvent('faq_expanded', { faq_id: faq.id, locale });
                    }}
                    className="w-full p-5 sm:p-6 flex items-center justify-between gap-4 text-left rtl:text-right group cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 sm:gap-4 flex-grow min-w-0">
                      {/* Numbered Monospace Kicker */}
                      <span className="font-mono text-xs font-bold text-cyan-600 dark:text-cyan-400 bg-cyan-500/10 px-2 py-1 rounded-lg shrink-0 border border-cyan-500/20">
                        {formattedIndex}
                      </span>

                      <div className="space-y-0.5 min-w-0">
                        {category && (
                          <span className="text-[10px] font-mono uppercase tracking-wider text-[var(--color-text-muted)] block">
                            {category}
                          </span>
                        )}
                        <span
                          className={`font-display font-bold text-sm sm:text-base transition-colors block ${
                            open
                              ? 'text-cyan-700 dark:text-cyan-300'
                              : 'text-[var(--color-text)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400'
                          }`}
                        >
                          {question}
                        </span>
                      </div>
                    </div>

                    {/* Smooth Spring Rotating Plus/Cross Icon */}
                    <span
                      className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all duration-300 shrink-0 ${
                        open
                          ? 'bg-cyan-500/15 border-cyan-500/40 text-cyan-600 dark:text-cyan-300 rotate-45 scale-105'
                          : 'bg-[var(--color-bg)] border-[var(--color-border)] text-[var(--color-text-muted)] group-hover:text-cyan-600 dark:group-hover:text-cyan-400 group-hover:border-cyan-500/30'
                      }`}
                    >
                      <PlusIcon aria-hidden="true" className="w-4 h-4 stroke-[2.5]" />
                    </span>
                  </button>

                  {/* 60fps Native CSS Grid Row Expansion (Zero Height Reflow Jank) */}
                  <div
                    id={answerId}
                    className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${
                      open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 pointer-events-none'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-5 sm:px-6 pb-6 pt-2 text-xs sm:text-sm leading-relaxed text-[var(--color-text-muted)] border-t border-[var(--color-border)]/40 mt-1 whitespace-pre-line">
                        {answer}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* High-Converting Bottom Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-20px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-8 rounded-3xl bg-[var(--color-surface)] border border-[var(--color-border-strong)] shadow-lg shadow-cyan-950/5 flex flex-col sm:flex-row items-center justify-between gap-6"
        >
          <div className="space-y-1.5 text-center sm:text-left rtl:sm:text-right">
            <h3 className="font-display font-bold text-base sm:text-lg text-[var(--color-text)]">
              Have a specific technical requirement?
            </h3>
            <p className="text-xs sm:text-sm text-[var(--color-text-muted)] max-w-lg">
              Get an immediate architecture review and timeline estimate for your unique workflow or CRM project.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="https://wa.me/212681510095?text=Hello%20Ismail,%20I%20have%20a%20project%20inquiry%20regarding%20automation/CRM."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary text-xs sm:text-sm cursor-pointer"
            >
              <MessageCircleIcon className="w-4 h-4 text-emerald-500" />
              <span>Chat on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={() => (onOpenBooking ? onOpenBooking() : (window.location.href = '#contact'))}
              className="btn btn-primary text-xs sm:text-sm cursor-pointer"
            >
              <CalendarIcon className="w-4 h-4" />
              <span>Book a Call</span>
              <span className="btn-icon-hover inline-block">→</span>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
