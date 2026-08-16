# Ismail Sabbar — Public Portfolio & Conversion Engine

> **Senior Full-Stack Developer & Automation Engineer**  
> Specializing in n8n workflow automation, Perfex CRM module engineering, and high-performance Next.js web applications.

[![Next.js 15](https://img.shields.io/badge/Next.js-15.1.7-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.0.0-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7.3-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-4.0.7-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MySQL 8](https://img.shields.io/badge/MySQL-8.0-4479A1?style=flat-square&logo=mysql)](https://www.mysql.com/)
[![Status](https://img.shields.io/badge/Production-Ready-10B981?style=flat-square)](#)

---

## 🌟 Executive Overview

This repository houses the **public portfolio and client conversion engine** for Ismail Sabbar (`imsabbar.com`). Built following the **"Engineered Precision"** design philosophy (PRD v3.1.0), it serves as a live, interactive proof-of-work showcasing deep capabilities in full-stack web development, enterprise workflow orchestration, CRM systems engineering, and conversion architecture.

The application operates as a **secure, high-performance client frontend** that interfaces with a Hostinger-hosted MySQL database and communicates bidirectionally with the centralized **`imsabbar OS`** administrative management portal.

---

## 🏗️ Architecture & Technology Stack

```
                                  ┌────────────────────────────────┐
                                  │       Cloudflare CDN / DNS     │
                                  └───────────────┬────────────────┘
                                                  │ HTTPS
                                  ┌───────────────▼────────────────┐
                                  │      Next.js 15 (Node.js)      │
                                  │      App Router / i18n         │
                                  └───────┬───────────────┬────────┘
                                          │               │
                     ┌────────────────────┴─────┐   ┌─────┴──────────────────┐
                     │ Server Components (RSC)  │   │ API Routes (Read/Lead) │
                     └────────────┬─────────────┘   └─────┬──────────────────┘
                                  │                       │
                     ┌────────────▼───────────────────────▼────────┐
                     │            MySQL 2 Connection Pool          │
                     │          (Singleton · SSL · Keep-Alive)     │
                     └────────────────────┬────────────────────────┘
                                          │
                                  ┌───────▼────────────────────────┐
                                  │    Hostinger MySQL Database    │
                                  │    (9 Normalized PRD Tables)   │
                                  └────────────────────────────────┘
```

### Core Technologies

* **Framework**: [Next.js 15.1 (App Router)](https://nextjs.org/) with `output: 'standalone'` for lightweight, self-contained deployment.
* **UI Library**: [React 19](https://react.dev/) with Server Components (RSC) and progressive client hydration.
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with a curated design token system in `app/globals.css`.
* **Motion & Animation**: [Framer Motion 12](https://www.framer.com/motion/) with strict `prefers-reduced-motion` compliance.
* **Internationalization**: Tri-lingual typed dictionary architecture (`en`, `fr`, `ar`) with native Right-to-Left (RTL) typography for Arabic.
* **Database Driver**: [`mysql2/promise`](https://github.com/sidorares/node-mysql2) running over Node.js TCP with singleton pooling.
* **Security & Verification**: Cloudflare Turnstile bot verification, cryptographically salted IP hashing, and multi-layer honeypots.
* **Document Engine**: Dynamic, server-side PDF proposal generation using [`@react-pdf/renderer`](https://react-pdf.org/).

---

## ✨ Key Features & Interactive Systems

### 1. 🌐 Tri-Lingual Internationalization (`en` / `fr` / `ar`)
* **True RTL Support**: Fully mirrors layouts, paddings, flex directions, and directional icons for Arabic.
* **Typography Stack**: Tailored Google font pairings — *Space Grotesk* (Display), *Inter* (Body), *IBM Plex Mono* (Data/Code), and *IBM Plex Sans Arabic* (Arabic typography).
* **FOUC Guard**: Inline script execution in `<head>` prevents theme and font flash before hydration.

### 2. ⚡ Interactive n8n Workflow Simulator
* Demonstrates real-world workflow automation across 4 distinct step nodes.
* Live latency computation, JSON payload inspection modal, and fluid node transitions.
* Accessible fallback with static diagrams for mobile viewports and reduced-motion modes.

### 3. 📊 Dynamic ROI Savings Calculator
* Real-time calculation of manual hours lost vs. automation savings based on team size, manual hours/week, and hourly rate.
* Multi-currency support (`USD`, `EUR`, `MAD`, `AED`, `GBP`) with localized currency formatting.
* **Session Memory**: Passing calculated estimates directly to pre-fill Step 3 of the Lead Engine upon CTA click.

### 4. 🚀 4-Step Enterprise Lead Engine
* **Step 1**: Contact & Company Info.
* **Step 2**: Project Scope & Budget Preset.
* **Step 3**: Message, Timeline & Attached Specs (with 5 MB MIME validation).
* **Step 4**: Review, Privacy Consent & Turnstile Challenge.
* **Async Dispatch Pipeline**: Non-blocking `after()` background execution triggering instant Telegram notifications and Resend auto-reply emails.

### 5. 📅 Cal.com Booking Gate & Fallbacks
* 3-step pre-qualification gate capturing project type and budget range before launching the scheduler.
* Embedded [Cal.com](https://cal.com) interface with automatic WhatsApp emergency fallback.

### 6. 📄 Real-Time PDF Estimate Proposal Generator
* Generates instant, branded A4 estimate documents on-demand.
* Automatically includes official ICE corporate registration numbers, currency conversion, validity timestamps, and itemized scopes.

---

## 🗄️ Database Architecture & Hostinger Setup

The database layer connects to a remote MySQL 8 instance on Hostinger. All queries execute through typed repositories in `lib/db/repositories/`.

### Schema Summary (9 Normalized Tables)

| Table Name | Purpose | Cache Tag |
| :--- | :--- | :--- |
| `portfolio_settings` | Global ICE number, contact email, phone, status, social links | `portfolio_settings` |
| `portfolio_content_blocks` | Hero copy, about section, trust bar, contact headers | `portfolio_content_blocks` |
| `portfolio_services` | Service offerings with localized titles and deliverables | `portfolio_services` |
| `portfolio_plans` | Pricing tiers with multi-currency rates (`MAD`, `EUR`, `USD`, `GBP`, `AED`) | `portfolio_plans` |
| `portfolio_case_studies` | Full case studies with X-Ray specs, n8n nodes JSON, and metrics | `portfolio_case_studies` |
| `portfolio_tech_stack` | Tech stack categorizations, experience years, and proficiency | `portfolio_tech_stack` |
| `portfolio_testimonials` | Client reviews, company names, and project deliverables | `portfolio_testimonials` |
| `portfolio_client_logos` | Client brand assets, dark/light variations, and display orders | `portfolio_client_logos` |
| `portfolio_faq` | Accordion FAQ questions with localized answers | `portfolio_faq` |
| `portfolio_leads` | Inbound lead submissions, attachments, audit logs, and soft deletions | *N/A (Write-Only)* |

### Database Initialization & Migration Scripts

All SQL migration scripts are located in the `scripts/` directory:

1. **Schema & Indexes Setup**:
   ```bash
   # Run against your Hostinger MySQL database via phpMyAdmin or CLI:
   scripts/01-schema.sql
   ```
2. **Seed Initial Multilingual Data**:
   ```bash
   # Populate all 9 tables with complete tri-lingual content (en, fr, ar):
   scripts/02-seed-data.sql
   ```

---

## 🔄 `imsabbar OS` Integration Contract

The public portfolio is the **runtime source of truth**. When managed via the companion `imsabbar OS` Admin Application, the following contract rules apply (see detailed specification in [`CONTRACT-NOTES.md`](CONTRACT-NOTES.md) and [`ARCHITECTURE.md`](ARCHITECTURE.md)):

1. **On-Demand Cache Revalidation**:
   * **Endpoint**: `POST https://imsabbar.com/api/revalidate`
   * **Headers**: `Authorization: Bearer <PORTFOLIO_REVALIDATE_SECRET>`, `Content-Type: application/json`
   * **Payload**: Must send an array of tags (e.g. `{ "tags": ["portfolio_plans", "portfolio_settings"] }`).
2. **Nullable Fields for Direct Leads**:
   * `portfolio_leads.name` and `portfolio_leads.email` are **`NULL`able** to allow quick booking gate drop-offs and WhatsApp tracking clicks.
3. **Soft Deletions & Lead Metadata**:
   * Leads write `locale`, `consent_at`, `privacy_policy_version`, `attachment_original_name`, `attachment_mime`, `attachment_size`, `internal_notes`, `is_read`, and `deleted_at`.

---

## ⚙️ Environment Variables Reference

Copy `.env.example` to `.env.local` for local development:

```bash
cp .env.example .env.local
```

| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORTFOLIO_DB_HOST` | Hostinger MySQL Host | `127.0.0.1` or `srvXXX.hostinger.com` |
| `PORTFOLIO_DB_PORT` | MySQL Port | `3306` |
| `PORTFOLIO_DB_USER` | MySQL Username | `u123456789_portfolio` |
| `PORTFOLIO_DB_PASSWORD` | MySQL Password | `your_secure_password` |
| `PORTFOLIO_DB_NAME` | MySQL Database Name | `u123456789_portfolio_db` |
| `PORTFOLIO_REVALIDATE_SECRET`| Shared secret for cache revalidation | High-entropy random string |
| `PORTFOLIO_ALLOWED_ORIGINS` | Comma-separated allowed OS origins for revalidation | `https://os.imsabbar.com,http://localhost:3001` |
| `USE_SAMPLE_DATA` | Set `true` to run locally without a database | `false` |
| `PORTFOLIO_IP_HASH_PEPPER` | Salt for hashing visitor IPs | High-entropy secret |
| `NEXT_PUBLIC_CLOUDFLARE_TURNSTILE_SITE_KEY` | Turnstile public widget key | `0x4AAAAAA...` |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Turnstile verification secret | `0x4AAAAAA...` |
| `TELEGRAM_BOT_TOKEN` | Telegram bot token for instant lead alerts | `123456:ABC-DEF...` |
| `TELEGRAM_CHAT_ID` | Telegram chat ID for admin alerts | `987654321` |
| `RESEND_API_KEY` | Resend API key for automated client receipts | `re_12345678...` |
| `RESEND_FROM_EMAIL` | Sender address for auto-reply emails | `Ismail Sabbar <noreply@imsabbar.com>` |
| `NOTIFICATION_EMAIL` | Admin inbox address | `contact@imsabbar.com` |
| `NEXT_PUBLIC_SITE_URL` | Canonical public URL | `https://imsabbar.com` |
| `PORTFOLIO_UPLOAD_PATH` | Server directory for lead attachment storage | `/home/user/uploads/portfolio/leads` |

---

## 🛠️ Local Development & Quality Assurance

### Prerequisites
* **Node.js**: `v20.x` or `v22.x` (LTS)
* **npm**: `v10.x` or later

### Installation & Run

```bash
# Install dependencies
npm install

# Run development server (runs with sample data if no DB configured)
npm run dev

# Open in browser:
# http://localhost:3000/en
# http://localhost:3000/fr
# http://localhost:3000/ar
```

### Production Build & Typecheck

```bash
# Verify TypeScript, linting, and generate static/dynamic route artifacts
npm run build

# Start the optimized production build locally
npm start
```

---

## 🚢 Deployment Runbook (Hostinger / VPS / Node.js)

`next.config.ts` is pre-configured with `output: 'standalone'`, creating a minimal standalone bundle at `.next/standalone`.

### 1. Build Production Artifacts
```bash
npm run build
```

### 2. Prepare Standalone Bundle
Copy the static assets into the standalone directory:
```bash
cp -r public .next/standalone/
cp -r .next/static .next/standalone/.next/
```

### 3. Launch via PM2 or Node.js
```bash
cd .next/standalone
PORT=3000 node server.js
```

---

## 📄 License & Attribution

© 2026 Ismail Sabbar. All rights reserved.  
Engineered with precision for performance, security, and conversion.
