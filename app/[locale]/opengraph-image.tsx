import { ImageResponse } from 'next/og';
import { i18n, isRTL, type Locale } from '@/i18n/config';
import { getDictionary } from '@/lib/get-dictionary';
import { displayNameForLocale } from '@/lib/constants';

export const runtime = 'nodejs';
export const alt = 'Ismail Sabbar — Automation & CRM Engineering';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface ImageProps {
  params: Promise<{ locale: string }>;
}

export default async function OpenGraphImage({ params }: ImageProps) {
  const { locale: rawLocale } = await params;
  const locale = (i18n.locales as readonly string[]).includes(rawLocale)
    ? (rawLocale as Locale)
    : i18n.defaultLocale;
  const dict = await getDictionary(locale);
  const rtl = isRTL(locale);
  const displayName = displayNameForLocale(locale);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 84px',
          background: '#07111f',
          color: '#f2f7fb',
          fontFamily: 'sans-serif',
          direction: rtl ? 'rtl' : 'ltr',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(rgba(52,211,235,.10) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,235,.10) 1px, transparent 1px)',
            backgroundSize: '42px 42px',
            opacity: 0.45,
          }}
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, position: 'relative' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, color: '#67e8f9', fontSize: 24, letterSpacing: 3 }}>
            <span style={{ width: 12, height: 12, borderRadius: 999, background: '#67e8f9' }} />
            {displayName.toUpperCase()}
          </div>
          <div style={{ fontSize: 62, lineHeight: 1.08, fontWeight: 700, maxWidth: 930 }}>
            {dict.hero.headline}
          </div>
          <div style={{ fontSize: 28, lineHeight: 1.35, color: '#a9bac9', maxWidth: 860 }}>
            {dict.hero.subhead}
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', position: 'relative', color: '#67e8f9', fontSize: 22 }}>
          <span>n8n · CRM · Next.js</span>
          <span>{locale.toUpperCase()}</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
