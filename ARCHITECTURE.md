# System Architecture & Technical Specification

> **Repository**: `imsabbarPortfolio`  
> **Production URL**: [imsabbar.com](https://imsabbar.com)  
> **Last Updated**: August 2026  
> **Intended Audience**: Senior Engineers, AI Coding Agents (Codex, Claude, Antigravity)

---

## 1. Executive System Topology

The **Ismail Sabbar Portfolio & Conversion Engine** is a high-performance, tri-lingual client conversion portal designed under the *"Engineered Precision"* design system. It operates as a public read-optimized frontend backed by a Hostinger-hosted MySQL 8 database, with write operations strictly partitioned between visitor lead ingestion and centralized administrative control from the companion **`imsabbar OS`** application.

```
                                  ┌───────────────────────────────┐
                                  │      Cloudflare Edge CDN      │
                                  │   (DNS, SSL, Zaraz, Turnstile)│
                                  └───────────────┬───────────────┘
                                                  │ HTTPS
                                  ┌───────────────▼───────────────┐
                                  │      Next.js 15 App Router    │
                                  │     (Node.js Standalone Mode) │
                                  └───────┬───────────────┬───────┘
                                          │               │
                     ┌────────────────────┴─────┐   ┌─────┴──────────────────┐
                     │ Server Components (RSC)  │   │ API Routes (Edge/Node) │
                     │   • app/[locale]/page    │   │   • /api/lead          │
                     │   • app/[locale]/cases   │   │   • /api/revalidate    │
                     │   • app/[locale]/privacy │   │   • /api/estimate      │
                     └────────────┬─────────────┘   └─────┬──────────────────┘
                                  │                       │
                     ┌────────────▼───────────────────────▼────────┐
                     │           lib/sections Aggregator           │
                     │       (Promise.allSettled + ISR Cache)      │
                     └────────────────────┬────────────────────────┘
                                          │
                     ┌────────────────────▼────────────────────────┐
                     │            MySQL2 Connection Pool           │
                     │       (globalThis Singleton · SSL · TCP)    │
                     └────────────────────┬────────────────────────┘
                                          │
                     ┌────────────────────▼────────────────────────┐
                     │       Hostinger MySQL 8 Database            │
                     │       (9 Normalized Dynamic Tables)         │
                     └─────────────────────────────────────────────┘
```

---

## 2. Directory Structure & Key Subsystems

```
├── app/
│   ├── [locale]/                 # Dynamic Tri-Lingual App Router Routes
│   │   ├── layout.tsx            # Root layout: font loaders, FOUC guard, dict injection
│   │   ├── page.tsx              # Home Page RSC: parallel data fetch & SEO JsonLd
│   │   ├── case-studies/[slug]/  # Dynamic Case Study Detail SSG/ISR pages
│   │   ├── privacy/              # Privacy Policy localized page
│   │   └── opengraph-image.tsx   # Dynamic OpenGraph social preview image generator
│   ├── api/
│   │   ├── revalidate/           # On-demand cache invalidation (Bearer token + OS Origin)
│   │   ├── lead/                 # Multi-step form submission + Turnstile + after() dispatch
│   │   │   ├── booking/          # Cal.com pre-qualification gate lead ingestion
│   │   │   └── click/            # WhatsApp click attribution tracker
│   │   ├── estimate/             # Server-rendered PDF proposal generator (@react-pdf)
│   │   └── health/               # DB connectivity & upload folder health check
│   ├── globals.css               # Design tokens, fluid typography, dark/light, RTL guards
│   ├── sitemap.ts                # Multilingual sitemap with hreflang alternates
│   └── robots.ts                 # Crawler access rules & sitemap pointer
│
├── components/                   # React 19 UI & Client Widgets
│   ├── ui/                       # Atomic UI primitives (Modal, SpotlightCard, AmbientGlow)
│   ├── Navbar.tsx                # Sticky navbar, magnetic pills, mobile hamburger drawer
│   ├── Hero.tsx                  # Hero section with animated status badge & primary CTAs
│   ├── About.tsx                 # About copy, principles, animated count-up stats
│   ├── ServicesGrid.tsx          # Interactive service cards with deliverables
│   ├── TechStackBanner.tsx       # Filterable tech stack tabs with proficiency tags
│   ├── CaseStudyGrid.tsx         # Filterable case study showcase with metrics
│   ├── CaseStudyDetail.tsx       # Deep-dive case study page with X-Ray specs & n8n nodes
│   ├── TestimonialCarousel.tsx   # Client reviews (grid <=3, carousel >=4)
│   ├── PricingMatrix.tsx         # Multi-currency pricing tiers with dynamic pill selector
│   ├── RoiCalculator.tsx         # Client-side ROI savings calculator with session memory
│   ├── N8nFlowSimulator.tsx      # 4-step live workflow simulation with latency metrics
│   ├── LeadForm.tsx              # 4-step enterprise lead engine with file attachments
│   ├── BookingGateModal.tsx      # Cal.com pre-qualification modal & fallback
│   ├── PdfEstimateModal.tsx      # Real-time PDF proposal generator modal
│   ├── WhatsAppWidget.tsx        # Floating corner WhatsApp button with pulse indicator
│   └── JsonLd.tsx                # Knowledge Graph Person, ProfessionalService & FAQPage schemas
│
├── lib/
│   ├── db/
│   │   ├── mysql.ts              # Singleton MySQL pool with graceful offline fallback
│   │   ├── helpers.ts            # getLocalizedField() & SQL helpers
│   │   └── repositories/         # Typed data access layer (plans, services, caseStudies, etc.)
│   ├── sections/index.ts         # Server-side section aggregator (getHomePageSections)
│   ├── lead-ingestion.ts         # Ingestion methods (insertFormLead, insertBookingLead)
│   ├── lead-dispatch.ts          # Non-blocking async dispatch (Telegram bot & Resend email)
│   ├── cache-tags.ts             # Canonical cache tag definitions
│   ├── currency.ts               # Multi-currency exchange rate & formatting helpers
│   └── sample-data.ts            # Development & offline fallback fixture data
│
├── dictionaries/                 # Tri-Lingual Content Translations
│   ├── en.json                   # English UI strings
│   ├── fr.json                   # French UI strings
│   └── ar.json                   # Arabic UI strings (Native RTL)
│
├── scripts/
│   ├── 01-schema.sql             # Canonical MySQL schema with indexes and nullable leads
│   └── 02-seed-data.sql          # Complete tri-lingual seed dataset
│
└── graphify-out/                 # Graphify Knowledge Graph artifacts (graph.html, graph.json)
```

---

## 3. Core Architectural Invariants (Rules for AI Agents)

When editing or extending this codebase, **all AI agents and developers must strictly obey these invariants**:

### Invariant 1: Public Portfolio is Read-Only for Content
- The public portfolio NEVER writes to `portfolio_settings`, `portfolio_content_blocks`, `portfolio_services`, `portfolio_plans`, `portfolio_case_studies`, `portfolio_tech_stack`, `portfolio_testimonials`, `portfolio_client_logos`, or `portfolio_faq`.
- **`imsabbar OS` is the sole author and writer** for all content tables.

### Invariant 2: `portfolio_leads` Nullability
- `portfolio_leads.name` and `portfolio_leads.email` are **`NULL`able**.
- Anonymous visitors who complete the Cal.com booking gate or click the direct WhatsApp line produce lead records where `name` and `email` are `NULL`. Never add a `NOT NULL` constraint to these columns.

### Invariant 3: Tri-Lingual Dictionary Parity
- UI strings are strictly maintained in `dictionaries/{en,fr,ar}.json`.
- When adding a new dictionary key, **you must add it to all three files (`en.json`, `fr.json`, `ar.json`)**.
- The TypeScript interface `types/dictionary.ts` must reflect any new keys.

### Invariant 4: Arabic Typography & RTL Rules
- Arabic text must use `IBM Plex Sans Arabic` and have `letter-spacing: 0` (`[dir="rtl"]` rule in `globals.css`).
- Never apply letter-spacing/tracking classes (e.g. `tracking-wider`, `tracking-tight`) to Arabic text.

### Invariant 5: Cache Revalidation Contract
- The endpoint `POST /api/revalidate` requires:
  - Header: `Authorization: Bearer <PORTFOLIO_REVALIDATE_SECRET>`
  - Header: `Content-Type: application/json`
  - Body: `{ "tags": ["portfolio_plans", "portfolio_settings"] }` (must be an **array** of tags).
- Tag names are strictly defined in `lib/cache-tags.ts`.

### Invariant 6: Knowledge Graph Maintenance
- After completing significant code or architectural changes, run:
  ```bash
  graphify update .
  ```
  to keep `graphify-out/graph.json` and `graph.html` synchronized with the AST.

---

## 4. Inbound Lead & Notification Pipeline

```
1. Visitor submits Lead Form / Booking Gate / WhatsApp Click
   │
   ▼
2. API Route (/api/lead, /api/lead/booking, /api/lead/click)
   ├── Turnstile Token Validation (Cloudflare API)
   ├── Honeypot & Timestamp Verification (< 2.5s reject)
   ├── IP Hash & Rate Limiting Check (Max 3 leads/hour per IP hash)
   └── 5MB Attachment MIME verification (libmagic / file-type)
   │
   ▼
3. MySQL Lead Ingestion (portfolio_leads table)
   │
   ▼
4. Non-blocking Background Execution via after()
   ├── Telegram Bot Alert (sendTelegramLeadSummary)
   ├── Admin Notification Email (Resend API)
   └── Client Auto-Reply with SLA Guarantee (Resend API)
```

---

## 5. Caching & Static Site Generation (SSG/ISR) Strategy

- **Home Page (`/[locale]`)**:
  - Pre-rendered as static HTML for all 3 locales (`en`, `fr`, `ar`) at build time (`● SSG`).
  - Uses `getHomePageSections()` with parallel `Promise.allSettled`.
  - Revalidated on-demand via tags triggered by `imsabbar OS`.
- **Case Study Detail Pages (`/[locale]/case-studies/[slug]`)**:
  - Pre-rendered with `generateStaticParams()` across all 3 locales and all published case study slugs.
  - Revalidation interval: 1 hour (`revalidate = 3600`) + on-demand revalidation via `portfolio_case_studies` tag.
- **Client Widgets**:
  - Heavy interactive client components (`RoiCalculator`, `N8nFlowSimulator`, `BookingGateModal`, `PdfEstimateModal`) are dynamically imported with `{ ssr: false }` to minimize first-load JS.
