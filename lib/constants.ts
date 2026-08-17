/**
 * Shared site-wide constants.
 *
 * ROLE AFTER PHASE 2 (PRD §6.2, §7.4):
 *   Every value here is the **static fallback**. The DB (`portfolio_settings`
 *   via `findSettingsCached()`) is the source of truth at runtime, and any
 *   home-page section component that needs a value reads it from
 *   `HomePageData.settings` (see `lib/sections`).
 *
 *   This file remains so that:
 *     1. Components OUTSIDE the home page (MobileBottomBar, WhatsAppWidget,
 *        etc.) that still take the legacy hardcoded path have something to read.
 *     2. Dev mode without MySQL has a complete set of values to render against.
 *
 *   Do not add NEW hardcoded site values here — put them in the DB and the
 *   `PortfolioSettings` type instead.
 */

export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (configured && !configured.includes('localhost') && !configured.includes('127.0.0.1')) {
    return configured.replace(/\/$/, '');
  }
  return 'https://imsabbar.com';
}

export const SITE = {
  name: 'Ismail Sabbar',
  role: 'Full-Stack Developer & Automation Engineer',
  url: getSiteUrl(),
} as const;

/** Localized display name. Arabic uses إسماعيل صبار; FR/EN use the Latin name. */
export function displayNameForLocale(locale?: string): string {
  return locale === 'ar' ? 'إسماعيل صبار' : 'Ismail Sabbar';
}

export const CONTACT = {
  email: 'contact@imsabbar.com',
  phoneDisplay: '+212 681 51 00 95',
  phoneIntl: '212681510095',
} as const;

export const whatsappUrl = (message?: string): string =>
  `https://wa.me/${CONTACT.phoneIntl}${message ? `?text=${encodeURIComponent(message)}` : ''}`;

export const SOCIAL_LINKS = {
  linkedin: 'https://www.linkedin.com/in/sabbarismail/',
  github: 'https://github.com/imsabbar',
  youtube: 'https://www.youtube.com/@imsabbar',
  telegram: 'https://t.me/imsabbar',
  whatsapp: whatsappUrl(),
  email: `mailto:${CONTACT.email}`,
} as const;

/**
 * Fallback ICE / Tax ID shown until `portfolio_settings.ice_registration_number`
 * is available.
 * The database setting is the runtime source of truth; this value is only used
 * when the database is unavailable in local development.
 */
export const FALLBACK_ICE_NUMBER = '003294812000045';

/** Fallback resume filenames until `resume_{locale}_filename` settings are wired. */
export const RESUME_FILES = {
  en: 'imsabbar_MEN_V25.9.pdf',
  fr: 'imsabbar_MFR_V25.9.pdf',
  // PRD §7.3 — ar falls back to the EN resume until a dedicated AR file exists.
  ar: 'imsabbar_MEN_V25.9.pdf',
} as const;
