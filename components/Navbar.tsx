'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { localeNames, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/types/dictionary';
import { ThemeToggle } from './ThemeToggle';
import { BrandLogo } from './BrandLogo';
import { trackEvent } from '@/lib/analytics';

const localePillLabels: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR',
  ar: 'عربي',
};

interface NavbarProps {
  dict: Dictionary;
  currentLocale: Locale;
  onOpenBooking?: () => void;
}

const SECTION_IDS = ['hero', 'work', 'services', 'pricing', 'about', 'faq', 'contact'] as const;
type SectionId = (typeof SECTION_IDS)[number];

export function Navbar({ dict, currentLocale, onOpenBooking }: NavbarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [hidden, setHidden] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 400, damping: 40 });

  const switchLocale = (newLocale: string) => {
    if (!pathname) return `/${newLocale}`;
    const segments = pathname.split('/');
    segments[1] = newLocale;
    // Preserve the current section anchor when switching languages.
    const hash = typeof window !== 'undefined' ? window.location.hash : '';
    return segments.join('/') + hash;
  };

  const navLinks = [
    { href: '#work', label: dict.nav.work, id: 'work' as SectionId },
    { href: '#services', label: dict.nav.services, id: 'services' as SectionId },
    { href: '#pricing', label: dict.nav.pricing, id: 'pricing' as SectionId },
    { href: '#about', label: dict.nav.about, id: 'about' as SectionId },
    { href: '#faq', label: 'FAQ', id: 'faq' as SectionId },
    { href: '#contact', label: dict.nav.contact, id: 'contact' as SectionId },
  ];

  // Scroll-spy: IntersectionObserver over home sections, never raw scroll
  // listeners for section detection (PRD §5.2).
  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Hide-on-scroll-down / show-on-scroll-up (PRD §5.2). Uses scroll direction,
  // not raw position, and only after a 120px delta.
  useEffect(() => {
    let lastY = window.scrollY;
    let ticking = false;

    const update = () => {
      ticking = false;
      const currentY = window.scrollY;
      const delta = currentY - lastY;
      if (Math.abs(delta) < 12) return;
      if (currentY < 120) {
        setHidden(false);
      } else if (delta > 0) {
        setHidden(true);
      } else if (delta < 0) {
        setHidden(false);
      }
      lastY = currentY;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      animate={{ y: hidden ? '-100%' : '0%' }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="sticky top-0 z-50 backdrop-blur-xl bg-[var(--color-bg)]/80 border-b border-[var(--color-border)] transition-colors shadow-sm"
    >
      {/* Scroll progress bar — PRD §5.2 */}
      <motion.div
        style={{ scaleX }}
        className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-cyan-400 via-purple-500 to-emerald-400 origin-left"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-20 sm:h-24 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link
          href={`/${currentLocale}`}
          className="flex items-center shrink-0 py-1 cursor-pointer rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--color-accent-primary)] focus-visible:outline-offset-4"
        >
          <BrandLogo size="md" />
        </Link>

        {/* Desktop Floating Magnetic Pill Navigation */}
        <nav
          onMouseLeave={() => setHoveredId(null)}
          className="hidden lg:flex items-center gap-1 p-1 rounded-2xl bg-[var(--color-surface)]/70 border border-[var(--color-border)]/80 backdrop-blur-md font-body text-xs xl:text-sm font-semibold shrink-0 relative shadow-2xs"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.id;
            const isHovered = hoveredId === link.id;

            return (
              <a
                key={link.href}
                href={link.href}
                onMouseEnter={() => setHoveredId(link.id)}
                aria-current={isActive ? 'true' : undefined}
                className={`relative px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors duration-200 z-10 flex items-center gap-1.5 select-none ${
                  isActive
                    ? 'text-cyan-700 dark:text-cyan-300 font-bold'
                    : isHovered
                    ? 'text-[var(--color-text)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                }`}
              >
                {/* Active Dot indicator */}
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shadow-xs shadow-cyan-500/50 shrink-0" />
                )}

                <span className="relative z-10">{link.label}</span>

                {/* Persistent Active Pill Background when not hovering */}
                {isActive && !hoveredId && (
                  <motion.div
                    layoutId="navbar-active-pill"
                    className="absolute inset-0 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/15 border border-cyan-500/30 -z-10 shadow-xs shadow-cyan-500/10"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                  />
                )}

                {/* Smooth Center-Expanding & Gliding Hover Pill */}
                {isHovered && (
                  <motion.div
                    layoutId="navbar-hover-pill"
                    initial={{ scale: 0.88, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.88, opacity: 0 }}
                    className="absolute inset-0 rounded-xl bg-cyan-500/10 dark:bg-cyan-500/20 border border-cyan-500/30 dark:border-cyan-500/40 -z-10 shadow-xs shadow-cyan-500/10"
                    transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <ThemeToggle label={dict.a11y.toggle_theme} />

          {/* Locale Switcher */}
          <div className="hidden lg:flex items-center gap-1 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl p-1 text-xs backdrop-blur-md shadow-2xs">
            {(Object.keys(localeNames) as Locale[]).map((loc) => (
              <Link
                key={loc}
                href={switchLocale(loc)}
                onClick={() => trackEvent('language_changed', { locale: loc })}
                className={`px-2.5 py-1 rounded-xl font-mono text-[11px] font-semibold transition-all duration-200 cursor-pointer ${
                  currentLocale === loc
                    ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold shadow-xs shadow-cyan-500/25 scale-[1.02]'
                    : 'text-[var(--color-text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15 hover:scale-105'
                }`}
              >
                {localePillLabels[loc] || loc.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <button
            type="button"
            onClick={() => (onOpenBooking ? onOpenBooking() : (window.location.href = '#contact'))}
            className="hidden lg:inline-flex btn btn-primary text-white cursor-pointer"
          >
            <span>{dict.nav.book_call}</span>
            <span className="btn-icon-hover inline-block">→</span>
          </button>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={dict.a11y.toggle_menu}
            aria-expanded={isMobileMenuOpen}
            className="lg:hidden p-2.5 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent-primary)] transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-6 space-y-5 overflow-hidden"
          >
            <nav className="flex flex-col space-y-1.5 font-body text-sm font-medium">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`px-4 py-2.5 rounded-xl transition-all flex items-center justify-between ${
                      isActive
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-700 dark:text-cyan-300 font-bold'
                        : 'text-[var(--color-text)] hover:bg-[var(--color-bg)]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-cyan-500 shadow-xs shadow-cyan-500/50" />}
                  </a>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
              <span className="text-xs font-mono text-[var(--color-text-muted)]">{dict.a11y.language_label}:</span>
              <div className="flex items-center gap-1 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl p-1 text-xs">
                {(Object.keys(localeNames) as Locale[]).map((loc) => (
                  <Link
                    key={loc}
                    href={switchLocale(loc)}
                    onClick={() => { trackEvent('language_changed', { locale: loc }); setIsMobileMenuOpen(false); }}
                    className={`px-2.5 py-1 rounded-lg font-mono text-[11px] font-semibold transition-all duration-200 ${
                      currentLocale === loc
                        ? 'bg-gradient-to-r from-cyan-500 to-teal-500 text-white font-bold shadow-xs shadow-cyan-500/25'
                        : 'text-[var(--color-text-muted)] hover:text-cyan-600 dark:hover:text-cyan-400 hover:bg-cyan-500/10 dark:hover:bg-cyan-500/15'
                    }`}
                  >
                    {localePillLabels[loc] || loc.toUpperCase()}
                  </Link>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setIsMobileMenuOpen(false);
                if (onOpenBooking) onOpenBooking();
                else window.location.href = '#contact';
              }}
              className="w-full btn btn-primary text-white"
            >
              {dict.nav.book_call}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
