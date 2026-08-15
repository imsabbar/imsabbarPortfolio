import React from 'react';

export function JsonLd() {
  const personSchema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Ismail Sabbar',
    alternateName: ['إسماعيل صبار', 'Ismail Sabbar | Full-Stack Developer & Automation Engineer'],
    knowsAbout: ['n8n workflow automation', 'Perfex CRM module engineering', 'WordPress', 'Next.js'],
    url: 'https://imsabbar.com',
  };

  const serviceSchema = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: 'Ismail Sabbar | Automation & CRM Engineering',
    priceRange: '$$$',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'Morocco',
    },
  };

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
    </>
  );
}
