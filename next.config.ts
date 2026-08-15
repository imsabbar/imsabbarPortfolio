import type { NextConfig } from 'next';

const isDev = process.env.NODE_ENV === 'development';
const configuredCalOrigins = (process.env.NEXT_PUBLIC_CAL_EMBED_ALLOWED_ORIGINS ?? '')
  .split(',')
  .map((value) => value.trim())
  .filter(Boolean)
  .map((value) => {
    try {
      const url = new URL(value);
      if (url.protocol !== 'https:' || url.pathname !== '/' || url.search || url.hash) throw new Error('Cal.com origins must be HTTPS origins without a path');
      return url.origin;
    } catch {
      throw new Error(`Invalid NEXT_PUBLIC_CAL_EMBED_ALLOWED_ORIGINS value: ${value}`);
    }
  });
const calOrigins = Array.from(new Set(['https://cal.com', 'https://app.cal.com', ...configuredCalOrigins]));

/**
 * PRD §12.4 — Security headers.
 * CSP allowances are REQUIRED for Cloudflare Turnstile (challenges.cloudflare.com),
 * Cloudflare Beacon/Zaraz, and the Cal.com embed — they silently break without them.
 * 'unsafe-eval' is added in dev only (Next.js HMR requirement).
 */
const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${isDev ? "'unsafe-eval' " : ''}https://challenges.cloudflare.com https://static.cloudflareinsights.com https://ajax.cloudflare.com https://app.cal.com`,
  `frame-src https://challenges.cloudflare.com ${calOrigins.join(' ')}`,
  "img-src 'self' data: https://assets.imsabbar.com",
  "style-src 'self' 'unsafe-inline'",
  "font-src 'self'",
  `connect-src 'self' https://challenges.cloudflare.com https://cloudflareinsights.com ${calOrigins.join(' ')}`,
].join('; ');

const securityHeaders = [
  { key: 'Content-Security-Policy', value: contentSecurityPolicy },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
];

const nextConfig: NextConfig = {
  // PRD §14.1 — Hostinger shared hosting standalone build.
  output: 'standalone',
  images: {
    formats: ['image/avif', 'image/webp'],
    // PRD §10.3 — case-study covers & client logos are served from the asset CDN.
    remotePatterns: [
      { protocol: 'https', hostname: 'assets.imsabbar.com', pathname: '/portfolio/**' },
    ],
  },
  // Ensure MySQL module isn't loaded on client side
  serverExternalPackages: ['mysql2'],
  async headers() {
    return [{ source: '/:path*', headers: securityHeaders }];
  },
};

export default nextConfig;
