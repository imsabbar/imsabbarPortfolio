import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from '@/i18n/config';

function getCurrencyForCountry(countryCode?: string): string {
  if (!countryCode) return 'USD';
  const country = countryCode.toUpperCase();
  if (country === 'MA') return 'MAD';
  if (['AE', 'SA', 'QA', 'KW', 'BH', 'OM'].includes(country)) return 'AED';
  if (country === 'GB') return 'GBP';
  if (['FR', 'DE', 'ES', 'IT', 'NL', 'BE', 'LU', 'AT', 'IE', 'PT', 'FI', 'GR'].includes(country)) return 'EUR';
  return 'USD';
}

function getLocaleFromHeader(request: NextRequest): string {
  const acceptLanguage = request.headers.get('accept-language');
  if (!acceptLanguage) return i18n.defaultLocale;

  if (acceptLanguage.includes('fr')) return 'fr';
  if (acceptLanguage.includes('ar')) return 'ar';
  return 'en';
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Ignore static assets, api routes, metadata endpoints, and asset files
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/brand_assets') ||
    pathname.startsWith('/uploads') ||
    pathname === '/icon' ||
    pathname === '/icon.png' ||
    pathname === '/manifest.webmanifest' ||
    pathname === '/llms.txt' ||
    pathname === '/llms-full.txt' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // Check if pathname already has a supported locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  const response = pathnameHasLocale
    ? NextResponse.next()
    : NextResponse.redirect(
        new URL(`/${getLocaleFromHeader(request)}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
      );

  // Set Geo-IP currency cookie if not already explicitly selected by user
  const currentCurrencyCookie = request.cookies.get('currency_preference')?.value;
  if (!currentCurrencyCookie) {
    const geoCountry =
      request.headers.get('cf-ipcountry') ||
      (request as any).geo?.country ||
      request.headers.get('x-vercel-ip-country') ||
      undefined;
    const detectedCurrency = getCurrencyForCountry(geoCountry);
    response.cookies.set('detected_currency', detectedCurrency, {
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
