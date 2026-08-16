'use client';

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { type Locale } from '@/i18n/config';
import type { Dictionary } from '@/types/dictionary';
import type { HomePageData } from '@/lib/sections';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { B2BTrustBadge } from '@/components/B2BTrustBadge';
import { CaseStudyGrid } from '@/components/CaseStudyGrid';
import { ServicesGrid } from '@/components/ServicesGrid';
import { TechStackBanner } from '@/components/TechStackBanner';
import { TestimonialCarousel } from '@/components/TestimonialCarousel';
import { PricingMatrix } from '@/components/PricingMatrix';
import { About } from '@/components/About';
import { LeadForm } from '@/components/LeadForm';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';
import { FaqSection } from '@/components/FaqSection';
import { ClientLogosSection } from '@/components/ClientLogosSection';
import { SocialLinks } from '@/components/SocialLinks';
import { Footer } from '@/components/Footer';
import { AmbientGlowBackground } from '@/components/ui/AmbientGlowBackground';
import type { Currency } from '@/lib/currency';

// PRD §12.3 — heavy client-only widgets are code-split with `ssr: false` so
// they don't inflate the server-rendered home page bundle.
const RoiCalculator = dynamic(() => import('@/components/RoiCalculator').then((m) => m.RoiCalculator), { ssr: false });
const BookingGateModal = dynamic(() => import('@/components/BookingGateModal').then((m) => m.BookingGateModal), { ssr: false });
const PdfEstimateModal = dynamic(() => import('@/components/PdfEstimateModal').then((m) => m.PdfEstimateModal), { ssr: false });

interface ClientHomeShellProps {
  dict: Dictionary;
  locale: Locale;
  /** Phase 2: DB-driven section data from `getHomePageSections()`. */
  sections: HomePageData;
  /** P3.4: server-resolved currency, from `resolveServerCurrency()`. */
  initialCurrency: Currency;
}

export function ClientHomeShell({ dict, locale, sections, initialCurrency }: ClientHomeShellProps) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isPdfEstimateOpen, setIsPdfEstimateOpen] = useState(false);
  const [pdfPlanId, setPdfPlanId] = useState<number | null>(null);
  const [pdfCurrency, setPdfCurrency] = useState<Currency>(initialCurrency);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg)] text-[var(--color-text)] relative selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Living Ambient Lighting Layer */}
      <AmbientGlowBackground />

      {/* Skip to content — PRD §4.11 */}
      <a href="#main" className="skip-link">
        {dict.a11y.skip_to_content}
      </a>

      <Navbar dict={dict} currentLocale={locale} onOpenBooking={() => setIsBookingOpen(true)} />

      <main id="main" className="flex-grow relative z-10">
        <Hero
          dict={dict}
          currentLocale={locale}
          availabilityStatus={sections.settings.availability_status}
          availabilityMessage={sections.contentBlocks.hero?.availability_message}
          specChips={sections.contentBlocks.hero?.spec_chips ?? []}
          socialLinks={sections.settings.social_links}
          onOpenBooking={() => setIsBookingOpen(true)}
        />

        {sections.contentBlocks.trust_bar && sections.settings.ice_registration_number && (
          <B2BTrustBadge
            dict={dict}
            locale={locale}
            badge={sections.contentBlocks.trust_bar.badge ?? ''}
            iceNumber={sections.settings.ice_registration_number}
          />
        )}

        <div className="section-divider-glow" aria-hidden="true" />

        {sections.caseStudies.length > 0 && (
          <CaseStudyGrid
            dict={dict}
            caseStudies={sections.caseStudies}
            featuredCaseStudy={sections.featuredCaseStudy}
          />
        )}

        <div className="section-divider-glow" aria-hidden="true" />

        {sections.services.length > 0 && <ServicesGrid dict={dict} services={sections.services} />}

        <div className="section-divider-glow" aria-hidden="true" />

        {sections.techStack.length > 0 && <TechStackBanner dict={dict} techStack={sections.techStack} />}

        <div className="section-divider-glow" aria-hidden="true" />

        <RoiCalculator dict={dict} initialCurrency={initialCurrency} />

        <div className="section-divider-glow" aria-hidden="true" />

        {sections.testimonials.length > 0 && (
          <TestimonialCarousel dict={dict} testimonials={sections.testimonials} />
        )}

        <ClientLogosSection dict={dict} logos={sections.clientLogos} locale={locale} />

        <div className="section-divider-glow" aria-hidden="true" />

        {sections.plans.length > 0 && (
          <PricingMatrix
            dict={dict}
            initialCurrency={initialCurrency}
            plans={sections.plans}
            onOpenPdfEstimate={(planId, currency) => { setPdfPlanId(planId); setPdfCurrency(currency); setIsPdfEstimateOpen(true); }}
          />
        )}

        <div className="section-divider-glow" aria-hidden="true" />

        <FaqSection dict={dict} faqs={sections.faqs} locale={locale} onOpenBooking={() => setIsBookingOpen(true)} />

        <div className="section-divider-glow" aria-hidden="true" />

        {sections.contentBlocks.about && (
          <About
            dict={dict}
            about={sections.contentBlocks.about}
            statsValues={{
              years: sections.settings.stats_years_value,
              clients: sections.settings.stats_clients_value,
              projects: sections.settings.stats_projects_value,
              reliability: sections.settings.stats_reliability_value ?? '99.8%',
            }}
          />
        )}

        <div className="section-divider-glow" aria-hidden="true" />

        <LeadForm
          dict={dict}
          settings={sections.settings}
          contact={sections.contentBlocks.contact}
          initialCurrency={initialCurrency}
          locale={locale}
          services={sections.services}
        />
      </main>

      <WhatsAppWidget dict={dict} phone={sections.settings.contact_phone} />

      <BookingGateModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        dict={dict}
        locale={locale}
        settings={sections.settings}
      />
      <PdfEstimateModal
        isOpen={isPdfEstimateOpen}
        onClose={() => setIsPdfEstimateOpen(false)}
        dict={dict}
        locale={locale}
        planId={pdfPlanId ?? sections.plans.find((plan) => plan.is_popular)?.id ?? sections.plans[0]?.id ?? null}
        currency={pdfCurrency}
      />

      {/* Executive 3-Column Footer */}
      <Footer dict={dict} locale={locale} settings={sections.settings} />
    </div>
  );
}
