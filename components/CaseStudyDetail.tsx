'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import type { Dictionary } from '@/types/dictionary';
import type { CaseStudy, N8nNode } from '@/types/portfolio';
import { getLocalizedField } from '@/lib/db/helpers';
import { ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, GithubIcon } from '@/components/icons';
import type { Locale } from '@/i18n/config';

// `react-markdown` ships ~25 KB gz and is only used here. Dynamic-import so the
// home page bundle stays untouched.
const Markdown = dynamic(() => import('react-markdown'), { ssr: false });

interface CaseStudyDetailProps {
  dict: Dictionary;
  locale: Locale;
  caseStudy: CaseStudy;
  nextCaseStudy: CaseStudy | null;
}

const nodeTypeKey: Record<N8nNode['type'], keyof Dictionary['case_study']> = {
  trigger: 'node_type_trigger',
  action: 'node_type_action',
  condition: 'node_type_condition',
  output: 'node_type_output',
};

export function CaseStudyDetail({ dict, locale, caseStudy, nextCaseStudy }: CaseStudyDetailProps) {
  const title = getLocalizedField(caseStudy.title_i18n, caseStudy.title, locale);
  const summary = getLocalizedField(caseStudy.summary_i18n, caseStudy.summary, locale);
  const clientRegion = getLocalizedField(caseStudy.client_region_i18n, caseStudy.client_region ?? '', locale);
  const impactMetric = getLocalizedField(caseStudy.impact_metric_i18n, caseStudy.impact_metric ?? '', locale);
  const beforeMetric = getLocalizedField(caseStudy.before_metric_i18n, caseStudy.before_metric ?? '', locale);
  const afterMetric = getLocalizedField(caseStudy.after_metric_i18n, caseStudy.after_metric ?? '', locale);
  const body = getLocalizedField(caseStudy.body_i18n, '', locale);

  const n8nNodes = caseStudy.n8n_nodes_json ?? [];
  const xray = caseStudy.xray_specs_json;

  const cs = dict.case_study;

  return (
    <article className="font-body" aria-labelledby="cs-title">
      {/* 1. Back link */}
      <div className="max-w-5xl mx-auto px-4 sm:px-8 pt-10">
        <Link
          href={`/${locale}#work`}
          className="inline-flex items-center gap-2 text-xs font-mono text-[var(--color-text-muted)] hover:text-[var(--color-accent-primary)] transition-colors"
        >
          <ArrowLeftIcon className="w-3.5 h-3.5 rtl:rotate-180" />
          {cs.back_to_all_work}
        </Link>
      </div>

      {/* 2. Header (kicker + H1 + impact callout) */}
      <header className="max-w-5xl mx-auto px-4 sm:px-8 pt-6 pb-10 border-b border-[var(--color-border)] space-y-6">
        <div className="kicker">{cs.header_kicker}</div>
        <h1
          id="cs-title"
          className="text-h1 font-display font-bold text-[var(--color-text)] leading-tight"
        >
          {title}
        </h1>
        <p className="text-lead text-[var(--color-text-muted)] max-w-3xl">{summary}</p>

        {impactMetric && (
          <motion.aside
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-5 rounded-2xl bg-[var(--color-accent-primary)]/8 border border-[var(--color-accent-primary)]/30 flex items-center gap-4 max-w-3xl"
          >
            <span className="kicker shrink-0">{cs.impact_callout}</span>
            <span className="font-display font-bold text-2xl text-[var(--color-accent-primary)]">
              {impactMetric}
            </span>
          </motion.aside>
        )}

        {(caseStudy.client_name || clientRegion) && (
          <dl className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-mono">
            {caseStudy.client_name && (
              <div>
                <dt className="text-[var(--color-text-muted)]">{cs.industry_label}</dt>
                <dd className="text-[var(--color-text)] mt-1">{caseStudy.client_name}</dd>
              </div>
            )}
            {clientRegion && (
              <div>
                <dt className="text-[var(--color-text-muted)]">{cs.region_label}</dt>
                <dd className="text-[var(--color-text)] mt-1">{clientRegion}</dd>
              </div>
            )}
          </dl>
        )}
      </header>

      {/* 3. Cover image */}
      {caseStudy.image_url && (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 my-12">
          <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden border border-[var(--color-border)]">
            <Image
              src={caseStudy.image_url}
              alt={title}
              fill
              priority
              className="object-cover"
            />
          </div>
        </div>
      )}

      {/* 4. Before / After metrics */}
      {(beforeMetric || afterMetric || caseStudy.improvement_percent != null) && (
        <section className="max-w-5xl mx-auto px-4 sm:px-8 my-16 space-y-6">
          <h2 className="text-h3 font-display font-bold text-[var(--color-text)]">
            {cs.metrics_title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {beforeMetric && (
              <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
                <p className="kicker">{cs.before_label}</p>
                <p className="font-mono font-bold text-xl text-[var(--color-text-muted)] tabular-nums">
                  {beforeMetric}
                </p>
              </div>
            )}
            {afterMetric && (
              <div className="p-6 rounded-2xl bg-[var(--color-surface)] border border-emerald-500/30 space-y-2">
                <p className="kicker text-emerald-300">{cs.after_label}</p>
                <p className="font-mono font-bold text-xl text-emerald-300 tabular-nums">
                  {afterMetric}
                </p>
              </div>
            )}
            {caseStudy.improvement_percent != null && (
              <div className="p-6 rounded-2xl bg-[var(--color-accent-primary)]/8 border border-[var(--color-accent-primary)]/30 space-y-2">
                <p className="kicker text-[var(--color-accent-primary)]">
                  {cs.improvement_label}
                </p>
                <p className="font-mono font-bold text-xl text-[var(--color-accent-primary)] tabular-nums">
                  {caseStudy.improvement_percent}%
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 5. Body markdown */}
      {body && (
        <section className="max-w-3xl mx-auto px-4 sm:px-8 my-16 space-y-4">
          <h2 className="text-h3 font-display font-bold text-[var(--color-text)]">
            {cs.body_title}
          </h2>
          <div className="prose prose-invert max-w-none text-[var(--color-text)] font-body leading-relaxed
                          [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mt-10 [&_h2]:mb-4
                          [&_h3]:font-display [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3
                          [&_p]:my-4 [&_p]:text-[var(--color-text-muted)]
                          [&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6
                          [&_li]:my-2 [&_li]:text-[var(--color-text-muted)]
                          [&_strong]:text-[var(--color-text)] [&_strong]:font-semibold
                          [&_a]:text-[var(--color-accent-primary)] [&_a]:underline">
            <Markdown>{body}</Markdown>
          </div>
        </section>
      )}

      {/* 6. X-Ray grid */}
      {xray && (
        <section className="max-w-5xl mx-auto px-4 sm:px-8 my-16 space-y-6">
          <h2 className="text-h3 font-display font-bold text-[var(--color-text)]">
            {cs.xray_title}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <XRayItem label={cs.xray_architecture} value={xray.architecture} />
            <XRayItem
              label={cs.xray_stack}
              value={Array.isArray(xray.stack) ? xray.stack.join(' · ') : String(xray.stack)}
            />
            <XRayItem label={cs.xray_execution_time} value={xray.executionTime} />
            <XRayItem label={cs.xray_security} value={xray.security} />
          </div>
        </section>
      )}

      {/* 7. Static n8n flow diagram (mobile-friendly inline list) */}
      {n8nNodes.length > 0 && (
        <section className="max-w-5xl mx-auto px-4 sm:px-8 my-16 space-y-6">
          <h2 className="text-h3 font-display font-bold text-[var(--color-text)]">
            {cs.flow_title}
          </h2>
          <ol className="space-y-2 font-mono text-sm">
            {n8nNodes.map((n, i) => (
              <li
                key={n.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-[var(--color-surface)] border border-[var(--color-border)]"
              >
                <span className="text-[var(--color-text-muted)] tabular-nums w-6 text-right">
                  {i + 1}
                </span>
                <span
                  className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
                    n.type === 'trigger'
                      ? 'bg-cyan-500/10 text-cyan-300'
                      : n.type === 'output'
                        ? 'bg-emerald-500/10 text-emerald-300'
                        : n.type === 'condition'
                          ? 'bg-amber-500/10 text-amber-300'
                          : 'bg-[var(--color-accent-tertiary)]/10 text-[var(--color-accent-tertiary)]'
                  }`}
                >
                  {cs[nodeTypeKey[n.type]]}
                </span>
                <span className="text-[var(--color-text)] flex-1 truncate">{n.name}</span>
                {typeof n.latencyMs === 'number' && (
                  <span className="text-[var(--color-text-muted)] text-xs shrink-0">
                    {n.latencyMs}ms
                  </span>
                )}
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* 8. Links row */}
      {(caseStudy.demo_url || caseStudy.github_url) && (
        <section className="max-w-5xl mx-auto px-4 sm:px-8 my-16 space-y-4">
          <h2 className="text-h3 font-display font-bold text-[var(--color-text)]">
            {cs.links_title}
          </h2>
          <div className="flex flex-wrap gap-3 font-mono text-xs">
            {caseStudy.demo_url && (
              <a
                href={caseStudy.demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                <ExternalLinkIcon className="w-3.5 h-3.5" />
                {cs.live_demo}
              </a>
            )}
            {caseStudy.github_url && (
              <a
                href={caseStudy.github_url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                {cs.source_code}
              </a>
            )}
          </div>
        </section>
      )}

      {/* 9. CTA footer */}
      <section className="max-w-5xl mx-auto px-4 sm:px-8 my-16">
        <div className="p-8 sm:p-12 rounded-2xl bg-[var(--color-accent-primary)]/8 border border-[var(--color-accent-primary)]/30 text-center space-y-4">
          <h2 className="text-h2 font-display font-bold text-[var(--color-text)]">
            {cs.detail_cta_title}
          </h2>
          <p className="text-[var(--color-text-muted)] font-body max-w-2xl mx-auto">
            {cs.detail_cta_body}
          </p>
          <Link href={`/${locale}#contact`} className="btn btn-primary inline-flex">
            {cs.detail_cta_button}
            <ArrowRightIcon className="w-3.5 h-3.5 rtl:rotate-180" />
          </Link>
        </div>
      </section>

      {/* 10. Next case study */}
      {nextCaseStudy && (
        <nav
          aria-label={cs.next_case}
          className="max-w-5xl mx-auto px-4 sm:px-8 my-16 border-t border-[var(--color-border)] pt-10"
        >
          <Link
            href={`/${locale}/case-studies/${nextCaseStudy.slug}`}
            className="group flex items-center justify-between gap-4 p-6 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent-primary)] transition-colors"
          >
            <div className="space-y-1 min-w-0">
              <p className="kicker">{cs.next_case}</p>
              <p className="font-display font-bold text-lg text-[var(--color-text)] truncate">
                {getLocalizedField(nextCaseStudy.title_i18n, nextCaseStudy.title, locale)}
              </p>
            </div>
            <ArrowRightIcon className="w-5 h-5 text-[var(--color-accent-primary)] shrink-0 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </nav>
      )}
    </article>
  );
}

function XRayItem({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div className="p-5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] space-y-2">
      <p className="kicker">{label}</p>
      <p className="font-mono text-sm text-[var(--color-text)]">{value}</p>
    </div>
  );
}
