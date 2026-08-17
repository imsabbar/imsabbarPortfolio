import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24 hours

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://imsabbar.com';

  const content = `# Ismail Sabbar — Public Portfolio & Engineering Knowledge Base

> Senior Full-Stack Developer & Automation Engineer with 12+ years of experience specializing in enterprise n8n workflow automation, Perfex CRM custom module development, and high-performance Next.js web applications.

## Core Specializations
- **n8n Workflow Automation**: Multi-app webhook orchestration, error-resilient pipelines, self-hosted n8n infrastructure, AI agent tool integration, queue management.
- **Perfex CRM Module Engineering**: Custom PHP/CodeIgniter modules, billing & invoicing hooks, custom API integrations, automated client onboarding workflows.
- **High-Performance Web Applications**: Next.js 15 App Router, React 19, TypeScript, Tailwind CSS 4, MySQL connection pooling, multi-currency pricing, tri-lingual i18n (EN/FR/AR).

## Key Links & Documentation
- [Homepage (English)](${siteUrl}/en): Main portfolio, interactive ROI calculator, pricing tiers, and direct consultation booking.
- [Homepage (French)](${siteUrl}/fr): Version française complète du portfolio et des services.
- [Homepage (Arabic)](${siteUrl}/ar): النسخة العربية الكاملة للموقع وسجل الأعمال.
- [Case Studies Directory](${siteUrl}/en#case-studies): Detailed technical breakdowns of production client automation builds.
- [Full Technical Profile](${siteUrl}/llms-full.txt): Complete case study list, tech stack details, and enterprise SLA terms.

## Verified Production Case Studies
- [Automated Multi-CRM Lead Engine](${siteUrl}/en/case-studies/janna-puzzle): 14-node n8n workflow syncing webhook leads to Perfex CRM and Google Sheets with instant Telegram alerts. Saved 120 hrs/month.
- [Real-Time Client Invoicing Automation](${siteUrl}/en/case-studies/digiprod): Perfex CRM automated invoicing pipeline with PDF generation and email dispatch. 99.8% on-time billing.
- [Enterprise Support SLA Dispatcher](${siteUrl}/en/case-studies/pso): Priority ticket routing automation with escalation alerts and automated SLA tracking.

## Contact & Direct Booking
- **Official Website**: ${siteUrl}
- **Email**: contact@imsabbar.com
- **Direct WhatsApp**: +212 681 510 095 (https://wa.me/212681510095)
- **LinkedIn**: https://www.linkedin.com/in/sabbarismail/
- **GitHub**: https://github.com/imsabbar
- **Telegram**: https://t.me/imsabbar
- **ICE Registration (B2B)**: 003294812000045
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
