# Graph Report - imsabbarPortfolio  (2026-08-17)

## Corpus Check
- 118 files · ~150,541 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 871 nodes · 1967 edges · 49 communities (44 shown, 5 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c065b43e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- isDbConfigured
- lead/route.ts
- sample-data.ts
- canQueryDb
- dependencies
- compilerOptions
- helpers.ts
- LeadForm.tsx
- Locale
- BookingGateModal.tsx
- config.ts
- ClientHomeShell.tsx
- Ismail Sabbar — Public Portfolio & Conversion Engine
- CaseStudyGrid.tsx
- Hero.tsx
- portfolio.ts
- getLocalizedField
- 8. Admin UI Pages
- 4. Database Schema
- icons.tsx
- imsabbar OS — Portfolio Manager Module
- route.tsx
- 17. v1.3 Production Control Plane
- Footer.tsx
- TechStackBanner.tsx
- TestimonialCarousel.tsx
- CalEmbed.tsx
- Portfolio Implementation Progress
- سياسة الخصوصية
- next.config.ts
- icon.tsx
- robots.ts
- postcss.config.mjs
- Privacy Policy
- Politique de confidentialité
- 9. Shared Components
- 12. Security
- 10. File Uploads
- 11. Lead Management
- 13. Cache Invalidation
- llms.txt/route.ts
- sitemap.ts
- 7. API Routes
- 16. Notes for the Implementing Agent
- 2. Architecture
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `Locale` - 53 edges
2. `Dictionary` - 52 edges
3. `getLocalizedField()` - 32 edges
4. `isDbConfigured()` - 32 edges
5. `canQueryDb()` - 31 edges
6. `err()` - 28 edges
7. `dbNotConfigured()` - 28 edges
8. `ok()` - 21 edges
9. `getHomePageSections()` - 20 edges
10. `trackEvent()` - 19 edges

## Surprising Connections (you probably didn't know these)
- `POST()` --indirect_call--> `sampleToPlan()`  [INFERRED]
  app/api/estimate/route.tsx → lib/sample-data.ts
- `MobileBottomBarProps` --references--> `Dictionary`  [EXTRACTED]
  components/MobileBottomBar.tsx → types/dictionary.ts
- `N8nFlowSimulator()` --calls--> `trackEvent()`  [EXTRACTED]
  components/N8nFlowSimulator.tsx → lib/analytics.ts
- `Carousel()` --calls--> `getLocalizedField()`  [EXTRACTED]
  components/TestimonialCarousel.tsx → lib/db/helpers.ts
- `TestimonialCard()` --calls--> `getLocalizedField()`  [EXTRACTED]
  components/TestimonialCarousel.tsx → lib/db/helpers.ts

## Import Cycles
- None detected.

## Communities (49 total, 5 thin omitted)

### Community 0 - "isDbConfigured"
Cohesion: 0.06
Nodes (59): dynamic, extractBearer(), isTrustedOrigin(), isValidSecret(), parseBody(), POST(), runtime, ALLOWED_TAGS (+51 more)

### Community 1 - "lead/route.ts"
Cohesion: 0.06
Nodes (65): dynamic, GET(), runtime, dynamic, POST(), runtime, dynamic, POST() (+57 more)

### Community 2 - "sample-data.ts"
Cohesion: 0.08
Nodes (34): aboutContentEn, bookingBudgetRanges, bookingProjectTypes, contactContentEn, Currency, footerContentEn, getSampleCaseStudyBySlug(), getSampleHomeData() (+26 more)

### Community 3 - "canQueryDb"
Cohesion: 0.08
Nodes (55): POST(), dynamic, GET(), runtime, dynamic, GET(), runtime, dynamic (+47 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (48): file-type, framer-motion, mysql2, next, dependencies, file-type, framer-motion, mysql2 (+40 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 6 - "helpers.ts"
Cohesion: 0.22
Nodes (7): ClientLogosSection(), safeAssetUrl(), safeWebsiteUrl(), SETTINGS_KEYS, SettingsKey, LocalizedString, LocalizedStringList

### Community 7 - "LeadForm.tsx"
Cohesion: 0.09
Nodes (30): RoiCalculator, CheckCircleIcon, CheckIcon, SendIcon, SparklesIcon, ALLOWED_FILE_EXTENSIONS, ALLOWED_FILE_TYPES, EMPTY_VALUES (+22 more)

### Community 8 - "Locale"
Cohesion: 0.19
Nodes (19): B2BTrustBadgeProps, BookingGateModalProps, CaseStudyDetailProps, CaseStudyGridProps, ClientHomeShellProps, FaqSectionProps, FooterProps, HeroProps (+11 more)

### Community 9 - "BookingGateModal.tsx"
Cohesion: 0.13
Nodes (20): BookingGateModal(), BookingGateModal, FaqSection(), CalendarIcon, MessageCircleIcon, PlusIcon, SearchIcon, FileDropzone() (+12 more)

### Community 10 - "config.ts"
Cohesion: 0.05
Nodes (45): ibmPlexMono, ibmPlexSansArabic, inter, metadata, RootLayout(), RootLayoutProps, spaceGrotesk, viewport (+37 more)

### Community 11 - "ClientHomeShell.tsx"
Cohesion: 0.23
Nodes (7): PdfEstimateModal, PrinterIcon, DomainStyle, getDomainStyle(), ServicesGrid(), AmbientGlowBackground(), AmbientGlowBackgroundProps

### Community 12 - "Ismail Sabbar — Public Portfolio & Conversion Engine"
Cohesion: 0.04
Nodes (46): 1. Executive System Topology, 2. Directory Structure & Key Subsystems, 3. Core Architectural Invariants (Rules for AI Agents), 4. Inbound Lead & Notification Pipeline, 5. Caching & Static Site Generation (SSG/ISR) Strategy, Invariant 1: Public Portfolio is Read-Only for Content, Invariant 2: `portfolio_leads` Nullability, Invariant 3: Tri-Lingual Dictionary Parity (+38 more)

### Community 13 - "CaseStudyGrid.tsx"
Cohesion: 0.15
Nodes (16): CaseStudyGrid(), getCaseStudyTags(), N8nFlowSimulator, resolveCaseStudyImage(), ClockIcon, CpuChipIcon, XIcon, N8nFlowSimulator() (+8 more)

### Community 14 - "Hero.tsx"
Cohesion: 0.11
Nodes (21): Hero(), SpecChip, DownloadIcon, resolveUrl(), SocialLinks(), SocialLinksProps, SocialProfile, useRevealOnView() (+13 more)

### Community 15 - "portfolio.ts"
Cohesion: 0.29
Nodes (19): LeadFormProps, SampleHomeData, HomePageData, pickBlock(), AboutContent, CaseStudy, ClientLogo, ContactContent (+11 more)

### Community 16 - "getLocalizedField"
Cohesion: 0.17
Nodes (17): GET(), revalidate, runtime, CaseStudyDetailPage(), dynamic, generateMetadata(), generateStaticParams(), PageProps (+9 more)

### Community 17 - "8. Admin UI Pages"
Cohesion: 0.11
Nodes (19): 8.10 Pricing (`/portfolio-manager/pricing`), 8.11 Contact & Social (`/portfolio-manager/contact-social`), 8.12 Settings (`/portfolio-manager/settings`), 8.13 Leads (`/portfolio-manager/leads`), 8.14 Trust Bar (`/portfolio-manager/trust-bar`), 8.15 Contact Intro (`/portfolio-manager/contact`), 8.16 Footer (`/portfolio-manager/footer`), 8.1 Dashboard (`/portfolio-manager`) (+11 more)

### Community 18 - "4. Database Schema"
Cohesion: 0.18
Nodes (11): 4.10 Leads, 4.1 Plans & Pricing, 4.2 Services, 4.3 Tech Stack, 4.4 Case Studies, 4.5 Testimonials, 4.6 Client Logos, 4.7 FAQ (+3 more)

### Community 19 - "icons.tsx"
Cohesion: 0.12
Nodes (19): About(), AboutProps, AboutStatsValues, getPrincipleIcon(), getStatIcon(), B2BTrustBadge(), BriefcaseIcon, CodeIcon (+11 more)

### Community 20 - "imsabbar OS — Portfolio Manager Module"
Cohesion: 0.20
Nodes (9): 14. Environment Variables, 15. Integration Checklist, 1. Purpose, 3. Module Registration, 5.1 JSON Column Shapes, 5. Types & Schemas, 6. Repository Layer, imsabbar OS — Portfolio Manager Module (+1 more)

### Community 21 - "route.tsx"
Cohesion: 0.25
Nodes (8): dynamic, EstimateDocument(), inputSchema, priceFor(), runtime, styles, samplePlans, sampleSettings

### Community 22 - "17. v1.3 Production Control Plane"
Cohesion: 0.22
Nodes (9): 17.1 Scope and publishing model, 17.2 Security and permissions, 17.3 Credential Center, 17.4 Manager APIs, 17.5 Operations and health, 17.6 Additive migration contract, 17.7 Acceptance gates, 17.8 Deployment checklist boundary (+1 more)

### Community 23 - "Footer.tsx"
Cohesion: 0.12
Nodes (16): BrandLogo(), BrandLogoProps, Footer(), phoneToIntl(), LayersIcon, MailIcon, MoonIcon, PhoneIcon (+8 more)

### Community 24 - "TechStackBanner.tsx"
Cohesion: 0.27
Nodes (9): BoltIcon, serviceIconMap, categorizeTech(), CATEGORY_TABS, CategoryKey, CategoryTab, getTechBadge(), getTechRole() (+1 more)

### Community 25 - "TestimonialCarousel.tsx"
Cohesion: 0.14
Nodes (11): Markdown, nodeTypeKey, ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, GithubIcon, Carousel(), TestimonialCard() (+3 more)

### Community 26 - "CalEmbed.tsx"
Cohesion: 0.38
Nodes (6): CalEmbed(), CalGlobal, CalNamespace, loadCalScript(), parseLink(), Window

### Community 27 - "Portfolio Implementation Progress"
Cohesion: 0.22
Nodes (8): Notes, Phase 1 — Cleanup, Critical Fixes & Design System ✅ DONE, Phase 2 — Dynamic Data Layer ✅ IMPLEMENTED, Phase 3 — Sections & Currency ✅ IMPLEMENTED, Portfolio Implementation Progress, Remaining Phases, Top master-class priorities if work continues, Verification

### Community 28 - "سياسة الخصوصية"
Cohesion: 0.29
Nodes (6): 1. البيانات المجمَّعة, 2. نموذج التواصل, 3. ملفات تعريف الارتباط (Cookies), 4. حقوقك, 5. تحديثات هذه السياسة, سياسة الخصوصية

### Community 29 - "next.config.ts"
Cohesion: 0.33
Nodes (5): calOrigins, configuredCalOrigins, contentSecurityPolicy, nextConfig, securityHeaders

### Community 30 - "icon.tsx"
Cohesion: 0.40
Nodes (3): contentType, runtime, size

### Community 34 - "Privacy Policy"
Cohesion: 0.29
Nodes (6): 1. Data collected, 2. Contact form, 3. Cookies, 4. Your rights, 5. Updates to this policy, Privacy Policy

### Community 35 - "Politique de confidentialité"
Cohesion: 0.29
Nodes (6): 1. Données collectées, 2. Formulaire de contact, 3. Cookies, 4. Vos droits, 5. Mises à jour de cette politique, Politique de confidentialité

### Community 36 - "9. Shared Components"
Cohesion: 0.29
Nodes (7): 9.1 `I18nTabs`, 9.2 `DataTable`, 9.3 `ImageUploader`, 9.4 Structured Editors (replaces raw `JsonEditor`), 9.5 `LeadStatusBadge`, 9.6 Media Library, 9. Shared Components

### Community 37 - "12. Security"
Cohesion: 0.33
Nodes (6): 12.1 Authentication, 12.2 Input Validation, 12.3 SQL Injection Prevention, 12.4 File Upload Security, 12.5 CSRF Protection, 12. Security

### Community 38 - "10. File Uploads"
Cohesion: 0.40
Nodes (5): 10.1 Storage Location, 10.2 Allowed File Types, 10.3 File Naming, 10.4 Serving Files, 10. File Uploads

### Community 39 - "11. Lead Management"
Cohesion: 0.40
Nodes (5): 11.1 Lead Sources, 11.2 Lead Notifications, 11.3 Lead Workflow, 11.4 Export, 11. Lead Management

### Community 40 - "13. Cache Invalidation"
Cohesion: 0.40
Nodes (5): 13.1 Revalidation Tags, 13.2 Portfolio Endpoint, 13.3 Implementation, 13.4 Local Testing, 13. Cache Invalidation

### Community 42 - "sitemap.ts"
Cohesion: 0.83
Nodes (3): localizedUrl(), sitemap(), siteUrl()

### Community 43 - "7. API Routes"
Cohesion: 0.50
Nodes (4): 7.1 Standard REST Pattern, 7.2 Special Routes, 7.3 Cache Invalidation Route, 7. API Routes

### Community 44 - "16. Notes for the Implementing Agent"
Cohesion: 0.67
Nodes (3): 16. Notes for the Implementing Agent, Optional Quality-of-Life Features, Required Production Features (promoted from optional)

### Community 45 - "2. Architecture"
Cohesion: 0.67
Nodes (3): 2.1 Database Separation, 2.2 Code Organization, 2. Architecture

## Knowledge Gaps
- **345 isolated node(s):** `runtime`, `dynamic`, `revalidate`, `PageProps`, `spaceGrotesk` (+340 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `Locale` to `canQueryDb`, `helpers.ts`, `LeadForm.tsx`, `BookingGateModal.tsx`, `config.ts`, `sitemap.ts`, `ClientHomeShell.tsx`, `CaseStudyGrid.tsx`, `Hero.tsx`, `portfolio.ts`, `getLocalizedField`, `icons.tsx`, `route.tsx`, `Footer.tsx`, `TechStackBanner.tsx`, `TestimonialCarousel.tsx`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Dictionary` connect `Locale` to `lead/route.ts`, `helpers.ts`, `LeadForm.tsx`, `BookingGateModal.tsx`, `config.ts`, `ClientHomeShell.tsx`, `CaseStudyGrid.tsx`, `Hero.tsx`, `portfolio.ts`, `icons.tsx`, `route.tsx`, `Footer.tsx`, `TechStackBanner.tsx`, `TestimonialCarousel.tsx`?**
  _High betweenness centrality (0.030) - this node is a cross-community bridge._
- **Why does `isDbConfigured()` connect `isDbConfigured` to `getLocalizedField`, `lead/route.ts`, `canQueryDb`, `portfolio.ts`?**
  _High betweenness centrality (0.025) - this node is a cross-community bridge._
- **What connects `runtime`, `dynamic`, `revalidate` to the rest of the system?**
  _345 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `isDbConfigured` be split into smaller, more focused modules?**
  _Cohesion score 0.05664568678267309 - nodes in this community are weakly interconnected._
- **Should `lead/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.059720869847452125 - nodes in this community are weakly interconnected._
- **Should `sample-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.0773109243697479 - nodes in this community are weakly interconnected._