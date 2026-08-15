'use client';

import React from 'react';
import Image from 'next/image';
import type { Dictionary } from '@/types/dictionary';
import { Modal } from '@/components/ui/Modal';
import type { CaseStudyXRaySpecs } from '@/types/portfolio';
import { CpuChipIcon, ClockIcon, LayersIcon, ShieldCheckIcon } from '@/components/icons';

interface XRayDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  dict: Dictionary;
  /** Phase 2: DB-driven specs (may be null when no xray row is attached). */
  specs?: CaseStudyXRaySpecs | null;
  title: string;
}

export function XRayDrawer({ isOpen, onClose, dict, specs, title }: XRayDrawerProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      subtitle={dict.xray.title}
      closeLabel={dict.common.close}
      maxWidth="max-w-2xl"
    >
      {/* Workstation & Architecture Frame */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[var(--color-border)] mb-6 shadow-md">
        <Image
          src="/brand_assets/ismail-sabbar-architect-workstation.webp"
          alt="Ismail Sabbar Workstation & Architecture"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-3 left-4 flex items-center gap-2 text-white text-xs font-mono">
          <span className="status-dot status-dot--online" />
          <span>Production Architecture Topology</span>
        </div>
      </div>

      {/* Specs Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
        {/* Architecture */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-cyan-400">
            <CpuChipIcon className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {dict.xray.architecture}
            </span>
          </div>
          <p className="text-[var(--color-text)] font-bold text-sm">
            {specs?.architecture || 'Microservices & Event Pipeline'}
          </p>
        </div>

        {/* Execution Time */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
            <ClockIcon className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {dict.xray.execution_time}
            </span>
          </div>
          <p className="text-[var(--color-text)] font-bold text-sm">
            {specs?.executionTime || '< 120ms Latency'}
          </p>
        </div>

        {/* Tech Stack */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400">
            <LayersIcon className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {dict.xray.stack}
            </span>
          </div>
          <p className="text-[var(--color-text)] font-bold text-sm">
            {specs?.stack?.length ? specs.stack.join(', ') : 'Next.js, TypeScript, Tailwind, REST API'}
          </p>
        </div>

        {/* Security */}
        <div className="p-4 rounded-2xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] space-y-2">
          <div className="flex items-center gap-2 text-sky-600 dark:text-sky-400">
            <ShieldCheckIcon className="w-4 h-4" />
            <span className="text-[11px] font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
              {dict.xray.security}
            </span>
          </div>
          <p className="text-[var(--color-text)] font-bold text-sm">
            {specs?.security || 'HMAC SHA-256 Signature Verification'}
          </p>
        </div>
      </div>
    </Modal>
  );
}
