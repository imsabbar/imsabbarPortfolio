'use client';

import React from 'react';
import type { Dictionary } from '@/types/dictionary';
import { whatsappUrl } from '@/lib/constants';
import { trackWhatsAppClick } from '@/lib/analytics';

interface WhatsAppWidgetProps {
  dict: Dictionary;
  /** DB-driven WhatsApp number; falls back to the legacy constant when absent. */
  phone?: string;
}

function phoneToDigits(phone?: string): string {
  return (phone ?? '').replace(/\D/g, '');
}

export function WhatsAppWidget({ dict, phone }: WhatsAppWidgetProps) {
  const digits = phoneToDigits(phone);
  const url = digits
    ? `https://wa.me/${digits}?text=${encodeURIComponent(dict.common.whatsapp_prefill)}`
    : whatsappUrl(dict.common.whatsapp_prefill);

  return (
    <a
      href={url}
      onClick={() => trackWhatsAppClick()}
      target="_blank"
      rel="noopener noreferrer"
      title={dict.a11y.open_whatsapp}
      className="fixed bottom-6 sm:bottom-8 right-5 sm:right-8 z-40 p-3.5 rounded-full bg-emerald-500 text-white shadow-2xl hover:scale-110 active:scale-95 transition-transform flex items-center justify-center border-2 border-white/20 group"
    >
      <span className="sr-only">{dict.a11y.open_whatsapp}</span>
      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981z" />
      </svg>
    </a>
  );
}
