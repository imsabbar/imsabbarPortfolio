# imsabbar OS — Portfolio Manager Module
## Product Requirements Document (PRD)
**Version:** 1.3.0  
**Owner:** Ismail Sabbar  
**Parent App:** imsabbar OS  
**Target:** Hostinger MySQL database (shared with public portfolio)  
**Paired PRD:** `IMSABBAR_PORTFOLIO_V2_MASTER_PRD.md` (v3.1.0)  

**Changelog v1.3.0 (2026-08-13):** Upgraded the module to an immediate-live portfolio control plane with complete business-content coverage, encrypted credentials, authenticated lead operations, additive migrations, audit snapshots, rollback, provider health checks, cache feedback, and explicit Hostinger deployment boundaries. The public portfolio remains read-only.
**Tech Stack:** Next.js 16 · React 19 · TypeScript 5.7 · Tailwind CSS · shadcn/ui · mysql2 · SWR

---

## 1. Purpose

Build a module inside **imsabbar OS** to manage all dynamic content for the public Ismail Sabbar portfolio website.

The public portfolio has **no admin panel**. This module is the single source of truth for all portfolio content, settings, and leads.

---

## 2. Architecture

```
┌─────────────────────────────────────────┐
│           imsabbar OS                   │
│  ┌─────────────────────────────────┐    │
│  │   Portfolio Manager Module      │    │
│  │   (this PRD)                    │    │
│  │                                 │    │
│  │  - CRUD all content             │    │
│  │  - Manage leads                 │    │
│  │  - Upload files                 │    │
│  │  - Trigger cache invalidation   │    │
│  └─────────────────────────────────┘    │
│              │ writes                    │
└──────────────┼──────────────────────────┘
               │
               ▼
        Hostinger MySQL
  (portfolio_* tables)
               ▲
               │ reads
┌──────────────┼──────────────────────────┐
│  Public Portfolio                       │
│  (Next.js 15, read-only)                │
└─────────────────────────────────────────┘
```

### 2.1 Database Separation

- **SQLite (imsabbar.db):** Personal OS data only. Do NOT store portfolio content here.
- **Hostinger MySQL:** External/public data. This module adds `portfolio_*` tables alongside existing `chaptercharm_*` tables.

### 2.2 Code Organization

Follow the existing imsabbar OS conventions:

```
imsabbar-os/
├── app/
│   └── portfolio-manager/
│       ├── page.tsx                    # Dashboard
│       ├── hero/
│       ├── about/
│       ├── services/
│       ├── tech-stack/
│       ├── case-studies/
│       ├── testimonials/
│       ├── client-logos/
│       ├── faq/
│       ├── pricing/
│       ├── contact-social/
│       ├── settings/
│       └── leads/
├── app/api/
│   └── portfolio-manager/
│       ├── services/
│       ├── plans/
│       ├── case-studies/
│       ├── tech-stack/
│       ├── testimonials/
│       ├── client-logos/
│       ├── faq/
│       ├── content-blocks/
│       ├── settings/
│       └── leads/
├── lib/
│   └── portfolio/
│       ├── db.ts                       # MySQL connection
│       ├── schema.ts                   # Zod schemas
│       └── repositories/
│           ├── plans.repository.ts
│           ├── services.repository.ts
│           ├── techStack.repository.ts
│           ├── caseStudies.repository.ts
│           ├── testimonials.repository.ts
│           ├── clientLogos.repository.ts
│           ├── faq.repository.ts
│           ├── contentBlocks.repository.ts
│           ├── settings.repository.ts
│           └── leads.repository.ts
├── types/
│   └── portfolio.ts
└── components/
    └── portfolio-manager/
        ├── DataTable.tsx
        ├── I18nTabs.tsx
        ├── ImageUploader.tsx
        ├── RichTextEditor.tsx
        └── LeadStatusBadge.tsx
```

---

## 3. Module Registration

Register the module in the imsabbar OS module registry and dynamic sidebar.

```ts
{
  id: 'portfolio-manager',
  name: 'Portfolio Manager',
  description: 'Manage public portfolio content and leads',
  icon: 'Globe', // or appropriate lucide icon
  route: '/portfolio-manager',
  category: 'work',
  requiredRole: 'admin',
}
```

All module routes must be protected by `validateSession()`.

---

## 4. Database Schema

Create these tables in the Hostinger MySQL database.

> **i18n contract (mandatory):** every user-facing translatable field MUST use a
> `*_i18n` JSON column with shape `{ en, fr, ar }`. Never store translatable strings in
> `portfolio_settings` (single-language TEXT only). See §5.1 for shapes.

### 4.1 Plans & Pricing

```sql
CREATE TABLE portfolio_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_i18n JSON,
  badge VARCHAR(100),
  badge_i18n JSON,
  price_mad DECIMAL(10, 2) NOT NULL,
  price_eur DECIMAL(10, 2) NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  price_gbp DECIMAL(10, 2) NOT NULL,
  price_aed DECIMAL(10, 2) NOT NULL,
  billing_type ENUM('one_time', 'hourly', 'monthly') DEFAULT 'one_time',
  features_json JSON NOT NULL,
  turnaround VARCHAR(100) NOT NULL,
  turnaround_i18n JSON,
  cta_type ENUM('wizard', 'booking', 'whatsapp') DEFAULT 'wizard',
  is_popular BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
);
```

### 4.2 Services

```sql
CREATE TABLE portfolio_services (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_i18n JSON,
  category VARCHAR(100) NOT NULL,
  category_i18n JSON,
  description TEXT NOT NULL,
  description_i18n JSON,
  icon_name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_category (category),
  INDEX idx_active_sort (is_active, sort_order)
);
```

### 4.3 Tech Stack

```sql
CREATE TABLE portfolio_tech_stack (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  name_i18n JSON,
  category VARCHAR(100) NOT NULL,
  category_i18n JSON,
  proficiency INT NOT NULL CHECK (proficiency BETWEEN 1 AND 100),
  icon VARCHAR(255) NOT NULL,
  is_featured BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_featured_sort (is_featured, sort_order),
  INDEX idx_active_sort (is_active, sort_order)
);
```

### 4.4 Case Studies

```sql
CREATE TABLE portfolio_case_studies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  title VARCHAR(255) NOT NULL,
  title_i18n JSON,
  summary TEXT NOT NULL,
  summary_i18n JSON,
  client_name VARCHAR(255),
  client_region VARCHAR(100),
  client_region_i18n JSON,
  impact_metric VARCHAR(255),
  impact_metric_i18n JSON,
  before_metric VARCHAR(255),
  before_metric_i18n JSON,
  after_metric VARCHAR(255),
  after_metric_i18n JSON,
  improvement_percent INT,
  demo_url VARCHAR(500),
  github_url VARCHAR(500),
  image_url VARCHAR(500),
  xray_specs_json JSON,
  n8n_nodes_json JSON,
  body_i18n JSON,
  is_featured BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_featured_sort (is_featured, sort_order),
  INDEX idx_active_sort (is_active, sort_order)
);
```

### 4.5 Testimonials

```sql
CREATE TABLE portfolio_testimonials (
  id INT AUTO_INCREMENT PRIMARY KEY,
  client_name VARCHAR(255) NOT NULL,
  client_name_i18n JSON,
  company VARCHAR(255),
  company_i18n JSON,
  country VARCHAR(100),
  country_i18n JSON,
  quote TEXT NOT NULL,
  quote_i18n JSON,
  rating INT DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  is_b2b_verified BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
);
```

### 4.6 Client Logos

```sql
CREATE TABLE portfolio_client_logos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  company_name VARCHAR(255) NOT NULL,
  company_name_i18n JSON,
  logo_url VARCHAR(500) NOT NULL,
  website_url VARCHAR(500),
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
);
```

### 4.7 FAQ

```sql
CREATE TABLE portfolio_faq (
  id INT AUTO_INCREMENT PRIMARY KEY,
  question TEXT NOT NULL,
  question_i18n JSON,
  answer TEXT NOT NULL,
  answer_i18n JSON,
  category VARCHAR(100),
  category_i18n JSON,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_active_sort (is_active, sort_order)
);
```

### 4.8 Content Blocks

```sql
CREATE TABLE portfolio_content_blocks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  content_i18n JSON NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_section_key (section_key)
);
```

Supported `section_key` values:
- `hero`
- `trust_bar`
- `about`
- `contact`
- `footer`

### 4.9 Settings

```sql
CREATE TABLE portfolio_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Settings keys:
- `availability_status`
- `ice_registration_number`
- `contact_email`
- `contact_phone`
- `scheduling_link`
- `resume_en_filename`
- `resume_fr_filename`
- `social_links_json`
- `sla_notice`
- `resume_ar_filename` (optional; portfolio fallback order for `ar`: `resume_ar → resume_en`)
- `stats_years_value`
- `stats_clients_value`
- `stats_projects_value`
- `stats_reliability_value`

> **Note:** Stats **labels** (`stats_years_label`, `stats_clients_label`, `stats_projects_label`, `stats_reliability_label`) are NOT settings — they live in the `about` content block's i18n JSON (§4.8), because settings are single-language TEXT and must not hold translatable strings.

### 4.10 Leads

```sql
CREATE TABLE portfolio_leads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NULL,
  email VARCHAR(255) NULL,
  phone VARCHAR(100),
  company VARCHAR(255),
  country VARCHAR(100),
  currency VARCHAR(10) DEFAULT 'USD',
  service_interest VARCHAR(100),
  estimated_budget DECIMAL(10, 2),
  timeline VARCHAR(100),
  calculated_roi_savings TEXT,
  message TEXT,
  attachment_path VARCHAR(500),
  attachment_original_name VARCHAR(255) NULL,
  attachment_mime VARCHAR(100) NULL,
  attachment_size INT UNSIGNED NULL,
  source_page VARCHAR(255),
  source_type ENUM('form', 'booking', 'whatsapp') DEFAULT 'form',
  ip_hash VARCHAR(64),
  user_agent VARCHAR(255),
  locale VARCHAR(5) NOT NULL DEFAULT 'en',
  consent_at TIMESTAMP NULL,
  privacy_policy_version VARCHAR(40) NOT NULL DEFAULT '2026-08-13',
  internal_notes TEXT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  deleted_at TIMESTAMP NULL,
  status ENUM('new', 'contacted', 'qualified', 'converted', 'archived') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status_date (status, created_at),
  INDEX idx_source_type (source_type),
  INDEX idx_leads_email (email),
  INDEX idx_leads_company (company),
  INDEX idx_leads_locale_date (locale, created_at)
);
```

> `name` and `email` are **nullable** to support anonymous booking/WhatsApp lead rows
> (Master PRD v3.2). Form leads always populate both, but never assume `NOT NULL`.
>
> `calculated_roi_savings` is written by the public portfolio when a lead arrives
> pre-filled from the ROI calculator (Master PRD §9.7) — display it in the lead detail view.
>
> `is_read` powers the "unread leads" dashboard metric; `internal_notes` supports the
> notes field; `deleted_at` enables soft deletion instead of hard deletes.

---

## 5. Types & Schemas

Create `types/portfolio.ts` with TypeScript interfaces and `lib/portfolio/schema.ts` with Zod validation schemas.

Example pattern:

```ts
// types/portfolio.ts
export interface Plan {
  id: number;
  slug: string;
  title: string;
  title_i18n?: Record<string, string>;
  badge?: string;
  badge_i18n?: Record<string, string>;
  price_mad: number;
  price_eur: number;
  price_usd: number;
  price_gbp: number;
  price_aed: number;
  billing_type: 'one_time' | 'hourly' | 'monthly';
  features_json: Record<string, string[]>;
  turnaround: string;
  turnaround_i18n?: Record<string, string>;
  cta_type: 'wizard' | 'booking' | 'whatsapp';
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}
```

Use Zod for all API input validation.

### 5.1 JSON Column Shapes

All i18n JSON columns follow `{ en: "...", fr: "...", ar: "..." }`.

- `portfolio_plans.features_json`
  ```json
  {
    "en": ["Feature one", "Feature two"],
    "fr": ["Fonctionnalité un", "Fonctionnalité deux"],
    "ar": ["ميزة واحدة", "ميزتان"]
  }
  ```

- `portfolio_case_studies.xray_specs_json`
  ```json
  {
    "architecture": "n8n + Perfex CRM API",
    "stack": ["n8n", "PHP", "MySQL"],
    "executionTime": "< 150ms",
    "security": "HMAC SHA-256"
  }
  ```

- `portfolio_case_studies.n8n_nodes_json`
  ```json
  [
    {
      "id": 1,
      "name": "Webhook Listener",
      "type": "trigger",
      "description": "Ingests incoming lead payload",
      "latencyMs": 14,
      "samplePayload": { "event": "lead.created" }
    }
  ]
  ```

- `portfolio_case_studies.body_i18n` (markdown per locale — powers the public detail page)
  ```json
  {
    "en": "## Context\n\nThe client was losing leads...\n\n## Approach\n\n...",
    "fr": "## Contexte\n\n...",
    "ar": "..."
  }
  ```

- `portfolio_settings.social_links_json`
  ```json
  {
    "linkedin": "https://linkedin.com/in/sabbarismail",
    "github": "https://github.com/imsabbar",
    "youtube": "https://youtube.com/@imsabbar",
    "telegram": "https://t.me/imsabbar",
    "whatsapp": "https://wa.me/212681510095",
    "email": "mailto:contact@imsabbar.com"
  }
  ```

- `portfolio_content_blocks.content_i18n` (key: `hero`)
  ```json
  {
    "en": {
      "headline": "I build the automations...",
      "subhead": "Full-Stack Developer & Automation Engineer...",
      "cta_work": "See My Work",
      "cta_book": "Book a Call"
    },
    "fr": { ... },
    "ar": { ... }
  }
  ```

---

## 6. Repository Layer

Create one repository per entity in `lib/portfolio/repositories/`.

Each repository must provide:
- `findAll(options)` — list with filters
- `findById(id)` — single item
- `findBySlug(slug)` — for case studies
- `create(data)` — insert
- `update(id, data)` — update
- `delete(id)` — soft or hard delete
- `reorder(ids)` — update sort_order

Use parameterized queries only. No raw SQL concatenation.

Example:

```ts
// lib/portfolio/repositories/plans.repository.ts
export async function findAll({ active = true } = {}) {
  const sql = 'SELECT * FROM portfolio_plans WHERE (? IS NULL OR is_active = ?) ORDER BY sort_order ASC';
  return query<Plan[]>(sql, [active ? active : null, active]);
}
```

---

## 7. API Routes

All routes under `app/api/portfolio-manager/`.

Every route handler and server function that touches MySQL must declare:

```ts
export const runtime = 'nodejs';
```

(`mysql2` requires Node.js TCP; it does not run in the Edge Runtime.)

All routes must:
1. Call `validateSession()` first
2. Validate input with Zod
3. Call repository functions
4. Trigger cache invalidation on writes
5. Return consistent `{ success, data, error }` responses

### 7.1 Standard REST Pattern

For each entity (plans, services, tech-stack, case-studies, testimonials, client-logos, faq):

```
GET    /api/portfolio-manager/plans
POST   /api/portfolio-manager/plans
GET    /api/portfolio-manager/plans/[id]
PUT    /api/portfolio-manager/plans/[id]
DELETE /api/portfolio-manager/plans/[id]
```

### 7.2 Special Routes

```
GET    /api/portfolio-manager/settings
PUT    /api/portfolio-manager/settings

GET    /api/portfolio-manager/content-blocks
GET    /api/portfolio-manager/content-blocks/[section_key]
PUT    /api/portfolio-manager/content-blocks/[section_key]

GET    /api/portfolio-manager/leads
GET    /api/portfolio-manager/leads/[id]
PUT    /api/portfolio-manager/leads/[id]/status
DELETE /api/portfolio-manager/leads/[id]
POST   /api/portfolio-manager/leads/export
```

### 7.3 Cache Invalidation Route

Create a helper function (not necessarily an API route) to call the portfolio's revalidation endpoint after writes:

```ts
// lib/portfolio/cache.ts
export async function revalidatePortfolioTag(tag: string) {
  const portfolioUrl = process.env.PORTFOLIO_URL;
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET;
  
  if (!portfolioUrl || !secret) return;
  
  await fetch(`${portfolioUrl}/api/revalidate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag, secret }),
  });
}
```

Call this after every create/update/delete.

---

## 8. Admin UI Pages

All pages under `app/portfolio-manager/`.

Use shadcn/ui components: `Table`, `Dialog`, `Form`, `Tabs`, `Input`, `Textarea`, `Select`, `Switch`, `Button`, `Card`, `Badge`, `Toast`.

### 8.1 Dashboard (`/portfolio-manager`)

- Quick stats: total leads this month, active plans, active case studies, unread leads
- Recent leads table (last 10)
- Quick links to each section

### 8.2 Hero (`/portfolio-manager/hero`)

Edit `portfolio_content_blocks` key `hero` + `portfolio_settings`:
- Headline (per locale)
- Subhead (per locale)
- CTA labels (per locale)
- Spec chips list (per locale — the mono chips row, e.g. "n8n Automation")
- Availability message (per locale — moved out of settings; see §4.9 note)
- Availability status (online/busy) — single-language, managed in Settings (§8.12)

### 8.3 About (`/portfolio-manager/about`)

Edit `portfolio_content_blocks` key `about`:
- Body text (per locale)
- Stats labels: years, clients, projects (per locale)
- Working principles list (per locale)

Also edit stat **values** in `portfolio_settings` (`stats_years_value`, `stats_clients_value`, `stats_projects_value`).

### 8.4 Services (`/portfolio-manager/services`)

CRUD for `portfolio_services`:
- Title + i18n
- Category + i18n
- Description + i18n
- Icon: either a Lucide icon name (e.g., `Zap`) or a full image URL
- Active toggle
- Sort order

### 8.5 Tech Stack (`/portfolio-manager/tech-stack`)

CRUD for `portfolio_tech_stack`:
- Name + i18n
- Category + i18n
- Proficiency (1-100 slider)
- Icon: either a Lucide icon name or a full image URL
- Featured toggle
- Active toggle
- Sort order

### 8.6 Case Studies (`/portfolio-manager/case-studies`)

CRUD for `portfolio_case_studies`:
- Title + i18n
- Summary + i18n
- Client name, region
- Impact metric
- Before/after metrics + improvement percent
- Demo URL, GitHub URL
- Cover image upload
- X-Ray specs JSON editor
- n8n nodes JSON editor
- Long-form body editor (markdown, per locale via `I18nTabs`) → `body_i18n`
- Active toggle
- Sort order

### 8.7 Testimonials (`/portfolio-manager/testimonials`)

CRUD for `portfolio_testimonials`:
- Client name + i18n
- Company + i18n
- Country + i18n
- Quote + i18n
- Rating (1-5 stars)
- Verified toggle
- Active toggle
- Sort order

**Integrity rule:** Only enter real client quotes with real names/companies (or anonymized-but-real roles, e.g. “Operations Manager, Belgian recruitment agency”). The public portfolio will hide the testimonials section entirely if this table is empty. No placeholder testimonials on production.

### 8.8 Client Logos (`/portfolio-manager/client-logos`)

CRUD for `portfolio_client_logos`:
- Company name + i18n
- Logo image upload
- Website URL
- Active toggle
- Sort order

### 8.9 FAQ (`/portfolio-manager/faq`)

CRUD for `portfolio_faq`:
- Question + i18n
- Answer + i18n
- Category + i18n
- Active toggle
- Sort order

### 8.10 Pricing (`/portfolio-manager/pricing`)

CRUD for `portfolio_plans`:
- Title + i18n
- Badge + i18n
- Prices in 5 currencies
- Billing type
- Features list (per locale)
- Turnaround + i18n
- CTA type
- Popular toggle
- Active toggle
- Sort order

### 8.11 Contact & Social (`/portfolio-manager/contact-social`)

Edit `portfolio_settings`:
- Contact email
- Contact phone/WhatsApp
- Scheduling link (Cal.com)
- Resume EN filename
- Resume FR filename
- Resume AR filename (optional)
- Social links JSON editor

### 8.12 Settings (`/portfolio-manager/settings`)

Edit `portfolio_settings`:
- ICE registration number
- SLA notice
- Availability status
- Stats values: `stats_years_value`, `stats_clients_value`, `stats_projects_value`

> Availability **message** is now managed in the Hero editor (§8.2) as per-locale
> content, not here. Settings must never hold translatable strings.

(Stats **labels** are edited in `/portfolio-manager/about` — they live in the `about` content block's i18n JSON, not in settings.)

### 8.13 Leads (`/portfolio-manager/leads`)

Read/update `portfolio_leads`:
- Table with filters by status
- Search by name/email/company
- View lead details in slide-over or dialog
- Update status dropdown
- Delete/archive lead
- Export to CSV
- View/download attachment

### 8.14 Trust Bar (`/portfolio-manager/trust-bar`)

Edit `portfolio_content_blocks` key `trust_bar` + `portfolio_settings.ice_registration_number`:
- Trust badge text (per locale)
- ICE / Tax ID number

### 8.15 Contact Intro (`/portfolio-manager/contact`)

Edit `portfolio_content_blocks` key `contact`:
- Contact section headline / intro text (per locale)

Note: actual email, phone, and scheduling link are managed in `/portfolio-manager/contact-social` and `/portfolio-manager/settings`.

### 8.16 Footer (`/portfolio-manager/footer`)

Edit `portfolio_content_blocks` key `footer`:
- Copyright / footer text (per locale)

---

## 9. Shared Components

Create reusable components in `components/portfolio-manager/`:

### 9.1 `I18nTabs`

A tab component for EN/FR/AR fields.

```tsx
<I18nTabs
  values={formData.title_i18n}
  onChange={(lang, value) => updateField('title_i18n', lang, value)}
  render={(lang, value, onChange) => (
    <Input value={value} onChange={(e) => onChange(e.target.value)} />
  )}
/>
```

### 9.2 `DataTable`

Reusable sortable table with:
- Search
- Filter by active/inactive
- Drag-to-reorder rows
- Edit/delete actions

### 9.3 `ImageUploader`

- File picker with preview
- Validate type (PNG, JPG, WEBP, SVG) and size (max 2MB for logos, 5MB for case studies)
- Upload to configured storage path
- Return URL to save in database

### 9.4 Structured Editors (replaces raw `JsonEditor`)

Do **not** expose raw JSON textareas for these fields. Use structured editors with
Zod validation and a live JSON preview:

- `xray_specs_json` → 2×2 labeled fields (architecture, stack chips, execution time, security).
- `n8n_nodes_json` → repeatable node list (id, name, type select, description, latencyMs, sample payload).
- `features_json` → per-locale list editor (add/remove/reorder).
- `social_links_json` → labeled URL fields for each platform.

The legacy `JsonEditor` may remain for an advanced/collapsed view, but the default
editing experience must be structured.

### 9.5 `LeadStatusBadge`

Colored badge for lead status (new, contacted, qualified, converted, archived).

### 9.6 Media Library

Add a media page under `/portfolio-manager/media`:
- List all uploaded case-study covers and client logos.
- Preview thumbnails.
- Copy the public URL for reuse.
- Filter by file type and allow safe deletion of orphaned assets.

This prevents re-uploading the same asset and makes asset cleanup possible.

---

## 10. File Uploads

### 10.1 Storage Location

Store uploaded files outside the public web root.

Suggested paths:
- Development: `uploads/portfolio/`
- Production: `/home/<user>/uploads/portfolio/` on Hostinger or imsabbar OS server

### 10.2 Allowed File Types

| Use Case | Allowed Types | Max Size |
|---|---|---|
| Client logos | PNG, JPG, WEBP, SVG | 2MB |
| Case study images | PNG, JPG, WEBP | 5MB |
| Lead attachments | PDF, DOC, DOCX, PNG, JPG | 5MB |

### 10.3 File Naming

Use UUID + original extension: `logo-550e8400-e29b-41d4-a716-446655440000.png`

### 10.4 Serving Files

Files should be served through a protected or internal route, not directly from the uploads folder.

For portfolio use, files can be made available via a CDN-friendly URL like:
`https://assets.imsabbar.com/portfolio/logos/...`

Or if stored on Hostinger, a signed/protected URL pattern.

**Decision (v1.2.0):** public assets (case-study covers, client logos) are served from a **Hostinger static subdomain** (`assets.imsabbar.com`) fronted by **Cloudflare** with long-cache headers. This module uploads files to that subdomain's storage and saves the full public URL in `image_url` / `logo_url`. The public portfolio allows this host via `images.remotePatterns`. Lead attachments are NEVER public — they stay in the protected uploads path and are viewable only from the OS leads UI.

---

## 11. Lead Management

### 11.1 Lead Sources

The portfolio can create leads from:
- Contact form
- Cal.com booking
- WhatsApp quick-chat clicks

Store `source_type` accordingly.

### 11.2 Lead Notifications

When a new lead arrives, send notifications:
- Telegram message
- Email via Resend

Use the same dispatch logic as the portfolio or implement it here.

### 11.3 Lead Workflow

Default status flow:
```
new → contacted → qualified → converted
  ↓
archived
```

### 11.4 Export

Allow CSV export with filters:
- Date range
- Status
- Source type

---

## 12. Security

### 12.1 Authentication

- All routes and pages use `validateSession()`
- Only authenticated users can access
- Optional: require `admin` role

### 12.2 Input Validation

- Use Zod for every API route
- Sanitize all text inputs
- Validate JSON structure for i18n fields

### 12.3 SQL Injection Prevention

- Use parameterized queries only
- Never concatenate user input into SQL

### 12.4 File Upload Security

- Validate MIME type server-side
- Validate file extension
- Limit file size
- Store outside public root
- Scan for malware if possible

### 12.5 CSRF Protection

- Use same-site cookies
- Validate `Origin`/`Referer` headers on state-changing requests

---

## 13. Cache Invalidation

After every write operation, trigger portfolio cache invalidation.

### 13.1 Revalidation Tags

Use these tags in the portfolio (defined there in `lib/cache-tags.ts` — keep this list in sync):
- `portfolio_settings`
- `portfolio_content_blocks`
- `portfolio_services`
- `portfolio_plans`
- `portfolio_case_studies`
- `portfolio_tech_stack`
- `portfolio_testimonials`
- `portfolio_client_logos`
- `portfolio_faq`

### 13.2 Portfolio Endpoint

The portfolio will expose:

```
POST /api/revalidate
Body: { tag: string, secret: string }
```

The secret is shared via `PORTFOLIO_REVALIDATE_SECRET` env var.

### 13.3 Implementation

```ts
// lib/portfolio/cache.ts
export async function revalidatePortfolio(tag: string) {
  const url = process.env.PORTFOLIO_URL;
  const secret = process.env.PORTFOLIO_REVALIDATE_SECRET;
  
  if (!url || !secret) {
    console.warn('Portfolio revalidation not configured');
    return;
  }
  
  try {
    await fetch(`${url}/api/revalidate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, secret }),
    });
  } catch (error) {
    console.error('Failed to revalidate portfolio:', error);
  }
}
```

Call `revalidatePortfolio('portfolio_plans')` after plan changes, etc.

### 13.4 Local Testing

When both apps run locally:
- Set `PORTFOLIO_URL=http://localhost:3000` in imsabbar OS `.env`.
- Use the same `PORTFOLIO_REVALIDATE_SECRET` in both apps.
- After saving content in OS, verify the public portfolio updates without a rebuild.

---

## 14. Environment Variables

Add these to imsabbar OS `.env`:

```env
# MySQL (same as ChapterCharm or dedicated portfolio user)
PORTFOLIO_DB_HOST=
PORTFOLIO_DB_PORT=3306
PORTFOLIO_DB_USER=
PORTFOLIO_DB_PASSWORD=
PORTFOLIO_DB_NAME=

# Portfolio integration
PORTFOLIO_URL=https://imsabbar.com
PORTFOLIO_REVALIDATE_SECRET=your-random-secret-here

# Notifications
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
RESEND_API_KEY=

# File uploads
PORTFOLIO_UPLOAD_PATH=/home/user/uploads/portfolio
PORTFOLIO_UPLOAD_URL=https://assets.imsabbar.com/portfolio
```

---

## 15. Integration Checklist

- [ ] Module registered in sidebar and registry
- [ ] All routes protected by `validateSession()`
- [ ] MySQL tables created in Hostinger
- [ ] Repository layer implemented for all entities
- [ ] API routes implemented for all entities
- [ ] Admin UI pages implemented
- [ ] File upload handling implemented
- [ ] Lead management works
- [ ] Cache invalidation triggered on all writes
- [ ] Notifications sent on new leads
- [ ] CSV export works
- [ ] i18n tabs work for EN/FR/AR
- [ ] Case-study markdown body (`body_i18n`) editing works per locale
- [ ] Responsive design tested

---

## 16. Notes for the Implementing Agent

1. **Do not store portfolio data in SQLite.** Use Hostinger MySQL only.
2. **Reuse existing patterns.** Follow ChapterCharm module structure as a reference.
3. **All text fields support i18n.** Use JSON columns with `{ en, fr, ar }` shape.
4. **The portfolio is read-only.** This module is the only writer.
5. **Test cache invalidation.** After saving content, verify the public portfolio updates.
6. **Keep uploads secure.** Never expose the uploads directory directly.
7. **Validate everything.** Use Zod on all API inputs.
8. **Markdown contract.** Case-study `body_i18n` is rendered by the public portfolio with raw HTML disabled (`react-markdown`). Do not rely on inline HTML in markdown bodies.
9. **Health checks** should also warn when a featured case study is missing `body_i18n` for any locale.
10. **No translatable strings in settings.** `portfolio_settings` holds single-language TEXT
    only (status, email, phone, filenames, stats values, ICE, SLA). Every translatable
    string belongs in a `*_i18n` JSON column with `{ en, fr, ar }` — including the hero
    availability message (now in the `hero` content block).

### Optional Quality-of-Life Features

- **Content Health Checks:** Warn in the dashboard if required settings are missing (e.g., `contact_email`, `ice_registration_number`, `scheduling_link`) or if a featured case study is missing `image_url` / `summary`.
- **Preview Button:** Add an external link from each OS admin page to the corresponding public portfolio section/locale so edits can be verified immediately after revalidation.

### Required Production Features (promoted from optional)

- **Standard Preview Links:** every entity editor must expose EN/FR/AR preview links to the
  corresponding public section after a successful save + revalidation.
- **Migration Runner:** implement an OS-side additive migration runner using
  `portfolio_schema_migrations`. It reads pending migrations, applies them
  transactionally where possible, records the version, and verifies columns/indexes/row
  counts afterward.
- **Cache-tag sync check:** the health screen must compare the OS cache-tag list against
  the public `lib/cache-tags.ts`. A mismatch is a visible warning, not a silent pass.

---

## 17. v1.3 Production Control Plane

### 17.1 Scope and publishing model

The manager owns every business-content value consumed by the public portfolio: hero, trust bar, about, services, tech stack, case studies, testimonials, client logos, FAQ, pricing, contact details, social links, footer, booking settings, SLA/ICE values, resume filenames, privacy/legal documents, SEO/indexing settings, social-preview copy, and ROI assumptions. React structure, design tokens, validation code, and application UI translations remain Git-managed.

There is no database draft state in v1.3. Each valid save validates the complete submitted entity, checks required EN/FR/AR coverage where the entity requires it, writes in a MySQL transaction, records before/after audit data and a revision snapshot, triggers the correct public cache tag, and returns the revalidation result. Destructive actions require confirmation. Rollback creates a new audited write; it never deletes history.

### 17.2 Security and permissions

Every manager page and API requires `validateSession()` plus the centralized Portfolio Admin/module guard. All request bodies use Zod, all SQL values are parameterized, identifiers come only from an allowlist, and responses use consistent `{ data, meta }` or `{ error }` envelopes. Errors do not reveal credentials, SQL, filesystem paths, or provider responses. The public portfolio never receives manager credentials or lead attachments.

The first OS release has one authenticated owner account. A future multi-user permission system must preserve the Portfolio Admin boundary before exposing CRUD, credentials, exports, rollback, or private downloads.

### 17.3 Credential Center

The Credential Center stores the following in an AES-256-GCM encrypted OS vault: portfolio MySQL connection, revalidation secret, Turnstile site/secret keys, Resend API key/sender/notification recipient, Telegram bot token/chat ID, IP-hash pepper, private upload path, asset URL, public site URL, and approved Cal.com origins. The encryption key is `PORTFOLIO_CREDENTIALS_ENCRYPTION_KEY`, supplied only through the OS environment.

GET operations expose only configured state, last four characters, and update metadata. Secrets are never returned to client JavaScript, logs, public MySQL settings, audit snapshots, or CSV exports. Each value supports set, replace, clear, and provider-specific test. Tests use timeouts and report success/failure only. Hostinger deployment credentials are explicitly out of scope: saved values still have to be entered separately in Hostinger’s production environment configuration.

### 17.4 Manager APIs

Authenticated APIs are provided for `/api/portfolio-manager/[entity]` CRUD across plans, services, tech stack, case studies, testimonials, client logos, and FAQ; `/settings`; `/leads` with filtering, status, notes, archive and CSV export; `/credentials` and provider tests; `/health`; `/audit`; and revision rollback. Lead attachment downloads are authenticated, path-traversal safe, private, and never public URLs. CSV values beginning with `=`, `+`, `-`, or `@` are escaped.

### 17.5 Operations and health

The manager health screen checks MySQL, public site URL/revalidation configuration, Turnstile, Resend, Telegram, Cal.com HTTPS allowlist, and private upload write access. Content-health warnings cover missing locale coverage, missing featured case-study assets/body content, missing contact/booking/SLA/ICE settings, and invalid URLs. The health screen must also compare the OS cache-tag list against the public `lib/cache-tags.ts` and surface a mismatch as a visible warning. A successful save displays whether the public cache revalidation succeeded; a failed revalidation is operationally visible and never silently treated as a publish success.

### 17.6 Additive migration contract

Production migrations are additive and idempotent. They must never drop portfolio tables or silently overwrite existing rows. The public schema migration adds lead locale, consent timestamp, privacy-policy version, attachment metadata, internal notes, soft deletion, search/rate-limit indexes, audit/revision tables, media/legal tables, and migration tracking. Every migration is recorded in `portfolio_schema_migrations`. Implement a **migration runner** in the OS that reads pending migrations, applies them transactionally where possible, records the version, and verifies columns/indexes/row counts afterward. Before applying one: export a MySQL backup; after applying one: verify columns, indexes, row counts, and rollback instructions.

Public lead rows allow anonymous booking/WhatsApp records with nullable contact fields. Form leads retain consent timestamp, submitted locale, privacy-policy version, and attachment metadata. Public DB credentials must be restricted to content `SELECT` plus lead `INSERT`; the OS integration user receives the CRUD and lead-management permissions it needs. The two users must not be the same unrestricted account.

### 17.7 Acceptance gates

- Unauthorized users receive 401/redirect and cannot access manager pages, exports, attachments, or provider tests.
- Every create/update/delete/rollback validates, audits, and returns cache-revalidation status.
- Content changes appear publicly without a code rebuild when the revalidation secret and deployment route are configured.
- Credentials remain encrypted and masked; provider failures reveal no secret material.
- Spoofed MIME, oversized, unsafe, and traversal uploads are rejected; lead files remain outside the public web root.
- Lead search/filter/status/notes/archive/download and formula-safe CSV export work.
- Migrations can be rerun safely and preserve existing rows.
- TypeScript, production build, mocked provider tests, and OS-to-portfolio integration tests pass before deployment.

### 17.8 Deployment checklist boundary

The manager provides a checklist, but does not deploy. Configure the encrypted OS key in the manager host, then separately configure the public portfolio’s Hostinger environment: MySQL host/user/name/password, revalidation secret, IP pepper, Turnstile keys, Resend/Telegram values, site URL, approved Cal.com origins, and private upload path. Verify `/api/health`, `/sitemap.xml`, `/robots.txt`, a cache revalidation request, a real Turnstile-protected lead, notification delivery, and a protected attachment download after deployment.

*End of imsabbar OS Portfolio Manager Module PRD v1.3.0*
