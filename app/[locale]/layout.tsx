import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Inter, IBM_Plex_Mono, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { i18n, isRTL, type Locale } from '@/i18n/config';
import { Preloader } from '@/components/Preloader';
import '../globals.css';

/* PRD §4.2 — font stack */
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-display',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-body',
  display: 'swap',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ar',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://imsabbar.com'),
  title: {
    default: 'Ismail Sabbar | Full-Stack Developer & Automation Engineer',
    template: '%s | Ismail Sabbar',
  },
  description: 'Specializing in n8n workflow automation, Perfex CRM module engineering, and WordPress/Next.js web builds.',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon', sizes: '48x48', type: 'image/png' },
    ],
    shortcut: '/favicon.svg',
    apple: '/icon',
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
    yandex: process.env.NEXT_PUBLIC_YANDEX_SITE_VERIFICATION || undefined,
    other: {
      'msvalidate.01': process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || '',
    },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#0B0F19' },
    { media: '(prefers-color-scheme: light)', color: '#F8FAFC' },
  ],
};

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ locale }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale || i18n.defaultLocale;
  const rtl = isRTL(locale);

  return (
    <html
      lang={locale}
      dir={rtl ? 'rtl' : 'ltr'}
      data-theme="dark"
      suppressHydrationWarning
      className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} ${ibmPlexSansArabic.variable}`}
      style={
        rtl
          ? {
              // PRD §4.2 — Arabic renders all roles in IBM Plex Sans Arabic.
              // Inline custom properties override the class-level ones on <html>.
              ['--font-display' as string]: 'var(--font-ar)',
              ['--font-body' as string]: 'var(--font-ar)',
            } as React.CSSProperties
          : undefined
      }
    >
      <head>
        {/* FOUC Guard Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme') || 'dark';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <Preloader />
        {children}
      </body>
    </html>
  );
}
