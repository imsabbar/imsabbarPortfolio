# imsabbar OS — Portfolio Manager Module PRD Amendments

**Target PRD:** `IMSABBAR_OS_PORTFOLIO_MANAGER_MODULE_PRD.md` v1.5.0  
**Amendment Version:** v1.5.0-amend-1  
**Date:** 2026-08-17  
**Owner:** Ismail Sabbar  
**Purpose:** Close contract drift between the PRD, the canonical public-portfolio schema, and the live public-site code so the OS implementation agent ships a manager that actually matches the runtime.

> **How to use this document:** Apply the **🔴 Critical** amendments before writing any OS code. **🟡 Medium** amendments should be applied before UI implementation begins. **🟢 Strategic** items can be deferred to v1.6 unless otherwise noted.

---

## Executive Summary

The v1.5.0 PRD is comprehensive in breadth but contains **seven critical contract defects** that will cause the OS manager to write data the public site ignores, validate shapes the public site cannot render, or create tables missing indexes the public site depends on. This amendment document provides:

1. Exact redline text for affected PRD sections.
2. A synchronized canonical `portfolio_leads` schema.
3. Concrete SQL for the audit/revision/migration tables referenced but undefined in the PRD.
4. New specifications for revalidation ordering, CSV export, media lifecycle, and lead inbox behavior.
5. Decisions on phantom features (SEO settings, footer block, legal docs).

---

## 🔴 Critical Amendments (Apply First)

### CA-1. Remove or Implement Phantom SEO/Settings Keys

**Affected:** PRD §4.9 Settings keys list, §8.12 Tab B (SEO & Search Engines), §17.1 Scope.

**Problem:** These keys are declared in the PRD but **are not read by the public portfolio** (verified by grep):

- `google_site_verification`
- `bing_site_verification`
- `yandex_site_verification`
- `robots_allow_indexing`
- `meta_keywords`
- `default_og_image_url`
- `stats_reliability_value`

The public site reads verification tokens from `NEXT_PUBLIC_*` env vars (`layout.tsx`), `robots.ts` is static, OG images are generated per-locale, and the UI hardcodes `99.8%` reliability.

**Decision for v1.5.0:** Defer DB-driven SEO management to v1.6. Remove these keys from §4.9 and §8.12 Tab B.

**Redline — replace PRD §4.9 Settings keys list with:**

```
Settings keys:
- `availability_status`
- `ice_registration_number`
- `contact_email`
- `contact_phone`
- `scheduling_link`
- `resume_en_filename`
- `resume_fr_filename`
- `resume_ar_filename`
- `social_links_json`
- `sla_notice`
- `stats_years_value`
- `stats_clients_value`
- `stats_projects_value`
```

**Redline — replace §8.12 Tab B with:**

```
#### Tab B: SEO & Search Engines (v1.6)
> Deferred to v1.6. The public portfolio currently reads verification tokens from
> environment variables and generates OG images per-locale. DB-driven SEO controls
> require public-side readers before this tab is implemented.
```

**Action for public portfolio (separate task):** If you want these controls, implement `robots.ts` and `metadata` to read from `findSettings()` before the OS builds the UI.

---

### CA-2. Synchronize the `portfolio_leads` Schema

**Affected:** PRD §4.10 Leads, `scripts/01-schema.sql`, `CONTRACT-NOTES.md` §3.

**Problem:** The PRD and the canonical SQL script disagree on columns/indexes:

| Item | PRD §4.10 | `scripts/01-schema.sql` |
|---|---|---|
| `is_read` | ✅ Present | ❌ Missing |
| `idx_ip_hash_created` | ❌ Missing | ✅ Present |
| `idx_leads_created_at` | ❌ Missing | ✅ Present |

**Decision:** Adopt the union of both sources. This is the single source of truth for the OS and the public site.

**Replace PRD §4.10 with the following canonical SQL:**

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
  INDEX idx_leads_locale_date (locale, created_at),
  INDEX idx_ip_hash_created (ip_hash, created_at),
  INDEX idx_leads_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Also update `scripts/01-schema.sql`** to add `is_read BOOLEAN DEFAULT FALSE` after `internal_notes`.

**Also update `README.md` line 144** to remove `is_read`, `internal_notes`, and `deleted_at` from the list of fields the public portfolio writes. These are OS-managed only.

---

### CA-3. Fix the n8n Node Validator Contract

**Affected:** PRD §5.1 JSON shapes, §8.6 n8n validator, `CONTRACT-NOTES.md` §7.5.

**Problem:** Two different shapes are specified:

- PRD §5.1 / real type: `{ id, name, type, description, latencyMs, samplePayload }`
- PRD §8.6 / CONTRACT-NOTES: `{ id, name, type, icon, status, latency }`

The public `N8nFlowSimulator` consumes `latencyMs`.

**Replace PRD §8.6 n8n validator paragraph with:**

```
- **n8n Nodes JSON Schema Validator**:
  - Validates that `n8n_nodes_json` contains an array of nodes matching the public
    type declared in `types/portfolio.ts`:
    `{ id: number, name: string, type: 'trigger' | 'action' | 'condition' | 'output',
       description: string, latencyMs: number, samplePayload?: object }`.
  - Reject any node missing `id`, `name`, `type`, `description`, or `latencyMs`.
  - Displays a visual flowchart node preview in the admin modal to verify the simulation sequence.
```

**Update `CONTRACT-NOTES.md` §7.5** to the same shape.

---

### CA-4. Decide the Fate of the Footer Content Block

**Affected:** PRD §4.8 Content Blocks, §8.16 Footer.

**Problem:** The public `Footer.tsx` only accepts `dict`, `locale`, and `settings`. It never reads `contentBlocks.footer`, even though the block is seeded, fetched, and translated.

**Decision for v1.5.0:** Remove the Footer editor. Footer copy remains dictionary-managed.

**Redline — remove from PRD §4.8 Supported `section_key` values:**

```
Supported `section_key` values:
- `hero`
- `trust_bar`
- `about`
- `contact`
```

**Redline — remove §8.16 Footer entirely** (or mark as `v1.6 deferred`).

**Redline — update `scripts/02-seed-data.sql`** to remove the `footer` INSERT.

**Redline — update `lib/sections/index.ts`** to stop fetching/resolving `contentBlocks.footer`.

---

### CA-5. Fix Seed Data Bugs

**Affected:** `scripts/02-seed-data.sql`.

**Problem 1:** Case-study INSERT omits `title` and `summary` (NOT NULL, no defaults) → fails under MySQL 8 strict mode.

**Fix:** Change the INSERT to include `title` and `summary` (mirroring the JSON values), or make those columns nullable.

```sql
INSERT INTO portfolio_case_studies (
  slug, title, summary,
  title_i18n, summary_i18n, client_region_i18n,
  impact_metric_i18n, before_metric_i18n, after_metric_i18n
) VALUES
('janna-puzzle',
 'Janna Puzzle',
 'A playful brand web experience built for engagement and speed.',
 JSON_OBJECT('en','Janna Puzzle','fr','Janna Puzzle','ar','جانا بازل'),
 JSON_OBJECT('en','A playful brand web experience built for engagement and speed.','fr','Une expérience web de marque ludique, pensée pour l''engagement et la vitesse.','ar','تجربة ويب مرحة للعلامة التجارية مصممة للتفاعل والسرعة.'),
 -- ... rest of columns
);
```

**Problem 2:** Tech-stack seed claims idempotency but `portfolio_tech_stack` has no `UNIQUE(name)`, so `ON DUPLICATE KEY UPDATE` never fires and re-running duplicates all 21 rows.

**Fix:** Add `UNIQUE(name)` to `portfolio_tech_stack` in `scripts/01-schema.sql`:

```sql
CREATE TABLE portfolio_tech_stack (
  -- ... existing columns ...
  UNIQUE KEY uk_name (name),
  INDEX idx_featured_sort (is_featured, sort_order),
  INDEX idx_active_sort (is_active, sort_order)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

---

### CA-6. Resolve Privacy/Legal Docs Ownership

**Affected:** PRD §17.1 Scope.

**Problem:** PRD claims the manager owns "privacy/legal documents," but the public site reads `content/privacy.{en,fr,ar}.md` from Git.

**Decision:** Remove "privacy/legal documents" from the manager's scope in v1.5.0.

**Redline — replace the scope sentence in §17.1 with:**

```
The manager owns every business-content value consumed by the public portfolio:
hero, trust bar, about, services, tech stack, case studies, testimonials, client logos,
FAQ, pricing, contact details, social links, footer (deferred, see CA-4), booking settings,
SLA/ICE values, resume filenames, SEO/indexing settings (deferred to v1.6), social-preview
metadata (deferred to v1.6), and ROI assumptions.

Privacy policy and legal documents remain Git-managed markdown files in the public
portfolio repository (`content/privacy.{en,fr,ar}.md`) and are out of scope for v1.5.0.
```

---

## 🟡 Medium Amendments (Apply Before UI Implementation)

### MA-1. Define Audit, Revision, and Migration Tables

**Affected:** PRD §17.1, §17.6, `scripts/01-schema.sql`, `CONTRACT-NOTES.md` §3.

**Problem:** The PRD talks about audit snapshots, revision rollback, and migration tracking but never defines the tables.

**Append to PRD §4 (Database Schema) as §4.11–4.13:**

```sql
-- 4.11 Migration tracking
CREATE TABLE portfolio_schema_migrations (
  version VARCHAR(50) PRIMARY KEY,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  applied_by VARCHAR(255),
  checksum VARCHAR(64),
  execution_time_ms INT UNSIGNED,
  success BOOLEAN DEFAULT TRUE,
  error_message TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.12 Audit log
CREATE TABLE portfolio_audit_log (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT,
  action VARCHAR(50) NOT NULL,
  actor VARCHAR(255) NOT NULL,
  changed_fields JSON,
  before_snapshot JSON,
  after_snapshot JSON,
  ip_address VARCHAR(64),
  user_agent VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_entity_type_id (entity_type, entity_id),
  INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4.13 Revision snapshots
CREATE TABLE portfolio_revisions (
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT NOT NULL,
  revision_number INT NOT NULL,
  snapshot JSON NOT NULL,
  created_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reverted_at TIMESTAMP NULL,
  reverted_by VARCHAR(255),
  UNIQUE KEY unique_entity_revision (entity_type, entity_id, revision_number),
  INDEX idx_entity (entity_type, entity_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

**Add to PRD §17.6:** Before running any migration, export a MySQL dump. After running, verify columns, indexes, row counts, and checksums. Record every migration in `portfolio_schema_migrations`.

---

### MA-2. Specify Revalidation Ordering and Failure Handling

**Affected:** PRD §7.3, §13.3, §17.1.

**Append to PRD §13.3 after the sample `revalidatePortfolio` function:**

```
### 13.3.1 Revalidation ordering and failure semantics

1. **Always commit the DB transaction first.** Never call `/api/revalidate` inside an
   uncommitted transaction. The public portfolio must see the new data on the next render.

2. **Collect all affected cache tags** for multi-entity operations, deduplicate them, and
   send one request with the array of tags.

3. **Retry policy:** If the revalidate endpoint returns a non-2xx status or network error,
   retry up to 3 times with exponential backoff (1s, 3s, 9s).

4. **User feedback:**
   - On success: toast `✓ Saved to Database & Public Cache Refreshed`.
   - On failure after retries: toast `✓ Saved to Database. Public cache refresh failed —
     changes will appear automatically within 1 hour.`
   - A failed revalidation is operationally visible but does **not** roll back the DB write.

5. **CDN edge cache:** `llms.txt` and `llms-full.txt` are served with `s-maxage=86400`.
   Revalidating Next.js cache does not purge Cloudflare edge cache. If AI-search freshness
   is critical, add a Cloudflare cache purge step for these two URLs after editing case
   studies, or reduce `s-maxage` to `300`.
```

---

### MA-3. Add a CSV Export Specification

**Affected:** PRD §11.4, §17.4.

**Append to PRD §11.4:**

```
### 11.4.1 CSV Export Specification

- **Columns (in order):** `id`, `created_at`, `source_type`, `status`, `name`, `email`,
  `phone`, `company`, `country`, `currency`, `service_interest`, `estimated_budget`,
  `timeline`, `source_page`, `locale`, `ip_hash`, `user_agent`, `consent_at`,
  `privacy_policy_version`, `calculated_roi_savings`, `attachment_original_name`,
  `attachment_mime`, `attachment_size`, `internal_notes`.
- **Date/time format:** ISO 8601 UTC (e.g. `2026-08-17T14:32:00.000Z`).
- **Timezone:** All timestamps exported in UTC.
- **Header row:** Localized column labels using the current OS UI language.
- **Filters applied:** Date range, status, source type, locale, and search term.
- **Soft-deleted rows:** Excluded by default; include only if an explicit "Include archived"
  toggle is enabled.
- **Formula injection protection:** Prefix any cell beginning with `=`, `+`, `-`, `@`, tab,
  carriage return, or line feed with a single quote (`'`).
- **BOM:** Include UTF-8 BOM (`\uFEFF`) at the start of the file for Excel compatibility.
- **Filename:** `imsabbar-leads-{from}-{to}-{status}-{locale}.csv`
  (e.g. `imsabbar-leads-2026-08-01-2026-08-17-new-en.csv`).
- **Max rows:** 10,000 per export. If exceeded, return an error and suggest narrowing filters.
- **Content-Type:** `text/csv; charset=utf-8` with `Content-Disposition: attachment`.
```

---

### MA-4. Add a Lead Inbox Specification

**Affected:** PRD §8.13.

**Expand §8.13 with:**

```
### 8.13.1 Lead Inbox Behavior

- **Default sort:** `created_at DESC`.
- **Pagination:** 25/50/100 rows per page, persisted in URL query params.
- **Search scope:** `name`, `email`, `company`, `message` (case-insensitive `LIKE`).
- **Filters:** status, source_type, locale, date range, has_attachment, is_read.
- **Columns:** received time, source pill, name/email/company, status, unread indicator,
  quick-view action.
- **Bulk actions:** Mark read/unread, change status, soft delete.
- **Soft delete:** Sets `deleted_at`; hard delete is not exposed in the UI.
- **Attachment download:** Authenticated OS-only route. Validate the attachment belongs to
  the requested lead. Use path-containment checks. Stream the file; do not expose the
  filesystem path in URLs or logs.
- **Unread badge:** Dashboard "unread leads" count uses `is_read = FALSE AND deleted_at IS NULL`.
```

---

### MA-5. Add Media Lifecycle / Orphan Cleanup

**Affected:** PRD §9.6, §10.

**Append to PRD §10:**

```
### 10.5 Media Lifecycle and Orphan Cleanup

1. **Upload flow:** OS uploads to the configured storage path, optimizes/converts to WebP
   (case-study covers: max 1920px wide; logos: max 512px wide), pushes to the CDN, and saves
   the public CDN URL in `image_url` or `logo_url`.
2. **Replacement:** When an existing image is replaced, the old CDN URL is marked as a
   candidate orphan but is **not** deleted immediately (the public cache may still reference it).
3. **Deletion:** When a case study or logo is deleted, its image URL is marked as orphan.
4. **Cleanup job:** A weekly (or on-demand) orphan scan checks whether any `image_url` or
   `logo_url` in the DB still references each candidate. Only unreferenced URLs are deleted
   from CDN/storage.
5. **Safety:** Orphan cleanup must run after the public ISR cache (1h max) has expired,
   or after explicit revalidation.
```

---

### MA-6. Add Lead Attribution Columns

**Affected:** PRD §4.10.

**Problem:** No UTM/referrer capture for an acquisition-driven funnel.

**Add to `portfolio_leads` after `source_page`:**

```sql
  referrer VARCHAR(500),
  utm_source VARCHAR(100),
  utm_medium VARCHAR(100),
  utm_campaign VARCHAR(100),
  INDEX idx_leads_utm (utm_source, utm_medium),
```

**Update PRD §11.1:** Capture these from browser `document.referrer` and URL query params when the lead is created.

---

## 🟢 Strategic Improvements (Defer to v1.6 or Later)

1. **Draft/preview mode.** Even a simple `is_published` flag per entity would reduce risk of accidental live changes.
2. **Optimistic locking / conflict detection.** Add `version` or `updated_at` check on every update to prevent two admins overwriting each other.
3. **OS-side rate limiting.** Apply per-user rate limits to admin API routes, especially exports and revalidation.
4. **Notification preferences.** Allow toggling Telegram/Resend per event and per recipient.
5. **Data retention / GDPR deletion.** Define auto-archive rules (e.g., leads older than 2 years) and a one-click anonymize/delete flow.
6. **DB-driven SEO controls.** Re-introduce the §8.12 Tab B keys only after the public site reads them from `portfolio_settings`.
7. **DB-driven footer / legal docs.** Re-introduce only if you decide to move `Footer.tsx` and `privacy.{en,fr,ar}.md` into the database.
8. **Power-user keyboard shortcuts** and bulk import (e.g., import testimonials from CSV).

---

## Implementation Checklist for the OS Agent

Apply in this order:

- [ ] **CA-1:** Remove phantom SEO/settings keys from PRD §4.9 and §8.12.
- [ ] **CA-2:** Update `portfolio_leads` schema to include `is_read` and both rate-limit/date indexes.
- [ ] **CA-3:** Fix n8n node validator shape to `{ id, name, type, description, latencyMs, samplePayload }`.
- [ ] **CA-4:** Remove `footer` content block from scope and seed.
- [ ] **CA-5:** Fix case-study and tech-stack seed SQL.
- [ ] **CA-6:** Remove privacy/legal docs from manager scope.
- [ ] **MA-1:** Add `portfolio_schema_migrations`, `portfolio_audit_log`, `portfolio_revisions` tables.
- [ ] **MA-2:** Implement revalidation ordering + retry policy in OS cache helper.
- [ ] **MA-3:** Implement CSV export to the exact spec.
- [ ] **MA-4:** Implement lead inbox with search, filters, pagination, bulk actions.
- [ ] **MA-5:** Implement media upload optimization and orphan cleanup.
- [ ] **MA-6:** Add UTM/referrer columns and capture logic.

---

## Notes

- Keep the public portfolio as the **runtime source of truth**. When this amendment conflicts with the PRD, align the OS implementation to the public code.
- After applying these amendments, run `npm run build` on the public portfolio and verify the OS can successfully create/update/delete each entity and trigger cache revalidation against a live DB.
