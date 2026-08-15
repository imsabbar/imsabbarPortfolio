/**
 * Portfolio MySQL types — PRD §7.
 * Source of truth: scripts/init-db.sql (kept in sync with IMSABBAR_OS_PORTFOLIO_MANAGER_MODULE_PRD.md §4).
 * All fields are snake_case to match the SQL column names directly.
 */

import type { Locale } from '@/i18n/config';

/** A 3-locale i18n JSON value. May also be a `Record<string, string>` when the OS app sets extra keys. */
export type LocalizedString = Partial<Record<Locale, string>> & Record<string, string | undefined>;

/** A 3-locale i18n JSON array of strings. */
export type LocalizedStringList = Partial<Record<Locale, string[]>> & Record<string, string[] | undefined>;

// ---------------------------------------------------------------------------
// 1. portfolio_plans
// ---------------------------------------------------------------------------

export type PlanBillingType = 'one_time' | 'hourly' | 'monthly';
export type PlanCtaType = 'wizard' | 'booking' | 'whatsapp';

export interface Plan {
  id: number;
  slug: string;
  title: string;
  title_i18n?: LocalizedString;
  badge: string | null;
  badge_i18n?: LocalizedString;
  price_mad: number;
  price_eur: number;
  price_usd: number;
  price_gbp: number;
  price_aed: number;
  billing_type: PlanBillingType;
  features_json: LocalizedStringList;
  turnaround: string;
  turnaround_i18n?: LocalizedString;
  cta_type: PlanCtaType;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 2. portfolio_services
// ---------------------------------------------------------------------------

export interface Service {
  id: number;
  slug: string;
  title: string;
  title_i18n?: LocalizedString;
  category: string;
  category_i18n?: LocalizedString;
  description: string;
  description_i18n?: LocalizedString;
  icon_name: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 3. portfolio_tech_stack
// ---------------------------------------------------------------------------

export interface TechStackItem {
  id: number;
  name: string;
  name_i18n?: LocalizedString;
  category: string;
  category_i18n?: LocalizedString;
  proficiency: number; // 1..100
  icon: string;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 4. portfolio_case_studies
// ---------------------------------------------------------------------------

/** Spec grid shown in the X-Ray drawer / detail page. */
export interface CaseStudyXRaySpecs {
  architecture: string;
  stack: string[];
  executionTime: string;
  security: string;
}

/** A single n8n node in the simulator. */
export interface N8nNode {
  id: number;
  name: string;
  type: 'trigger' | 'action' | 'condition' | 'output';
  description: string;
  latencyMs: number;
  samplePayload?: Record<string, unknown>;
}

export interface CaseStudy {
  id: number;
  slug: string;
  title: string;
  title_i18n?: LocalizedString;
  summary: string;
  summary_i18n?: LocalizedString;
  client_name: string | null;
  client_region: string | null;
  client_region_i18n?: LocalizedString;
  impact_metric: string | null;
  impact_metric_i18n?: LocalizedString;
  before_metric: string | null;
  before_metric_i18n?: LocalizedString;
  after_metric: string | null;
  after_metric_i18n?: LocalizedString;
  improvement_percent: number | null;
  demo_url: string | null;
  github_url: string | null;
  image_url: string | null;
  xray_specs_json: CaseStudyXRaySpecs | null;
  n8n_nodes_json: N8nNode[] | null;
  body_i18n?: LocalizedString; // long-form markdown per locale (Phase 3 renders it)
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 5. portfolio_testimonials
// ---------------------------------------------------------------------------

export interface Testimonial {
  id: number;
  client_name: string;
  client_name_i18n?: LocalizedString;
  company: string | null;
  company_i18n?: LocalizedString;
  country: string | null;
  country_i18n?: LocalizedString;
  quote: string;
  quote_i18n?: LocalizedString;
  rating: number; // 1..5
  is_b2b_verified: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 6. portfolio_client_logos / portfolio_faq
// ---------------------------------------------------------------------------

export interface ClientLogo {
  id: number;
  company_name: string;
  company_name_i18n?: LocalizedString;
  logo_url: string;
  website_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: number;
  question: string;
  question_i18n?: LocalizedString;
  answer: string;
  answer_i18n?: LocalizedString;
  category: string | null;
  category_i18n?: LocalizedString;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

// ---------------------------------------------------------------------------
// 7. portfolio_settings (key/value rows)
// ---------------------------------------------------------------------------

/** Social links shape stored as JSON in `social_links_json` — PRD §7.4. */
export interface SocialLinks {
  linkedin?: string;
  github?: string;
  youtube?: string;
  telegram?: string;
  whatsapp?: string;
  email?: string;
}

/** A single settings row (key → value). */
export interface SettingRow {
  setting_key: string;
  setting_value: string;
  updated_at: string;
}

/** Fully parsed settings object — what `getSettings()` returns. */
export interface PortfolioSettings {
  availability_status: 'online' | 'busy';
  ice_registration_number: string;
  contact_email: string;
  contact_phone: string;
  scheduling_link: string;
  resume_en_filename: string;
  resume_fr_filename: string;
  resume_ar_filename: string;
  social_links: SocialLinks;
  sla_notice: string;
  stats_years_value: string;
  stats_clients_value: string;
  stats_projects_value: string;
  stats_reliability_value?: string;
}

// ---------------------------------------------------------------------------
// 8. portfolio_content_blocks
// ---------------------------------------------------------------------------

/** `hero` content block. */
export interface HeroContent {
  headline: string;
  subhead: string;
  cta_work: string;
  cta_book: string;
  spec_chips: string[];
  /** Per-locale availability text (moved out of settings — PRD §4.9 note). */
  availability_message?: string;
  // Optional extras the OS may add
  [key: string]: string | string[] | undefined;
}

/** `trust_bar` content block. */
export interface TrustBarContent {
  badge: string;
  // The registration text (not the number — that comes from settings)
  [key: string]: string | undefined;
}

/** `about` content block. Stats *labels* live here (per PRD §4.9 note). */
export interface AboutContent {
  body: string;
  principles: string[];
  stats_years_label: string;
  stats_clients_label: string;
  stats_projects_label: string;
  stats_reliability_label?: string;
  [key: string]: string | string[] | undefined;
}

/** `contact` content block. */
export interface ContactContent {
  title: string;
  body: string;
  [key: string]: string | undefined;
}

/** `footer` content block. */
export interface FooterContent {
  rights: string;
  tagline: string;
  [key: string]: string | undefined;
}

/** All supported section keys + their content shape. */
export interface ContentBlocks {
  hero: HeroContent | null;
  trust_bar: TrustBarContent | null;
  about: AboutContent | null;
  contact: ContactContent | null;
  footer: FooterContent | null;
}

/** Raw row from `portfolio_content_blocks` (content_i18n is `Record<Locale, T>`). */
export interface ContentBlockRow<T = Record<string, unknown>> {
  section_key: keyof ContentBlocks;
  content_i18n: Partial<Record<Locale, T>> & Record<string, T | undefined>;
  updated_at: string;
}
