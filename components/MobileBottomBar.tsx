'use client';

import React from 'react';
import type { Dictionary } from '@/types/dictionary';
import { whatsappUrl } from '@/lib/constants';
import { CalendarIcon, MessageCircleIcon } from '@/components/icons';
import { trackWhatsAppClick } from '@/lib/analytics';

interface MobileBottomBarProps {
  dict: Dictionary;
  onOpenBooking?: () => void;
  /** DB-driven WhatsApp number; falls back to the legacy constant when absent. */
  phone?: string;
}

function phoneToDigits(phone?: string): string {
  return (phone ?? '').replace(/\D/g, '');
}

export function MobileBottomBar({ dict, onOpenBooking, phone }: MobileBottomBarProps) {
  const digits = phoneToDigits(phone);
  const waHref = digits ? `https://wa.me/${digits}` : whatsappUrl();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 lg:hidden p-3 bg-[var(--color-surface)]/90 backdrop-blur-lg border-t border-[var(--color-border)] shadow-2xl pb-safe">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2 font-mono text-xs">
        {/* Book Call */}
        <button
          type="button"
          onClick={() => (onOpenBooking ? onOpenBooking() : (window.location.href = '#contact'))}
          className="py-2.5 px-3 rounded-xl bg-[var(--color-accent-primary)] text-white font-semibold text-center flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-transform"
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span className="truncate">{dict.hero.cta_book}</span>
        </button>

        {/* WhatsApp */}
        <a
          href={waHref}
          onClick={() => trackWhatsAppClick()}
          target="_blank"
          rel="noopener noreferrer"
          className="py-2.5 px-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-semibold text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <MessageCircleIcon className="w-3.5 h-3.5 text-emerald-400" />
          <span>{dict.common.whatsapp_chat}</span>
        </a>

        {/* Pricing */}
        <a
          href="#pricing"
          className="py-2.5 px-3 rounded-xl bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text)] font-medium text-center flex items-center justify-center gap-1.5 active:scale-95 transition-transform"
        >
          <svg className="w-3.5 h-3.5 stroke-current fill-none stroke-2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="truncate">{dict.nav.pricing}</span>
        </a>
      </div>
    </div>
  );
}
