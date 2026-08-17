import { NextResponse } from 'next/server';
import { getAllCaseStudySlugs, getCaseStudyDetail } from '@/lib/sections';
import { getLocalizedField } from '@/lib/db/helpers';
import { getSiteUrl } from '@/lib/constants';

export const runtime = 'nodejs';
export const revalidate = 86400; // 24 hours

export async function GET() {
  const siteUrl = getSiteUrl();

  let caseStudiesMarkdown = '';
  try {
    const slugs = await getAllCaseStudySlugs();
    for (const slug of slugs) {
      const cs = await getCaseStudyDetail(slug);
      if (cs) {
        const title = getLocalizedField(cs.title_i18n, cs.title, 'en');
        const summary = getLocalizedField(cs.summary_i18n, cs.summary, 'en');
        caseStudiesMarkdown += `\n### [${title}](${siteUrl}/en/case-studies/${slug})\n- **Client Industry**: ${cs.client_name || 'Enterprise'} (${cs.client_region || 'Global'})\n- **Impact Metric**: ${cs.impact_metric || 'Significant Efficiency Gain'}\n- **Summary**: ${summary}\n`;
      }
    }
  } catch (e) {
    console.warn('[llms-full.txt] case studies fetch failed', e);
  }

  const content = `# Ismail Sabbar — Full Technical Profile & Architecture Knowledge Base

> Comprehensive technical profile for AI search engines, LLMs, and enterprise clients.
> Senior Full-Stack Developer & Automation Engineer with 12+ years of experience.

## Executive Profile
- **Name**: Ismail Sabbar
- **Location**: Morocco (UTC+1) / Serving Global Clients (US, EU, GCC, North Africa)
- **Primary Languages**: English (Professional), French (Fluent), Arabic (Native)
- **Business Registration (ICE)**: 003294812000045 (Official B2B Invoicing & Contracted SLAs)

## Core Technical Proficiencies
1. **n8n Workflow Automation**:
   - Complex Multi-Step Pipelines, Webhook Listeners, Error Triggers, Telegram/Slack Alert Dispatchers.
   - Self-Hosted Infrastructure, Queue Workers, API Authentication, Secure Token Vaults.
2. **Perfex CRM Architecture**:
   - Custom Module Development (CodeIgniter/PHP), Custom Hooks, Database Migrations, Invoicing & Lead Pipelines.
3. **Full-Stack & Cloud Engineering**:
   - Next.js 15 App Router, React 19, TypeScript 5.7, Tailwind CSS 4, MySQL 8, Redis, REST APIs, Cloudflare CDN.

## Production Case Studies Directory
${caseStudiesMarkdown || '- Automated Multi-CRM Lead Engine\n- Real-Time Client Invoicing Automation\n- Enterprise Support SLA Dispatcher'}

## Standard Pricing & Engagement Models
- **Strategy & Automation Audit**: Fixed scope workflow architecture review and blueprint.
- **Workflow & Module Implementation**: Dedicated sprint-based delivery for n8n pipelines or Perfex CRM custom modules.
- **Monthly Enterprise Retainer**: Dedicated ongoing maintenance, priority SLA response (<2hr), continuous optimization.

## Contact & Direct Channels
- **Website**: ${siteUrl}
- **Email**: contact@imsabbar.com
- **WhatsApp Direct**: +212 681 510 095 (https://wa.me/212681510095)
- **LinkedIn**: https://www.linkedin.com/in/sabbarismail/
- **GitHub**: https://github.com/imsabbar
- **Telegram**: https://t.me/imsabbar
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
