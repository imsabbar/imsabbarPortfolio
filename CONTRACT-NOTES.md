# Portfolio ↔ imsabbar OS Contract Notes

For the agent implementing `IMSABBAR_OS_PORTFOLIO_MANAGER_MODULE_PRD.md`.
The public portfolio code in this repo is the **runtime source of truth**. Where
the OS PRD differs from this code, align the OS implementation to the code below.

## 1. Cache revalidation endpoint

The PRD §8.1 / OS PRD §13.2 sample body is outdated. The implemented endpoint is:

- **Method:** `POST`
- **URL:** `https://imsabbar.com/api/revalidate`
- **Auth:** `Authorization: Bearer <PORTFOLIO_REVALIDATE_SECRET>`
- **Body:** `{ "tags": ["portfolio_plans"] }` (an **array**, not a single `tag`)

Do NOT send `{ tag, secret }`. The endpoint rejects unknown tags and requires
`Content-Type: application/json`.

## 2. `portfolio_leads` nullability

Booking and WhatsApp leads are created with **nullable** `name` and `email`:

```sql
name VARCHAR(255) NULL,
email VARCHAR(255) NULL,
```

The OS PRD §4.10 still declares both as `NOT NULL`. If the OS creates the table
from that spec, anonymous booking/WhatsApp inserts will fail. Use the canonical
`scripts/01-schema.sql` shape (nullable) and apply
`scripts/01-schema.sql` for table definitions.

## 3. Additional lead columns

The public portfolio writes and the OS should expect:

- `locale VARCHAR(5) NOT NULL DEFAULT 'en'`
- `consent_at TIMESTAMP NULL`
- `privacy_policy_version VARCHAR(40) NOT NULL DEFAULT '2026-08-13'`
- `attachment_original_name VARCHAR(255) NULL`
- `attachment_mime VARCHAR(100) NULL`
- `attachment_size INT UNSIGNED NULL`
- `internal_notes TEXT NULL`
- `is_read BOOLEAN DEFAULT FALSE`
- `deleted_at TIMESTAMP NULL`

The OS `portfolio_leads` schema (§4.10) has been updated to include these.
Use `is_read` for the "unread leads" dashboard metric, `internal_notes` for lead
notes, and `deleted_at` for soft deletion. Soft deletion, audit/revision tables,
and migration tracking are also part of the Master PRD v3.2 contract — see
`scripts/01-schema.sql`.

## 4. Cache tags

Tag names live in `lib/cache-tags.ts`. Keep the OS in sync with:

- `portfolio_settings`
- `portfolio_content_blocks`
- `portfolio_services`
- `portfolio_plans`
- `portfolio_case_studies`
- `portfolio_tech_stack`
- `portfolio_testimonials`
- `portfolio_client_logos`
- `portfolio_faq`

Never inline tag strings in either app.

## 5. Settings vs. content blocks

Stats **labels** are not settings. They live in the `about` content block's
`content_i18n` JSON (`stats_years_label`, `stats_clients_label`,
`stats_projects_label`). Stats **values** are settings (`stats_years_value`, etc.).

## 6. Health checks

The OS should warn when a featured case study is missing `body_i18n` for any
locale, missing `image_url` / `summary`, or when required settings
(`contact_email`, `ice_registration_number`, `scheduling_link`) are absent.

## 7. v1.4.0 Control Plane Enhancements (Mandatory for OS Agent)

1. **Revalidation Response Feedback**: Always show a visual Toast confirmation upon saving:
   `✓ Saved to Database & Public Cache Refreshed (tag: portfolio_*)`.
2. **Dashboard 1-Click Availability Toggle**: Implement an immediate 1-click switch on the OS Dashboard header for `Online` (Green) / `Busy` (Amber) / `Offline` (Gray).
3. **Split-Screen Markdown Editor**: For `portfolio_case_studies.body_i18n`, provide side-by-side editing with a live markdown preview matching `react-markdown` styling.
4. **Drag-and-Drop Resume Manager**: Provide dedicated PDF dropzones in Settings for `EN`, `FR`, and `AR` CV files.
5. **n8n Nodes JSON Validator**: Validate `portfolio_case_studies.n8n_nodes_json` structure (`id`, `name`, `type`, `icon`, `status`, `latency`) before database write.
6. **Dual MySQL User Security**: Use an admin user for `imsabbar OS` (`SELECT, INSERT, UPDATE, DELETE`) while the public portfolio uses a restricted `SELECT + INSERT` user.
