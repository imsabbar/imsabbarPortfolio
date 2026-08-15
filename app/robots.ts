import type { MetadataRoute } from 'next';

function siteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured) return configured.replace(/\/$/, '');
  return process.env.NODE_ENV === 'production' ? 'https://imsabbar.com' : 'http://localhost:3000';
}

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/uploads/'],
    },
    sitemap: `${siteUrl()}/sitemap.xml`,
  };
}
