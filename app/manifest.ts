import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Ismail Sabbar — Automation & CRM Engineer',
    short_name: 'imsabbar',
    description: 'Senior Full-Stack Developer specializing in n8n automation, Perfex CRM modules, and high-performance Next.js web applications.',
    start_url: '/en',
    display: 'standalone',
    background_color: '#07111F',
    theme_color: '#0891B2',
    icons: [
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  };
}
