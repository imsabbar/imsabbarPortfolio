# Graph Report - imsabbarPortfolio  (2026-08-17)

## Corpus Check
- 120 files · ~156,630 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 911 nodes · 2030 edges · 48 communities (45 shown, 3 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 28 edges (avg confidence: 0.51)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bdf705b8`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- isDbConfigured
- lead/route.ts
- sample-data.ts
- canQueryDb
- dependencies
- compilerOptions
- 🔴 Critical Amendments (Apply First)
- LeadForm.tsx
- Locale
- Footer.tsx
- config.ts
- ClientHomeShell.tsx
- Ismail Sabbar — Public Portfolio & Conversion Engine
- CaseStudyGrid.tsx
- getLocalizedField
- 🔍 Independent Platform Audit — imsabbar.com Ecosystem
- Portfolio ↔ imsabbar OS Contract Notes
- 8. Admin UI Pages
- 4. Database Schema
- icons.tsx
- imsabbar OS — Portfolio Manager Module
- System Architecture & Technical Specification
- 17. v1.3 Production Control Plane
- Navbar.tsx
- 3. Core Architectural Invariants (Rules for AI Agents)
- TechStackBanner.tsx
- BookingGateModal.tsx
- Portfolio Implementation Progress
- سياسة الخصوصية
- next.config.ts
- icon.tsx
- ✨ Key Features & Interactive Systems
- postcss.config.mjs
- Privacy Policy
- Politique de confidentialité
- 9. Shared Components
- 12. Security
- 10. File Uploads
- 11. Lead Management
- 13. Cache Invalidation
- 🚢 Deployment Runbook (Hostinger / VPS / Node.js)
- 🛠️ Local Development & Quality Assurance
- 7. API Routes
- 16. Notes for the Implementing Agent
- rules/graphify.md
- workflows/graphify.md

## God Nodes (most connected - your core abstractions)
1. `Locale` - 53 edges
2. `Dictionary` - 52 edges
3. `getLocalizedField()` - 34 edges
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
- `Carousel()` --calls--> `getLocalizedField()`  [EXTRACTED]
  components/TestimonialCarousel.tsx → lib/db/helpers.ts
- `TestimonialCard()` --calls--> `getLocalizedField()`  [EXTRACTED]
  components/TestimonialCarousel.tsx → lib/db/helpers.ts
- `WhatsAppWidgetProps` --references--> `Dictionary`  [EXTRACTED]
  components/WhatsAppWidget.tsx → types/dictionary.ts

## Import Cycles
- None detected.

## Communities (48 total, 3 thin omitted)

### Community 0 - "isDbConfigured"
Cohesion: 0.06
Nodes (60): dynamic, extractBearer(), isTrustedOrigin(), isValidSecret(), parseBody(), POST(), runtime, ALLOWED_TAGS (+52 more)

### Community 1 - "lead/route.ts"
Cohesion: 0.07
Nodes (61): dynamic, GET(), runtime, dynamic, POST(), runtime, dynamic, POST() (+53 more)

### Community 2 - "sample-data.ts"
Cohesion: 0.07
Nodes (61): dynamic, EstimateDocument(), inputSchema, priceFor(), runtime, styles, LeadFormProps, getLocalizedList() (+53 more)

### Community 3 - "canQueryDb"
Cohesion: 0.08
Nodes (55): POST(), dynamic, GET(), runtime, dynamic, GET(), runtime, dynamic (+47 more)

### Community 4 - "dependencies"
Cohesion: 0.04
Nodes (48): file-type, framer-motion, mysql2, next, dependencies, file-type, framer-motion, mysql2 (+40 more)

### Community 5 - "compilerOptions"
Cohesion: 0.07
Nodes (26): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, **/*.ts, **/*.tsx (+18 more)

### Community 6 - "🔴 Critical Amendments (Apply First)"
Cohesion: 0.10
Nodes (19): CA-1. Remove or Implement Phantom SEO/Settings Keys, CA-2. Synchronize the `portfolio_leads` Schema, CA-3. Fix the n8n Node Validator Contract, CA-4. Decide the Fate of the Footer Content Block, CA-5. Fix Seed Data Bugs, CA-6. Resolve Privacy/Legal Docs Ownership, 🔴 Critical Amendments (Apply First), Executive Summary (+11 more)

### Community 7 - "LeadForm.tsx"
Cohesion: 0.09
Nodes (33): RoiCalculator, CheckIcon, DocumentIcon, SparklesIcon, ALLOWED_FILE_EXTENSIONS, ALLOWED_FILE_TYPES, EMPTY_VALUES, Field() (+25 more)

### Community 8 - "Locale"
Cohesion: 0.18
Nodes (18): B2BTrustBadgeProps, CaseStudyDetailProps, CaseStudyGridProps, ClientHomeShellProps, FaqSectionProps, FooterProps, NavbarProps, NotFoundClient() (+10 more)

### Community 9 - "Footer.tsx"
Cohesion: 0.13
Nodes (20): BookingGateModal(), Footer(), phoneToIntl(), CalendarIcon, MailIcon, MessageCircleIcon, PhoneIcon, ShieldCheckIcon (+12 more)

### Community 10 - "config.ts"
Cohesion: 0.06
Nodes (43): ibmPlexMono, ibmPlexSansArabic, inter, metadata, RootLayout(), RootLayoutProps, spaceGrotesk, viewport (+35 more)

### Community 11 - "ClientHomeShell.tsx"
Cohesion: 0.28
Nodes (6): B2BTrustBadge(), FaqSection(), PlusIcon, SearchIcon, AmbientGlowBackground(), AmbientGlowBackgroundProps

### Community 12 - "Ismail Sabbar — Public Portfolio & Conversion Engine"
Cohesion: 0.20
Nodes (10): 🏗️ Architecture & Technology Stack, Core Technologies, 🗄️ Database Architecture & Hostinger Setup, Database Initialization & Migration Scripts, ⚙️ Environment Variables Reference, 🌟 Executive Overview, 🔄 `imsabbar OS` Integration Contract, Ismail Sabbar — Public Portfolio & Conversion Engine (+2 more)

### Community 13 - "CaseStudyGrid.tsx"
Cohesion: 0.12
Nodes (19): CaseStudyGrid(), getCaseStudyTags(), N8nFlowSimulator, resolveCaseStudyImage(), PdfEstimateModal, BoltIcon, ClockIcon, CpuChipIcon (+11 more)

### Community 14 - "getLocalizedField"
Cohesion: 0.05
Nodes (56): GET(), revalidate, runtime, GET(), revalidate, runtime, CaseStudyDetailPage(), dynamic (+48 more)

### Community 15 - "🔍 Independent Platform Audit — imsabbar.com Ecosystem"
Cohesion: 0.17
Nodes (11): 1. Executive Rating & Verdict, 2. Key Strengths (Verified, Not Assumed), 3. Identified Gaps & Blindspots, 4. Priority Recommendations, **76 / 100 — "Strong engineering core, undermined by broken conversion paths and PRD/reality drift"**, A. Public Portfolio — fix order, B. imsabbar OS PRD — amendments before implementation, 🔴 HIGH (+3 more)

### Community 16 - "Portfolio ↔ imsabbar OS Contract Notes"
Cohesion: 0.20
Nodes (10): 1. Cache revalidation endpoint, 2. `portfolio_leads` nullability, 3. Additional lead columns, 4. Cache tags, 5. Settings vs. content blocks, 6. Health checks, 7. Control Plane Enhancements (Mandatory for OS Agent), 8. v1.5.0 SEO & Search Engine Management (+2 more)

### Community 17 - "8. Admin UI Pages"
Cohesion: 0.10
Nodes (20): 8.10 Pricing (`/portfolio-manager/pricing`), 8.11 Contact & Social (`/portfolio-manager/contact-social`), 8.12 Settings (`/portfolio-manager/settings`), 8.13.1 Lead Inbox Behavior, 8.13 Leads (`/portfolio-manager/leads`), 8.14 Trust Bar (`/portfolio-manager/trust-bar`), 8.15 Contact Intro (`/portfolio-manager/contact`), 8.16 Footer (`/portfolio-manager/footer`) (+12 more)

### Community 18 - "4. Database Schema"
Cohesion: 0.14
Nodes (14): 4.10 Leads, 4.11 Schema Migrations Tracking, 4.12 Audit Log, 4.13 Revision Snapshots, 4.1 Plans & Pricing, 4.2 Services, 4.3 Tech Stack, 4.4 Case Studies (+6 more)

### Community 19 - "icons.tsx"
Cohesion: 0.11
Nodes (18): About(), AboutProps, AboutStatsValues, getPrincipleIcon(), getStatIcon(), BriefcaseIcon, CheckCircleIcon, CodeIcon (+10 more)

### Community 20 - "imsabbar OS — Portfolio Manager Module"
Cohesion: 0.15
Nodes (12): 14. Environment Variables, 15. Integration Checklist, 1. Purpose, 2.1 Database Separation, 2.2 Code Organization, 2. Architecture, 3. Module Registration, 5.1 JSON Column Shapes (+4 more)

### Community 21 - "System Architecture & Technical Specification"
Cohesion: 0.25
Nodes (5): 1. Executive System Topology, 2. Directory Structure & Key Subsystems, 4. Inbound Lead & Notification Pipeline, 5. Caching & Static Site Generation (SSG/ISR) Strategy, System Architecture & Technical Specification

### Community 22 - "17. v1.3 Production Control Plane"
Cohesion: 0.22
Nodes (9): 17.1 Scope and publishing model, 17.2 Security and permissions, 17.3 Credential Center, 17.4 Manager APIs, 17.5 Operations and health, 17.6 Additive migration contract, 17.7 Acceptance gates, 17.8 Deployment checklist boundary (+1 more)

### Community 23 - "Navbar.tsx"
Cohesion: 0.16
Nodes (11): BrandLogo(), BrandLogoProps, MoonIcon, SunIcon, localePillLabels, Navbar(), SECTION_IDS, SectionId (+3 more)

### Community 24 - "3. Core Architectural Invariants (Rules for AI Agents)"
Cohesion: 0.29
Nodes (7): 3. Core Architectural Invariants (Rules for AI Agents), Invariant 1: Public Portfolio is Read-Only for Content, Invariant 2: `portfolio_leads` Nullability, Invariant 3: Tri-Lingual Dictionary Parity, Invariant 4: Arabic Typography & RTL Rules, Invariant 5: Cache Revalidation Contract, Invariant 6: Knowledge Graph Maintenance

### Community 25 - "TechStackBanner.tsx"
Cohesion: 0.12
Nodes (16): Markdown, nodeTypeKey, ArrowLeftIcon, ArrowRightIcon, ExternalLinkIcon, GithubIcon, categorizeTech(), CATEGORY_TABS (+8 more)

### Community 26 - "BookingGateModal.tsx"
Cohesion: 0.15
Nodes (14): BookingGateModalProps, CalEmbed(), CalGlobal, CalNamespace, loadCalScript(), parseLink(), Window, BookingGateModal (+6 more)

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

### Community 31 - "✨ Key Features & Interactive Systems"
Cohesion: 0.29
Nodes (7): 1. 🌐 Tri-Lingual Internationalization (`en` / `fr` / `ar`), 2. ⚡ Interactive n8n Workflow Simulator, 3. 📊 Dynamic ROI Savings Calculator, 4. 🚀 4-Step Enterprise Lead Engine, 5. 📅 Cal.com Booking Gate & Fallbacks, 6. 📄 Real-Time PDF Estimate Proposal Generator, ✨ Key Features & Interactive Systems

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
Cohesion: 0.33
Nodes (6): 10.1 Storage Location, 10.2 Allowed File Types, 10.3 File Naming, 10.4 Serving Files, 10.5 Media Lifecycle and Orphan Cleanup, 10. File Uploads

### Community 39 - "11. Lead Management"
Cohesion: 0.33
Nodes (6): 11.1 Lead Sources, 11.2 Lead Notifications, 11.3 Lead Workflow, 11.4.1 CSV Export Specification, 11.4 Export, 11. Lead Management

### Community 40 - "13. Cache Invalidation"
Cohesion: 0.33
Nodes (6): 13.1 Revalidation Tags, 13.2 Portfolio Endpoint, 13.3.1 Revalidation Ordering & Failure Semantics, 13.3 Implementation, 13.4 Local Testing, 13. Cache Invalidation

### Community 41 - "🚢 Deployment Runbook (Hostinger / VPS / Node.js)"
Cohesion: 0.50
Nodes (4): 1. Build Production Artifacts, 2. Prepare Standalone Bundle, 3. Launch via PM2 or Node.js, 🚢 Deployment Runbook (Hostinger / VPS / Node.js)

### Community 42 - "🛠️ Local Development & Quality Assurance"
Cohesion: 0.50
Nodes (4): Installation & Run, 🛠️ Local Development & Quality Assurance, Prerequisites, Production Build & Typecheck

### Community 43 - "7. API Routes"
Cohesion: 0.50
Nodes (4): 7.1 Standard REST Pattern, 7.2 Special Routes, 7.3 Cache Invalidation Route, 7. API Routes

### Community 44 - "16. Notes for the Implementing Agent"
Cohesion: 0.67
Nodes (3): 16. Notes for the Implementing Agent, Optional Quality-of-Life Features, Required Production Features (promoted from optional)

## Knowledge Gaps
- **374 isolated node(s):** `runtime`, `dynamic`, `revalidate`, `PageProps`, `spaceGrotesk` (+369 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **3 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Locale` connect `Locale` to `sample-data.ts`, `canQueryDb`, `LeadForm.tsx`, `Footer.tsx`, `config.ts`, `ClientHomeShell.tsx`, `CaseStudyGrid.tsx`, `getLocalizedField`, `Navbar.tsx`, `TechStackBanner.tsx`, `BookingGateModal.tsx`?**
  _High betweenness centrality (0.045) - this node is a cross-community bridge._
- **Why does `Dictionary` connect `Locale` to `lead/route.ts`, `sample-data.ts`, `LeadForm.tsx`, `Footer.tsx`, `ClientHomeShell.tsx`, `CaseStudyGrid.tsx`, `getLocalizedField`, `icons.tsx`, `Navbar.tsx`, `TechStackBanner.tsx`, `BookingGateModal.tsx`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Why does `isDbConfigured()` connect `isDbConfigured` to `lead/route.ts`, `sample-data.ts`, `canQueryDb`, `getLocalizedField`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **What connects `runtime`, `dynamic`, `revalidate` to the rest of the system?**
  _374 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `isDbConfigured` be split into smaller, more focused modules?**
  _Cohesion score 0.0554954954954955 - nodes in this community are weakly interconnected._
- **Should `lead/route.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06627175120325805 - nodes in this community are weakly interconnected._
- **Should `sample-data.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06778846153846153 - nodes in this community are weakly interconnected._