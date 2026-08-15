'use client';

import React from 'react';
import Link from 'next/link';
import type { Dictionary } from '@/types/dictionary';
import type { PortfolioSettings } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { SocialLinks } from '@/components/SocialLinks';
import { BrandLogo } from '@/components/BrandLogo';
import {
  MailIcon,
  PhoneIcon,
  MessageCircleIcon,
  ShieldCheckIcon,
  LayersIcon,
  BoltIcon,
  ArrowRightIcon,
} from '@/components/icons';
import { trackWhatsAppClick } from '@/lib/analytics';

interface FooterProps {
  dict: Dictionary;
  locale: Locale;
  settings: PortfolioSettings;
}

function phoneToIntl(phone: string): string {
  return phone.replace(/\D/g, '');
}

export function Footer({ dict, locale, settings }: FooterProps) {
  const whatsappHref = `https://wa.me/${phoneToIntl(settings.contact_phone)}`;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-surface)] relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 left-1/3 w-[500px] h-[300px] glow glow--secondary opacity-10 pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 lg:py-20 space-y-12 relative">
        {/* Top 3-Column Executive Architecture Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Column 1 (5 Cols): Identity, Mission & Trust Credentials */}
          <div className="lg:col-span-5 space-y-5">
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <BrandLogo size="md" />
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500/30 text-[10px] font-mono font-bold shadow-xs">
                  <span className="status-dot status-dot--online" />
                  Available
                </span>
              </div>
              <p className="text-xs font-mono text-[var(--color-text-muted)]">
                Systems Architecture &amp; Workflow Automation Consultant
              </p>
            </div>

            <p className="text-xs sm:text-sm font-body text-[var(--color-text-muted)] leading-relaxed max-w-sm">
              High-velocity automation pipelines, custom Perfex CRM systems, and high-speed web architectures engineered for B2B scale.
            </p>

            {/* Official Registration Credential Badge */}
            {settings.ice_registration_number && (
              <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)] shadow-xs">
                <ShieldCheckIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0" />
                <span dir="ltr">
                  {dict.trust.ice_label}: <strong className="text-[var(--color-text)]">{settings.ice_registration_number}</strong>
                </span>
              </div>
            )}
          </div>

          {/* Column 2 (3 Cols): System Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <p className="text-xs font-mono font-bold text-[var(--color-text)] uppercase tracking-wider">
              System Navigation
            </p>
            <ul className="space-y-2.5 text-xs font-mono text-[var(--color-text-muted)]">
              <li>
                <a href="#work" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                  <span className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  <span>{dict.sections.work_title}</span>
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                  <span className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  <span>{dict.sections.services_title}</span>
                </a>
              </li>
              <li>
                <a href="#tech" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                  <span className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  <span>{dict.sections.tech_title}</span>
                </a>
              </li>
              <li>
                <a href="#roi" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                  <span className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  <span>{dict.sections.roi_title}</span>
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                  <span className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  <span>{dict.sections.pricing_title}</span>
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-cyan-600 dark:hover:text-cyan-400 transition-colors flex items-center gap-1.5 group">
                  <span className="text-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  <span>{dict.sections.faq_title}</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 (4 Cols): Direct Dispatch Channels & Socials */}
          <div className="lg:col-span-4 space-y-5">
            <p className="text-xs font-mono font-bold text-[var(--color-text)] uppercase tracking-wider">
              Direct Dispatch
            </p>

            <div className="space-y-3 font-mono text-xs">
              <a
                href={`mailto:${settings.contact_email}`}
                className="p-3.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:border-cyan-500/40 flex items-center gap-3 transition-all group"
              >
                <MailIcon className="w-4 h-4 text-cyan-600 dark:text-cyan-400 shrink-0 group-hover:scale-110 transition-transform" />
                <span className="truncate text-[var(--color-text)] font-semibold">{settings.contact_email}</span>
              </a>

              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick()}
                className="p-3.5 rounded-xl bg-[var(--color-surface-raised)] border border-[var(--color-border)] hover:border-emerald-500/50 hover:bg-emerald-500/5 flex items-center justify-between gap-3 transition-all group"
              >
                <div className="flex items-center gap-3 truncate">
                  <MessageCircleIcon className="w-4 h-4 text-emerald-500 shrink-0 group-hover:scale-110 transition-transform" />
                  <span className="truncate text-[var(--color-text)] font-semibold">{settings.contact_phone}</span>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-[10px] font-mono font-bold shrink-0">
                  <span className="status-dot status-dot--online !w-1.5 !h-1.5" />
                  WhatsApp
                </span>
              </a>
            </div>

            <div className="pt-1">
              <SocialLinks links={settings.social_links} />
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Signature Quote & Privacy */}
        <div className="pt-8 border-t border-[var(--color-border)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-[var(--color-text-muted)]">
          <p>
            &copy; {currentYear} Ismail Sabbar (imsabbar) · {dict.footer.rights}
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <span className="text-[11px] opacity-75 italic">
              &ldquo;Engineered with care. Shipped with intent.&rdquo;
            </span>
            <Link
              href={`/${locale}/privacy`}
              className="text-cyan-600 dark:text-cyan-400 hover:underline font-semibold"
            >
              {dict.footer.privacy_link}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
