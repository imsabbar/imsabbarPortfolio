/**
 * Sections data layer — the bridge between repositories and components.
 *
 * This is the **only** function the page-level components should call.
 * It:
 *  1. Fans out to all `*Cached` repos in parallel (Promise.all).
 *  2. Resolves the i18n JSON columns to the requested locale.
 *  3. Returns `null` for sections that should be hidden (empty / errored).
 *  4. Falls back to the existing `lib/sample-data.ts` when `USE_SAMPLE_DATA=true`
 *     so devs without MySQL still see the home page.
 *
 * PRD §6.3 / §4.8 rules are enforced here, NOT in the components.
 *
 * `runtime = 'nodejs'` is declared on every page/route that calls this
 * (see `app/[locale]/page.tsx`). mysql2 needs Node.js TCP.
 */

import 'server-only';
import type { Locale } from '@/i18n/config';
import {
  findSettingsCached,
  findAllContentBlocksCached,
  findAllActiveServicesCached,
  findAllActivePlansCached,
  findFeaturedCaseStudiesCached,
  findAllActiveCaseStudiesCached,
  findAllActiveFeaturedTechStackCached,
  findAllActiveTestimonialsCached,
  findAllActiveFaqCached,
  findAllActiveClientLogosCached,
  findCaseStudyBySlugCached,
  findAllActiveCaseStudySlugsCached,
} from '@/lib/db/repositories';
import { DbNotConfiguredError, isDbConfigured, isSampleDataMode } from '@/lib/db/mysql';
import type {
  PortfolioSettings,
  HeroContent,
  TrustBarContent,
  AboutContent,
  ContactContent,
  FooterContent,
  Service,
  Plan,
  CaseStudy,
  TechStackItem,
  Testimonial,
  FAQ,
  ClientLogo,
  ContentBlockRow,
} from '@/types/portfolio';
import {
  getLocalizedField,
  getLocalizedList,
} from '@/lib/db/helpers';
import { getSampleHomeData, type SampleHomeData } from '@/lib/sample-data';

// ---------------------------------------------------------------------------
// Public shape — what the page passes to ClientHomeShell
// ---------------------------------------------------------------------------

export interface HomePageData {
  /** Always present (DB has hard-coded defaults for every key). */
  settings: PortfolioSettings;
  /** Resolved i18n content blocks. Null = section hidden. */
  contentBlocks: {
    hero: HeroContent | null;
    trust_bar: TrustBarContent | null;
    about: AboutContent | null;
    contact: ContactContent | null;
    footer: FooterContent | null;
  };
  /** Empty array = section hidden. */
  services: Service[];
  plans: Plan[];
  /** All active (for the case-study grid). */
  caseStudies: CaseStudy[];
  /** Featured only (drives the n8n simulator). Empty = simulator hidden. */
  featuredCaseStudy: CaseStudy | null;
  techStack: TechStackItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
  clientLogos: ClientLogo[];
  locale: Locale;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function pickBlock<T extends Record<string, unknown>>(
  blocks: ContentBlockRow[],
  key: ContentBlockRow['section_key'],
  locale: Locale
): T | null {
  const row = blocks.find((b) => b.section_key === key);
  if (!row) return null;
  const i18n = row.content_i18n ?? {};
  const localized = (i18n[locale] as T | undefined) ?? (i18n.en as T | undefined);
  return localized ?? null;
}

function fromSample(sample: SampleHomeData, locale: Locale): HomePageData {
  const cb = (sample.contentBlocks ?? {}) as Partial<SampleHomeData['contentBlocks']>;
  return {
    settings: sample.settings,
    contentBlocks: {
      hero: (cb.hero?.[locale] ?? cb.hero?.en ?? null) as HeroContent | null,
      trust_bar: (cb.trust_bar?.[locale] ?? cb.trust_bar?.en ?? null) as TrustBarContent | null,
      about: (cb.about?.[locale] ?? cb.about?.en ?? null) as AboutContent | null,
      contact: (cb.contact?.[locale] ?? cb.contact?.en ?? null) as ContactContent | null,
      footer: (cb.footer?.[locale] ?? cb.footer?.en ?? null) as FooterContent | null,
    },
    services: sample.services.map((s) => ({
      ...s,
      title: getLocalizedField(s.title_i18n, s.title, locale),
      category: getLocalizedField(s.category_i18n, s.category, locale),
      description: getLocalizedField(s.description_i18n, s.description, locale),
    })) as Service[],
    plans: sample.plans.map((p) => ({
      ...p,
      title: getLocalizedField(p.title_i18n, p.title, locale),
      badge: p.badge ? getLocalizedField(p.badge_i18n, p.badge, locale) : null,
      turnaround: getLocalizedField(p.turnaround_i18n, p.turnaround, locale),
      features_json: (p.features_json as Service['title_i18n']) ?? { en: [] },
    })) as Plan[],
    caseStudies: sample.caseStudies as CaseStudy[],
    featuredCaseStudy: (sample.featuredCaseStudy ?? null) as CaseStudy | null,
    techStack: sample.techStack as TechStackItem[],
    testimonials: sample.testimonials as Testimonial[],
    faqs: ((sample.faqs ?? []) as FAQ[]).map((f) => ({
      ...f,
      question: getLocalizedField(f.question_i18n, f.question, locale),
      answer: getLocalizedField(f.answer_i18n, f.answer, locale),
      category: f.category ? getLocalizedField(f.category_i18n, f.category, locale) : null,
    })) as FAQ[],
    clientLogos: [],
    locale,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch all home-page section data. Cached at the per-repo level.
 * On DB error or empty results, returns `null` for that section.
 * On DB not configured AND `USE_SAMPLE_DATA=true`, returns sample data.
 */
export async function getHomePageSections(locale: Locale): Promise<HomePageData> {
  // Dev escape hatch — use sample data when no MySQL is available.
  if (!isDbConfigured() || isSampleDataMode()) {
    return fromSample(await getSampleHomeData(), locale);
  }

  // Parallel fan-out. `Promise.allSettled` so one repo failure doesn't kill the page —
  // the section that errored will just have empty data and be hidden.
  const [settingsResult, blocksResult, servicesResult, plansResult, featuredResult, allCaseStudiesResult, techResult, testimonialsResult, faqResult, logosResult] =
    await Promise.allSettled([
      findSettingsCached(),
      findAllContentBlocksCached(),
      findAllActiveServicesCached(),
      findAllActivePlansCached(),
      findFeaturedCaseStudiesCached(),
      findAllActiveCaseStudiesCached(),
      findAllActiveFeaturedTechStackCached(),
      findAllActiveTestimonialsCached(),
      findAllActiveFaqCached(),
      findAllActiveClientLogosCached(),
    ]);

  const log = (label: string, err: unknown) =>
    console.error(`[sections:${label}] failed; section will be hidden.`, err instanceof Error ? err.message : err);

  const settings: PortfolioSettings = settingsResult.status === 'fulfilled'
    ? settingsResult.value
    : (log('settings', settingsResult.reason), {
        availability_status: 'online',
        ice_registration_number: '003294812000045',
        contact_email: 'contact@imsabbar.com',
        contact_phone: '+212681510095',
        scheduling_link: 'https://cal.com/imsabbar',
        resume_en_filename: 'imsabbar_MEN_V25.9.pdf',
        resume_fr_filename: 'imsabbar_MFR_V25.9.pdf',
        resume_ar_filename: 'imsabbar_MEN_V25.9.pdf',
        social_links: {},
        sla_notice: '',
        stats_years_value: '12+',
        stats_clients_value: '85+',
        stats_projects_value: '200+',
      });

  const blocks: ContentBlockRow[] = blocksResult.status === 'fulfilled' ? blocksResult.value : (log('contentBlocks', blocksResult.reason), []);
  const services: Service[] = servicesResult.status === 'fulfilled' ? servicesResult.value : (log('services', servicesResult.reason), []);
  const plans: Plan[] = plansResult.status === 'fulfilled' ? plansResult.value : (log('plans', plansResult.reason), []);
  const allCaseStudies: CaseStudy[] = allCaseStudiesResult.status === 'fulfilled' ? allCaseStudiesResult.value : (log('caseStudies', allCaseStudiesResult.reason), []);
  const featuredList: CaseStudy[] = featuredResult.status === 'fulfilled' ? featuredResult.value : (log('featuredCaseStudies', featuredResult.reason), []);
  const techStack: TechStackItem[] = techResult.status === 'fulfilled' ? techResult.value : (log('techStack', techResult.reason), []);
  const testimonials: Testimonial[] = testimonialsResult.status === 'fulfilled' ? testimonialsResult.value : (log('testimonials', testimonialsResult.reason), []);
  const sampleData = getSampleHomeData();
  const faqs: FAQ[] =
    faqResult.status === 'fulfilled' && faqResult.value.length > 0
      ? faqResult.value
      : (log('faq', faqResult.status === 'rejected' ? faqResult.reason : 'empty'),
        ((sampleData.faqs ?? []) as FAQ[]).map((f) => ({
          ...f,
          question: getLocalizedField(f.question_i18n, f.question, locale),
          answer: getLocalizedField(f.answer_i18n, f.answer, locale),
          category: f.category ? getLocalizedField(f.category_i18n, f.category, locale) : null,
        })) as FAQ[]);
  const clientLogos: ClientLogo[] = logosResult.status === 'fulfilled' ? logosResult.value : (log('clientLogos', logosResult.reason), []);

  // Resolve i18n to the requested locale.
  const heroRow = blocks.find((b) => b.section_key === 'hero');
  const aboutRow = blocks.find((b) => b.section_key === 'about');
  const contactRow = blocks.find((b) => b.section_key === 'contact');
  const footerRow = blocks.find((b) => b.section_key === 'footer');
  const trustBarRow = blocks.find((b) => b.section_key === 'trust_bar');

  const hero = pickBlock<HeroContent>(blocks, 'hero', locale);
  const trust_bar = pickBlock<TrustBarContent>(blocks, 'trust_bar', locale);
  const about = pickBlock<AboutContent>(blocks, 'about', locale);
  const contact = pickBlock<ContactContent>(blocks, 'contact', locale);
  const footer = pickBlock<FooterContent>(blocks, 'footer', locale);

  void heroRow; void aboutRow; void contactRow; void footerRow; void trustBarRow; // silence unused

  return {
    settings,
    contentBlocks: { hero, trust_bar, about, contact, footer },
    services: services.filter((s) => s.is_active),
    plans: plans.filter((p) => p.is_active),
    caseStudies: allCaseStudies.filter((c) => c.is_active),
    featuredCaseStudy: featuredList.length > 0 ? featuredList[0] : null,
    techStack: techStack.filter((t) => t.is_active && t.is_featured),
    testimonials: testimonials.filter((t) => t.is_active),
    faqs: faqs.filter((f) => f.is_active),
    clientLogos: clientLogos.filter((l) => l.is_active),
    locale,
  };
}

export { DbNotConfiguredError };
// Re-export i18n helpers so component-side code only imports from `@/lib/sections`.
export { getLocalizedField, getLocalizedList };

// ---------------------------------------------------------------------------
// P3 — Case-study detail page aggregators
// ---------------------------------------------------------------------------

/**
 * Resolves a single active case study by slug.
 *  - When DB is reachable: uses the cached repository.
 *  - When DB is not configured (dev without MySQL, or `USE_SAMPLE_DATA=true`):
 *    falls back to a hand-written sample in `lib/sample-data.ts`.
 *  - Returns `null` if no matching slug exists.
 */
export async function getCaseStudyDetail(
  slug: string
): Promise<CaseStudy | null> {
  if (!isDbConfigured() || isSampleDataMode()) {
    const { getSampleCaseStudyBySlug } = await import('@/lib/sample-data');
    return getSampleCaseStudyBySlug(slug);
  }
  try {
    return await findCaseStudyBySlugCached(slug);
  } catch (e) {
    console.error(`[sections] getCaseStudyDetail(${slug}) failed`, e);
    return null;
  }
}

/**
 * Resolves the next case study to link from the detail-page footer.
 * Picked as the active case study whose `sort_order` is greater than the
 * current's, wrapping around to the first if the current is the last.
 * Returns `null` if the table is empty.
 */
export async function getNextCaseStudy(
  currentSlug: string
): Promise<CaseStudy | null> {
  if (!isDbConfigured() || isSampleDataMode()) {
    const { getSampleNextCaseStudy } = await import('@/lib/sample-data');
    return getSampleNextCaseStudy(currentSlug);
  }
  try {
    const all = await findAllActiveCaseStudiesCached();
    if (all.length === 0) return null;
    const idx = all.findIndex((c) => c.slug === currentSlug);
    if (idx === -1) return all[0] ?? null;
    return all[(idx + 1) % all.length] ?? null;
  } catch (e) {
    console.error(`[sections] getNextCaseStudy(${currentSlug}) failed`, e);
    return null;
  }
}

/**
 * For `generateStaticParams` on the detail page. Returns an empty array when
 * the DB is not configured so Next.js falls back to SSR (no build error).
 */
export async function getAllCaseStudySlugs(): Promise<string[]> {
  if (!isDbConfigured() || isSampleDataMode()) {
    const { getSampleCaseStudySlugs } = await import('@/lib/sample-data');
    return getSampleCaseStudySlugs();
  }
  try {
    return await findAllActiveCaseStudySlugsCached();
  } catch (e) {
    console.error('[sections] getAllCaseStudySlugs failed', e);
    return [];
  }
}
