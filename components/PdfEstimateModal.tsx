'use client';

import React from 'react';
import type { Dictionary } from '@/types/dictionary';
import { Modal } from '@/components/ui/Modal';
import type { Locale } from '@/i18n/config';
import type { Currency } from '@/lib/currency';
import { PrinterIcon } from '@/components/icons';

interface PdfEstimateModalProps {
  isOpen: boolean;
  onClose: () => void;
  dict: Dictionary;
  locale: Locale;
  planId: number | null;
  currency: Currency;
}

export function PdfEstimateModal({ isOpen, onClose, dict, locale, planId, currency }: PdfEstimateModalProps) {
  const [status, setStatus] = React.useState<'idle' | 'loading' | 'error'>('idle');
  const handleDownload = async () => {
    if (!planId) return;
    setStatus('loading');
    try {
      const response = await fetch('/api/estimate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ plan_id: planId, currency, locale }) });
      if (!response.ok) throw new Error('estimate_failed');
      const blob = await response.blob();
      const disposition = response.headers.get('Content-Disposition') ?? '';
      const serverFilename = disposition.match(/filename="([^"]+)"/)?.[1];
      const filename = serverFilename || `estimate-${currency}.pdf`;
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a'); anchor.href = url; anchor.download = filename; anchor.click(); URL.revokeObjectURL(url);
      setStatus('idle');
    } catch { setStatus('error'); }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={dict.pdf.title}
      subtitle={dict.pdf.kicker}
      closeLabel={dict.common.close}
      maxWidth="max-w-2xl"
    >
      <p className="text-sm text-[var(--color-text-muted)]">{dict.pdf.disclaimer}</p>
      {status === 'error' && <p role="alert" className="text-xs text-red-300">{dict.pdf.error}</p>}

      <div className="flex items-center gap-4 mt-6 print:hidden">
        <button
          type="button"
          onClick={() => void handleDownload()}
          disabled={status === 'loading' || !planId}
          className="flex-1 btn btn-primary"
        >
          <PrinterIcon className="w-4 h-4" />
          {status === 'loading' ? dict.pdf.loading : dict.pdf.download}
        </button>
      </div>
    </Modal>
  );
}
