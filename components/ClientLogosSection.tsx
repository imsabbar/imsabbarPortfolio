import React from 'react';
import Image from 'next/image';
import type { Dictionary } from '@/types/dictionary';
import type { ClientLogo } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { getLocalizedField } from '@/lib/db/helpers';
import { Reveal } from '@/motion/Reveal';

function safeWebsiteUrl(value: string | null): string | null {
  if (!value) return null;
  try { const url = new URL(value); return url.protocol === 'https:' ? url.toString() : null; }
  catch { return null; }
}

function safeAssetUrl(value: string): string | null {
  try { const url = new URL(value); return url.protocol === 'https:' && url.hostname === 'assets.imsabbar.com' ? url.toString() : null; }
  catch { return null; }
}

function LogoImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-12 w-24 sm:w-28">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="96px"
        className="object-contain grayscale opacity-70 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100 group-focus-visible:grayscale-0 group-focus-visible:opacity-100"
      />
    </div>
  );
}

export function ClientLogosSection({ dict, logos, locale }: { dict: Dictionary; logos: ClientLogo[]; locale: Locale }) {
  if (logos.length === 0) return null;
  return (
    <section id="client-logos" className="py-14 border-b border-[var(--color-border)]" aria-labelledby="logos-title">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-8">
        <h2 id="logos-title" className="text-center text-sm font-mono uppercase tracking-[0.2em] text-[var(--color-text-muted)]">{dict.sections.logos_title}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 items-stretch">
          {logos.map((logo, idx) => {
            const imageUrl = safeAssetUrl(logo.logo_url);
            if (!imageUrl) return null;
            const alt = getLocalizedField(logo.company_name_i18n, logo.company_name, locale);
            const link = safeWebsiteUrl(logo.website_url);
            return (
              <Reveal key={logo.id} index={idx}>
                {link
                  ? <a href={link} target="_blank" rel="noopener noreferrer" className="group min-h-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center p-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)]"><LogoImage src={imageUrl} alt={alt} /></a>
                  : <div className="group min-h-24 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] flex items-center justify-center p-5"><LogoImage src={imageUrl} alt={alt} /></div>}
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
