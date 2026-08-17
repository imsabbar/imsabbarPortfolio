import { NextResponse } from 'next/server';
import { getAllCaseStudySlugs, getCaseStudyDetail } from '@/lib/sections';
import { getLocalizedField } from '@/lib/db/helpers';
import { getSiteUrl } from '@/lib/constants';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24 hours

export async function GET() {
  const siteUrl = getSiteUrl();

  let caseStudiesBullets = '';
  try {
    const slugs = await getAllCaseStudySlugs();
    for (const slug of slugs) {
      const cs = await getCaseStudyDetail(slug);
      if (cs) {
        const title = getLocalizedField(cs.title_i18n, cs.title, 'en');
        const summary = getLocalizedField(cs.summary_i18n, cs.summary, 'en');
        caseStudiesBullets += `- [${title}](${siteUrl}/en/case-studies/${slug}): ${summary}\n`;
      }
    }
  } catch (e) {
    console.warn('[llms.txt] case studies fetch failed', e);
  }

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
${caseStudiesBullets || `- [Janna Puzzle](${siteUrl}/en/case-studies/janna-puzzle): A playful brand web experience built for engagement and speed.\n- [Digiprod](${siteUrl}/en/case-studies/digiprod): Production client web application.`}

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
