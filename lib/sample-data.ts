/**
 * DEV-ONLY SAMPLE DATA — Phase 2 seam.
 *
 * After Phase 2, every entity in this file is replaced by MySQL repository
 * data (PRD §6.2). This module is ONLY used when the dev escape hatch
 * `USE_SAMPLE_DATA=true` is set in `.env.local` (see `lib/db/mysql.ts`).
 *
 * Behavior:
 *   - Home page (`lib/sections`): falls back to `getSampleHomeData()` when
 *     `USE_SAMPLE_DATA=true` so a developer without MySQL still sees the
 *     site render end-to-end.
 *   - Public API routes: NEVER fall back. They 503 (see `lib/api-helpers.ts`).
 *   - Production builds: `USE_SAMPLE_DATA` is not set, so this file is
 *     effectively dead code at runtime.
 *
 * Why keep it at all?
 *   - Local UI development without DB dependencies.
 *   - As a typed reference shape for the DB entities.
 *   - As a smoke test for `getHomePageSections` even in CI.
 *
 * Labels/body copy here are English-only placeholders until the OS-managed
 * i18n content blocks and DB tables are wired into the UI.
 */

import type {
  AboutContent,
  CaseStudy,
  CaseStudyXRaySpecs,
  ContactContent,
  FooterContent,
  HeroContent,
  N8nNode,
  Plan,
  PortfolioSettings,
  Service,
  TechStackItem,
  Testimonial,
  TrustBarContent,
  FAQ,
} from '@/types/portfolio';

export type Currency = 'MAD' | 'EUR' | 'USD' | 'GBP' | 'AED';

export interface SampleCaseStudy {
  id: number;
  slug: string;
  title: string;
  client_name: string;
  client_region: string;
  impact_metric: string;
  summary: string;
  image_url: string;
  has_simulator: boolean;
  specs: {
    architecture: string;
    stack: string[];
    executionTime: string;
    security: string;
  };
}

export const sampleCaseStudies: SampleCaseStudy[] = [
  {
    id: 1,
    slug: 'perfex-crm-n8n-automation-suite',
    title: 'Enterprise Perfex CRM & n8n Automated Dispatch Engine',
    client_name: 'Logistics Group',
    client_region: 'Europe / GCC',
    impact_metric: 'Reduced manual processing by 84% & saved 120+ team hours/month',
    summary:
      'Custom n8n workflow pipeline integrated directly into Perfex CRM with webhooks, multi-currency invoicing, and real-time Telegram telemetry.',
    image_url: '/brand_assets/ismail-sabbar-architect-workstation.webp',
    has_simulator: true,
    specs: {
      architecture: 'n8n Workflow Engine + Perfex CRM API',
      stack: ['n8n', 'PHP', 'MySQL', 'Next.js', 'Telegram Bot API'],
      executionTime: '140ms average webhook processing',
      security: 'HMAC SHA-256 Signature Verification',
    },
  },
  {
    id: 2,
    slug: 'headless-wordpress-nextjs-portal',
    title: 'High-Speed Headless Next.js 15 Web Portal',
    client_name: 'B2B SaaS Provider',
    client_region: 'Morocco / France',
    impact_metric: '99/100 Lighthouse Performance & < 1.2s LCP speed',
    summary:
      'Decoupled web portal backed by WordPress GraphQL API and Next.js 15 ISR revalidation engine.',
    image_url: '/brand_assets/ismail-sabbar-consultant-studio-portrait.webp',
    has_simulator: false,
    specs: {
      architecture: 'Headless Next.js App Router + WP GraphQL',
      stack: ['Next.js 15', 'React 19', 'GraphQL', 'Tailwind CSS v4'],
      executionTime: '< 90ms Edge ISR cached response',
      security: 'Cloudflare Edge Security & Turnstile',
    },
  },
];

export interface SimNode {
  id: number;
  name: string;
  type: string;
  description: string;
  latencyMs: number;
  samplePayload: Record<string, unknown>;
}

export interface SampleTestimonial {
  name: string;
  company: string;
  country: string;
  quote: string;
  rating: number;
  verified: boolean;
}

export const sampleN8nNodes: SimNode[] = [
  {
    id: 1,
    name: 'Webhook Listener',
    type: 'trigger',
    description: 'Ingests incoming B2B lead payload from web portal form',
    latencyMs: 14,
    samplePayload: {
      event: 'lead.created',
      source: 'web_portal',
      timestamp: '2026-08-09T03:00:00Z',
      payload: {
        name: 'Alexandre Dupont',
        email: 'alex@logistics-eu.com',
        company: 'Logistics Group Europe',
        budget: '$5,000+',
      },
    },
  },
  {
    id: 2,
    name: 'Data Sanitizer & Geo-IP',
    type: 'transform',
    description: 'Normalizes currency, verifies MX record, maps IP country',
    latencyMs: 38,
    samplePayload: {
      status: 'sanitized',
      geo: { country: 'France', code: 'FR', currency: 'EUR' },
      email_valid: true,
      mx_check: 'PASS',
      normalized_phone: '+33140506070',
    },
  },
  {
    id: 3,
    name: 'Perfex CRM Sync',
    type: 'action',
    description: 'Creates lead record & assigns dedicated account manager',
    latencyMs: 65,
    samplePayload: {
      crm_lead_id: 84920,
      assigned_to: 'Ismail Sabbar',
      pipeline_stage: 'Qualified Opportunity',
      auto_tasks_created: ['Send Proposal', 'Schedule Discovery Call'],
    },
  },
  {
    id: 4,
    name: 'Telegram & Email Alert',
    type: 'notification',
    description: 'Dispatches instant encrypted multi-channel alert',
    latencyMs: 22,
    samplePayload: {
      telegram_sent: true,
      chat_id: '-1008492049',
      email_sent: true,
      delivery_latency: '139ms total pipeline execution time',
    },
  },
];

export interface SamplePlan {
  id: string;
  title: string;
  badge: string;
  turnaround: string;
  prices: Record<Currency, number>;
  billing: 'one_time' | 'hourly' | 'monthly';
  is_popular: boolean;
  features: string[];
}

export const samplePlans: SamplePlan[] = [
  {
    id: 'n8n-automation-starter',
    title: 'n8n Workflow Automation',
    badge: 'Popular for Teams',
    turnaround: '3–5 Business Days',
    prices: { MAD: 4500, EUR: 450, USD: 490, GBP: 390, AED: 1800 },
    billing: 'one_time',
    is_popular: true,
    features: [
      'Multi-app integration (CRM, Slack, Email, DB)',
      'Custom webhook triggers & error alerts',
      'Execution log telemetry & documentation',
      '30-day post-launch support & warranty',
    ],
  },
  {
    id: 'perfex-crm-module',
    title: 'Perfex CRM Module Build',
    badge: 'Enterprise B2B',
    turnaround: '7–10 Business Days',
    prices: { MAD: 8500, EUR: 850, USD: 920, GBP: 740, AED: 3400 },
    billing: 'one_time',
    is_popular: false,
    features: [
      'Custom PHP/MySQL module development',
      'Automated invoice & lead dispatch hooks',
      'Custom client portal dashboard views',
      '100% source code ownership & documentation',
    ],
  },
  {
    id: 'fullstack-web-build',
    title: 'High-Speed Web Portal (Next.js / WP)',
    badge: 'Complete Solution',
    turnaround: '10–14 Business Days',
    prices: { MAD: 14000, EUR: 1400, USD: 1500, GBP: 1200, AED: 5500 },
    billing: 'one_time',
    is_popular: false,
    features: [
      'Custom Next.js 15 App Router build',
      'Tailwind CSS v4 & Framer Motion design',
      'Multilingual i18n (EN / FR / AR)',
      'Lighthouse 95+ performance guarantee',
    ],
  },
];

export interface SampleService {
  icon: string;
  title: string;
  category: string;
  description: string;
}

export const sampleServices: SampleService[] = [
  {
    icon: 'zap',
    title: 'n8n Workflow Automation',
    category: 'Automation Engineering',
    description:
      'Custom n8n workflows connecting CRM, payment gateways, emails, and database webhooks with zero manual intervention.',
  },
  {
    icon: 'briefcase',
    title: 'Perfex CRM Module Engineering',
    category: 'CRM Solutions',
    description:
      'Custom PHP/MySQL modules, automated lead routing, custom invoice generators, and client portal enhancements for Perfex CRM.',
  },
  {
    icon: 'rocket',
    title: 'WordPress & Next.js Web Builds',
    category: 'Web Engineering',
    description:
      'High-speed headless or monolithic web platforms engineered for maximum Lighthouse performance and SEO lead capture.',
  },
];

export interface SampleTechItem {
  name: string;
  icon: string;
  proficiency: number;
}

export const sampleTechStack: SampleTechItem[] = [
  { name: 'n8n Workflow Automation', icon: 'zap', proficiency: 100 },
  { name: 'Perfex CRM Engine (PHP/MySQL)', icon: 'briefcase', proficiency: 100 },
  { name: 'Next.js 15 & React 19', icon: 'code', proficiency: 100 },
  { name: 'Laravel & CodeIgniter', icon: 'layers', proficiency: 100 },
  { name: 'WordPress & WooCommerce', icon: 'globe', proficiency: 100 },
  { name: 'JavaScript & TypeScript', icon: 'monitor', proficiency: 100 },
  { name: 'Python & Web Scraping', icon: 'terminal', proficiency: 100 },
  { name: 'MySQL, MongoDB & PostgreSQL', icon: 'database', proficiency: 100 },
];

export const heroSpecChips: { icon: string; label: string }[] = [
  { icon: 'zap', label: 'n8n Automation' },
  { icon: 'briefcase', label: 'Perfex CRM' },
  { icon: 'code', label: 'Next.js & Laravel' },
  { icon: 'phone', label: '+212 681 51 00 95' },
];

export const leadServiceOptions = [
  'n8n Workflow Automation',
  'Perfex CRM Engineering',
  'WordPress / Next.js Web Build',
  'Custom Technical Consultation',
];

export const bookingProjectTypes = [
  { key: 'automation', dictKey: 'type_automation' as const },
  { key: 'crm', dictKey: 'type_crm' as const },
  { key: 'web', dictKey: 'type_web' as const },
];

export const bookingBudgetRanges = [
  { key: 'small', dictKey: 'budget_small' as const },
  { key: 'medium', dictKey: 'budget_medium' as const },
  { key: 'large', dictKey: 'budget_large' as const },
];

export const sampleAbout = {
  body: 'With over 12+ years of hands-on experience, I specialize in building powerful digital solutions that transform businesses. I bridge operational bottlenecks with clean software engineering, crafting n8n workflows, custom Perfex CRM modules, web scraping pipelines, and high-speed Next.js web applications.',
  principles: [
    {
      title: '1. Zero Bloat',
      body: 'Clean, scalable code over complex over-engineered frameworks.',
    },
    {
      title: '2. Direct Communication',
      body: 'Work directly with the engineer building your system, with zero middle managers.',
    },
  ],
  stats: [
    { value: '12+', label: 'Years of Experience' },
    { value: '85+', label: 'Satisfied Clients' },
    { value: '200+', label: 'Completed Projects' },
    { value: '99.8%', label: 'System Reliability' },
  ],
};

// ---------------------------------------------------------------------------
// Phase 2: dev-only fallback shape
//
// `getSampleHomeData()` builds a `HomePageData` object from the
// `sample*` exports above. Used ONLY when `USE_SAMPLE_DATA=true` is set
// (i.e. dev without MySQL). In production, `lib/sections` reads from DB.
// ---------------------------------------------------------------------------

export interface SampleHomeData {
  settings: PortfolioSettings;
  contentBlocks: {
    hero: Record<'en' | 'fr' | 'ar', HeroContent> | null;
    trust_bar: Record<'en' | 'fr' | 'ar', TrustBarContent> | null;
    about: Record<'en' | 'fr' | 'ar', AboutContent> | null;
    contact: Record<'en' | 'fr' | 'ar', ContactContent> | null;
    footer: Record<'en' | 'fr' | 'ar', FooterContent> | null;
  };
  services: Service[];
  plans: Plan[];
  caseStudies: CaseStudy[];
  featuredCaseStudy: CaseStudy | null;
  techStack: TechStackItem[];
  testimonials: Testimonial[];
  faqs: FAQ[];
}

const heroContentEn: HeroContent = {
  headline: 'Engineering, Automation & CRM that Ship at Velocity',
  subhead:
    'I build n8n workflows, custom Perfex CRM modules, and high-speed Next.js web platforms for B2B operators.',
  cta_work: 'See My Work',
  cta_book: 'Book Architecture Call',
  spec_chips: ['n8n Engine', 'Perfex CRM', 'Next.js 15', 'Zero-Trust Webhooks'],
};

const trustBarContentEn: TrustBarContent = {
  badge: 'Registered Auto-Entrepreneur · ICE 003294812000045',
};

const aboutContentEn: AboutContent = {
  body: sampleAbout.body,
  principles: sampleAbout.principles.flatMap((p) => [`${p.title} — ${p.body}`]),
  stats_years_label: sampleAbout.stats[0]?.label ?? 'Years of Experience',
  stats_clients_label: sampleAbout.stats[1]?.label ?? 'Satisfied Clients',
  stats_projects_label: sampleAbout.stats[2]?.label ?? 'Completed Projects',
  stats_reliability_label: sampleAbout.stats[3]?.label ?? 'System Reliability',
};

const contactContentEn: ContactContent = {
  title: 'Let’s build the system that runs while you sleep',
  body: 'Pick a channel. I respond within 1 business day.',
};

const footerContentEn: FooterContent = {
  rights: 'Ismail Sabbar — All rights reserved',
  tagline: 'Engineered with care. Shipped with intent.',
};

export const sampleSettings: PortfolioSettings = {
  availability_status: 'online',
  ice_registration_number: '003294812000045',
  contact_email: 'contact@imsabbar.com',
  contact_phone: '+212681510095',
  scheduling_link: 'https://cal.com/imsabbar',
  resume_en_filename: 'imsabbar_MEN_V25.9.pdf',
  resume_fr_filename: 'imsabbar_MFR_V25.9.pdf',
  resume_ar_filename: 'imsabbar_MEN_V25.9.pdf',
  social_links: {
    linkedin: 'https://www.linkedin.com/in/sabbarismail/',
    github: 'https://github.com/imsabbar',
    youtube: 'https://www.youtube.com/@imsabbar',
    telegram: 'https://t.me/imsabbar',
    whatsapp: 'https://wa.me/212681510095',
    email: 'mailto:contact@imsabbar.com',
  },
  sla_notice: 'Official B2B Invoicing & Contracted Service Level Agreements Available',
  stats_years_value: '12+',
  stats_clients_value: '85+',
  stats_projects_value: '200+',
  stats_reliability_value: '99.8%',
};

function specsToXRay(s: SampleCaseStudy['specs']): CaseStudyXRaySpecs {
  return {
    architecture: s.architecture,
    stack: s.stack,
    executionTime: s.executionTime,
    security: s.security,
  };
}

function sampleToCaseStudy(s: SampleCaseStudy, n8nNodes: N8nNode[] | null, idx: number): CaseStudy {
  return {
    id: s.id,
    slug: s.slug,
    title: s.title,
    title_i18n: { en: s.title },
    summary: s.summary,
    summary_i18n: { en: s.summary },
    client_name: s.client_name,
    client_region: s.client_region,
    client_region_i18n: { en: s.client_region },
    impact_metric: s.impact_metric,
    impact_metric_i18n: { en: s.impact_metric },
    before_metric: null,
    before_metric_i18n: undefined,
    after_metric: null,
    after_metric_i18n: undefined,
    improvement_percent: idx === 0 ? 84 : 99,
    demo_url: null,
    github_url: null,
    image_url: s.image_url,
    xray_specs_json: specsToXRay(s.specs),
    n8n_nodes_json: n8nNodes,
    body_i18n: { en: idx === 0 ? sampleCaseStudyBody() : s.summary },
    is_featured: idx === 0,
    is_active: true,
    sort_order: idx,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  };
}

/**
 * P3 — Rich markdown body for the detail-page demo.
 * Returned for the first case study so the detail page has real copy to render.
 * Production content is provided by the OS via `portfolio_case_studies.body_i18n`.
 */
function sampleCaseStudyBody(): string {
  return [
    '## The challenge',
    '',
    'The internal operations team was stitching four SaaS tools together by hand. Every incoming lead had to be copy-pasted between Perfex CRM, an email marketing tool, a shared inbox, and a spreadsheet tracker. In practice, **one out of every three leads was either dropped or delayed by a full business day**, and the lead assignee only found out about the drop on a Friday evening review.',
    '',
    '## What we built',
    '',
    'A single n8n workflow that ingests leads from three sources (web form, Meta Lead Ads, WhatsApp Business API), normalizes them against a contact dedup table in Perfex CRM, and routes them to the right sales rep based on language, region, and product interest. Every transition writes an audit row to a tracking table in MySQL so the manager can see exactly where each lead stands in real time.',
    '',
    '## Engineering decisions',
    '',
    '- **Single source of truth in Perfex CRM.** Every other tool is downstream.',
    '- **Idempotent webhooks** with a 24-hour dedup window — replaying the same webhook twice never creates two leads.',
    '- **Region-based routing** using a small lookup table in MySQL (no hardcoded branches in n8n).',
    '- **Failure isolation:** if the email notification step fails, the lead is still saved and a Slack alert fires. The workflow never silently drops work.',
    '',
    '## Operational impact',
    '',
    'After the first 90 days, the team recovered an average of 18 hours per week of manual data entry, and the lead-to-first-reply time dropped from 6 hours to under 9 minutes. The full X-Ray breakdown of the architecture, stack, and security posture is below.',
  ].join('\n');
}

function sampleToSimNode(n: SimNode): N8nNode {
  const typeMap: Record<string, N8nNode['type']> = {
    trigger: 'trigger',
    transform: 'action',
    action: 'action',
    notification: 'output',
    condition: 'condition',
  };
  return {
    id: n.id,
    name: n.name,
    type: typeMap[n.type] ?? 'action',
    description: n.description,
    latencyMs: n.latencyMs,
    samplePayload: n.samplePayload,
  };
}

export function sampleToPlan(p: SamplePlan, idx: number): Plan {
  return {
    id: idx + 1,
    slug: p.id,
    title: p.title,
    title_i18n: { en: p.title },
    badge: p.badge,
    badge_i18n: { en: p.badge },
    price_mad: p.prices.MAD,
    price_eur: p.prices.EUR,
    price_usd: p.prices.USD,
    price_gbp: p.prices.GBP,
    price_aed: p.prices.AED,
    billing_type: p.billing,
    features_json: { en: p.features },
    turnaround: p.turnaround,
    turnaround_i18n: { en: p.turnaround },
    cta_type: 'wizard',
    is_popular: p.is_popular,
    is_active: true,
    sort_order: idx,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  };
}

function sampleToService(s: SampleService, idx: number): Service {
  return {
    id: idx + 1,
    slug: s.icon,
    title: s.title,
    title_i18n: { en: s.title },
    category: s.category,
    category_i18n: { en: s.category },
    description: s.description,
    description_i18n: { en: s.description },
    icon_name: s.icon,
    is_active: true,
    sort_order: idx,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  };
}

function sampleToTech(t: SampleTechItem, idx: number): TechStackItem {
  return {
    id: idx + 1,
    name: t.name,
    name_i18n: { en: t.name },
    category: 'core',
    category_i18n: { en: 'core' },
    proficiency: t.proficiency,
    icon: t.icon,
    is_featured: true,
    is_active: true,
    sort_order: idx,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  };
}

function sampleToTestimonial(t: SampleTestimonial, idx: number): Testimonial {
  return {
    id: idx + 1,
    client_name: t.name,
    client_name_i18n: { en: t.name },
    company: t.company,
    company_i18n: { en: t.company },
    country: t.country,
    country_i18n: { en: t.country },
    quote: t.quote,
    quote_i18n: { en: t.quote },
    rating: t.rating,
    is_b2b_verified: t.verified,
    is_active: true,
    sort_order: idx,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  };
}

export const sampleTestimonials: SampleTestimonial[] = [];

export const sampleFaqs: FAQ[] = [
  {
    id: 1,
    question: 'How do you integrate n8n workflows with our existing CRM and third-party APIs?',
    question_i18n: {
      en: 'How do you integrate n8n workflows with our existing CRM and third-party APIs?',
      fr: 'Comment intégrez-vous les flux n8n avec notre CRM et nos API tierces ?',
      ar: 'كيف تقوم بدمج مسارات عمل n8n مع نظام إدارة العلاقات CRM وواجهات API لدينا؟',
    },
    answer: 'I engineer custom webhook triggers, authenticated REST/GraphQL API nodes, and bidirectional data sync pipelines. Workflows include automated retry logic, error handling telemetry, and fallback alerts via Telegram or Slack.',
    answer_i18n: {
      en: 'I engineer custom webhook triggers, authenticated REST/GraphQL API nodes, and bidirectional data sync pipelines. Workflows include automated retry logic, error handling telemetry, and fallback alerts via Telegram or Slack.',
      fr: 'Je conçois des déclencheurs webhook personnalisés, des nœuds API REST/GraphQL authentifiés et des pipelines de synchronisation bidirectionnelle. Les flux incluent une logique de nouvelle tentative automatique et des alertes via Telegram ou Slack.',
      ar: 'أقوم بهندسة مشغلات الويب هوك المخصصة، ونقاط اتصال واجهات برمجة التطبيقات REST/GraphQL الموثقة، ومسارات المزامنة ثنائية الاتجاه مع معالجة ذكية للأخطاء وتنبيهات فورية عبر تيليجرام أو سلاك.',
    },
    category: 'Automation & n8n',
    category_i18n: {
      en: 'Automation & n8n',
      fr: 'Automatisation & n8n',
      ar: 'الأتمتة و n8n',
    },
    is_active: true,
    sort_order: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 2,
    question: 'Will custom Perfex CRM modules break when we upgrade core Perfex in the future?',
    question_i18n: {
      en: 'Will custom Perfex CRM modules break when we upgrade core Perfex in the future?',
      fr: 'Les modules Perfex CRM personnalisés risquent-ils de casser lors des futures mises à jour ?',
      ar: 'هل ستتأثر الوحدات المخصصة لنظام Perfex CRM عند تحديث النظام الأساسي مستقبلاً؟',
    },
    answer: 'No. All modules are developed strictly following the official CodeIgniter & Perfex modular hook architecture. We never modify core files, ensuring 100% update-proof compatibility and seamless long-term maintenance.',
    answer_i18n: {
      en: 'No. All modules are developed strictly following the official CodeIgniter & Perfex modular hook architecture. We never modify core files, ensuring 100% update-proof compatibility and seamless long-term maintenance.',
      fr: 'Non. Tous les modules sont développés en respectant scrupuleusement l\'architecture modulaire officielle de Perfex & CodeIgniter, sans jamais toucher aux fichiers cœurs, garantissant une compatibilité totale lors des mises à jour.',
      ar: 'كلا. يتم تطوير جميع الوحدات حصرياً وفق المعايير المعمارية الرسمية لـ Perfex و CodeIgniter دون أي تعديل على الملفات الأساسية للنظام، مما يضمن توافقاً كاملاً بنسبة 100% مع التحديثات المستقبلية.',
    },
    category: 'Perfex CRM',
    category_i18n: {
      en: 'Perfex CRM',
      fr: 'Perfex CRM',
      ar: 'نظام Perfex CRM',
    },
    is_active: true,
    sort_order: 2,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 3,
    question: 'What is your typical project delivery turnaround time?',
    question_i18n: {
      en: 'What is your typical project delivery turnaround time?',
      fr: 'Quel est votre délai typique de livraison de projet ?',
      ar: 'ما هي المدة الزمنية المعتادة لتسليم المشاريع؟',
    },
    answer: 'Standard n8n automation pipelines take 3–5 business days. Custom Perfex CRM modules and high-speed web builds typically require 7–14 business days, with daily staging access and progress updates.',
    answer_i18n: {
      en: 'Standard n8n automation pipelines take 3–5 business days. Custom Perfex CRM modules and high-speed web builds typically require 7–14 business days, with daily staging access and progress updates.',
      fr: 'Les pipelines d\'automatisation n8n standard prennent 3 à 5 jours ouvrés. Les modules Perfex CRM personnalisés et les portails web rapides nécessitent généralement 7 à 14 jours ouvrés avec un accès staging quotidien.',
      ar: 'تستغرق مسارات الأتمتة القياسية في n8n ما بين 3 إلى 5 أيام عمل. أما وحدات Perfex المخصصة ومواقع الويب فائقة السرعة فتستغرق من 7 إلى 14 يوم عمل مع توفير بيئة تجريبية وتحديثات دورية.',
    },
    category: 'Process & SLA',
    category_i18n: {
      en: 'Process & SLA',
      fr: 'Processus & Délais',
      ar: 'الإجراءات والمواعيد',
    },
    is_active: true,
    sort_order: 3,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 4,
    question: 'Do you provide post-launch support and warranty on code?',
    question_i18n: {
      en: 'Do you provide post-launch support and warranty on code?',
      fr: 'Fournissez-vous un support après-vente et une garantie sur le code ?',
      ar: 'هل تقدم دعماً فنياً وضماناً على الكود البرمجي بعد الإطلاق؟',
    },
    answer: 'Yes. Every project includes a 30-day full warranty covering bug fixes, tuning, and workflow optimization at zero extra charge. Extended SLA maintenance retainers are also available.',
    answer_i18n: {
      en: 'Yes. Every project includes a 30-day full warranty covering bug fixes, tuning, and workflow optimization at zero extra charge. Extended SLA maintenance retainers are also available.',
      fr: 'Oui. Chaque projet comprend une garantie complète de 30 jours couvrant les corrections de bugs et les ajustements sans frais supplémentaires. Des contrats de maintenance SLA sont également disponibles.',
      ar: 'نعم. يتضمن كل مشروع ضماناً شاملاً لمدة 30 يوماً يغطي إصلاح أي ثغرات وتحسين الأداء دون أي تكلفة إضافية، مع إمكانية الاشتراك في عقود صيانة ودعم دوري.',
    },
    category: 'Process & SLA',
    category_i18n: {
      en: 'Process & SLA',
      fr: 'Processus & Délais',
      ar: 'الإجراءات والمواعيد',
    },
    is_active: true,
    sort_order: 4,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 5,
    question: 'Who owns the intellectual property and source code?',
    question_i18n: {
      en: 'Who owns the intellectual property and source code?',
      fr: 'À qui appartient la propriété intellectuelle et le code source ?',
      ar: 'من يملك حقوق الملكية الفكرية والشفرة البرمجية؟',
    },
    answer: 'You have 100% full ownership of all custom source code, documentation, credentials, and workflow definitions upon final invoice settlement. No vendor lock-in, ever.',
    answer_i18n: {
      en: 'You have 100% full ownership of all custom source code, documentation, credentials, and workflow definitions upon final invoice settlement. No vendor lock-in, ever.',
      fr: 'Vous détenez 100% de la propriété intégrale de tout le code source personnalisé, de la documentation et des flux dès le règlement final. Aucun verrouillage propriétaire.',
      ar: 'تمتلك الملكية الحصرية والكاملة بنسبة 100% لجميع الشفرات البرمجية والتوثيقات وبيانات الاعتماد ومخططات الأتمتة فور اكتمال المشروع وبدون أي قيود.',
    },
    category: 'Security & IP',
    category_i18n: {
      en: 'Security & IP',
      fr: 'Sécurité & Propriété',
      ar: 'الأمان والملكية',
    },
    is_active: true,
    sort_order: 5,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 6,
    question: 'How do you handle confidential client credentials and database security?',
    question_i18n: {
      en: 'How do you handle confidential client credentials and database security?',
      fr: 'Comment gérez-vous la confidentialité des identifiants et la sécurité des bases de données ?',
      ar: 'كيف تتعامل مع سرية بيانات الاعتماد وأمان قواعد البيانات؟',
    },
    answer: 'We enforce enterprise-grade security: NDA agreements, isolated staging environments, environment-variable key storage (never committed to git), and encrypted secrets management in n8n/Docker.',
    answer_i18n: {
      en: 'We enforce enterprise-grade security: NDA agreements, isolated staging environments, environment-variable key storage (never committed to git), and encrypted secrets management in n8n/Docker.',
      fr: 'Nous appliquons une sécurité de niveau entreprise : accords de confidentialité NDA, environnements staging isolés, stockage par variables d\'environnement et chiffrement des secrets.',
      ar: 'نطبق معايير أمنية صارمة: توقيع اتفاقيات عدم الإفصاح NDA، وبيئات تجريبية معزولة، وتخزين المفاتيح في متغيرات البيئة المشفرة وعدم رفعها في Git نهائياً.',
    },
    category: 'Security & IP',
    category_i18n: {
      en: 'Security & IP',
      fr: 'Sécurité & Propriété',
      ar: 'الأمان والملكية',
    },
    is_active: true,
    sort_order: 6,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-01-01T00:00:00.000Z',
  },
];

/**
 * P3 — Sample case-study lookup helpers.
 * Mirrors the DB contract: slug → CaseStudy. Used by the detail page when
 * MySQL is not configured.
 */
export function getSampleCaseStudyBySlug(slug: string): CaseStudy | null {
  const all = sampleCaseStudies.map((s, i) =>
    sampleToCaseStudy(s, i === 0 ? sampleN8nNodes.map(sampleToSimNode) : null, i)
  );
  return all.find((c) => c.slug === slug) ?? null;
}

export function getSampleCaseStudySlugs(): string[] {
  return sampleCaseStudies.map((s) => s.slug);
}

export function getSampleNextCaseStudy(currentSlug: string): CaseStudy | null {
  const all = sampleCaseStudies.map((s, i) =>
    sampleToCaseStudy(s, i === 0 ? sampleN8nNodes.map(sampleToSimNode) : null, i)
  );
  if (all.length === 0) return null;
  const idx = all.findIndex((c) => c.slug === currentSlug);
  if (idx === -1) return all[0] ?? null;
  return all[(idx + 1) % all.length] ?? null;
}

/** Returns a `SampleHomeData` aggregating all `sample*` exports. Dev-only. */
export function getSampleHomeData(): SampleHomeData {
  const caseStudies = sampleCaseStudies.map((s, i) => sampleToCaseStudy(s, i === 0 ? sampleN8nNodes.map(sampleToSimNode) : null, i));
  const featured = caseStudies.find((c) => c.is_featured) ?? caseStudies[0] ?? null;

  return {
    settings: sampleSettings,
    contentBlocks: {
      hero: { en: heroContentEn, fr: heroContentEn, ar: heroContentEn },
      trust_bar: { en: trustBarContentEn, fr: trustBarContentEn, ar: trustBarContentEn },
      about: { en: aboutContentEn, fr: aboutContentEn, ar: aboutContentEn },
      contact: { en: contactContentEn, fr: contactContentEn, ar: contactContentEn },
      footer: { en: footerContentEn, fr: footerContentEn, ar: footerContentEn },
    },
    services: sampleServices.map(sampleToService),
    plans: samplePlans.map(sampleToPlan),
    caseStudies,
    featuredCaseStudy: featured,
    techStack: sampleTechStack.map(sampleToTech),
    testimonials: sampleTestimonials.map(sampleToTestimonial),
    faqs: sampleFaqs,
  };
}

