import React from 'react';
import type { FAQ } from '@/types/portfolio';
import type { Locale } from '@/i18n/config';
import { getLocalizedField } from '@/lib/db/helpers';

interface JsonLdProps {
  locale?: Locale;
  faqs?: FAQ[];
}

export function JsonLd({ locale = 'en', faqs = [] }: JsonLdProps) {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ismail Sabbar',
    alternateName: ['إسماعيل صبار', 'Ismail Sabbar | Full-Stack Developer & Automation Engineer'],
    jobTitle: 'Senior Full-Stack Developer & Automation Engineer',
    url: 'https://imsabbar.com',
    image: 'https://imsabbar.com/brand_assets/sabbar-ismail-shoot.webp',
    sameAs: [
      'https://www.linkedin.com/in/sabbarismail/',
      'https://github.com/imsabbar',
      'https://www.youtube.com/@imsabbar',
      'https://t.me/imsabbar',
    ],
    knowsAbout: [
      'n8n workflow automation',
      'Perfex CRM module engineering',
      'Next.js 15 Web Applications',
      'API Integration & Webhooks',
      'Workflow Architecture',
      'PHP & MySQL Engineering',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Morocco',
    },
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Ismail Sabbar | Automation & CRM Engineering',
    url: 'https://imsabbar.com',
    image: 'https://imsabbar.com/brand_assets/sabbar-ismail-shoot.webp',
    telephone: '+212681510095',
    email: 'contact@imsabbar.com',
    priceRange: '$$$',
    taxID: '003294812000045',
    areaServed: ['Worldwide', 'Morocco', 'Europe', 'GCC', 'United States'],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Morocco',
    },
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Ismail Sabbar — Senior Developer & Automation Engineer',
    url: 'https://imsabbar.com',
    inLanguage: ['en', 'fr', 'ar'],
  };

  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: getLocalizedField(faq.question_i18n, faq.question, locale),
            acceptedAnswer: {
              '@type': 'Answer',
              text: getLocalizedField(faq.answer_i18n, faq.answer, locale),
            },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
    </>
  );
}
