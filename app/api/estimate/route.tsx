import 'server-only';
import { NextResponse } from 'next/server';
import { Document, Page, Text, View, StyleSheet, renderToBuffer } from '@react-pdf/renderer';
import { z } from 'zod';
import { getDictionary } from '@/lib/get-dictionary';
import { getLocalizedField, getLocalizedList } from '@/lib/db/helpers';
import { findAllActivePlans, findSettings } from '@/lib/db/repositories';
import { canQueryDb, dbNotConfigured, err } from '@/lib/api-helpers';
import { isCurrency, type Currency } from '@/lib/currency';
import { displayNameForLocale } from '@/lib/constants';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/types/dictionary';
import type { Plan, PortfolioSettings } from '@/types/portfolio';

import { samplePlans, sampleSettings, sampleToPlan } from '@/lib/sample-data';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const inputSchema = z.object({ plan_id: z.coerce.number().int().positive(), currency: z.string(), locale: z.enum(['en', 'fr', 'ar']) });

const styles = StyleSheet.create({
  page: { padding: 42, fontSize: 10, color: '#17202b', fontFamily: 'Helvetica' },
  header: { borderBottom: '1 solid #d6dde5', paddingBottom: 14, marginBottom: 24, flexDirection: 'row', justifyContent: 'space-between' },
  brand: { fontSize: 17, fontWeight: 700, color: '#0e7490' },
  muted: { color: '#64748b', marginTop: 4 },
  ref: { textAlign: 'right', color: '#0e7490', fontWeight: 700 },
  card: { border: '1 solid #d6dde5', borderRadius: 8, padding: 16, marginBottom: 18 },
  title: { fontSize: 15, fontWeight: 700, marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { color: '#64748b' },
  price: { fontSize: 20, fontWeight: 700, color: '#0e7490' },
  bullet: { marginBottom: 6, lineHeight: 1.35 },
  footer: { position: 'absolute', bottom: 38, left: 42, right: 42, borderTop: '1 solid #d6dde5', paddingTop: 10, color: '#64748b', fontSize: 8 },
});

function priceFor(plan: Plan, currency: Currency): number {
  return ({ MAD: plan.price_mad, EUR: plan.price_eur, USD: plan.price_usd, GBP: plan.price_gbp, AED: plan.price_aed })[currency];
}

function EstimateDocument({ dict, locale, settings, plan, currency }: { dict: Dictionary; locale: Locale; settings: PortfolioSettings; plan: Plan; currency: Currency }) {
  const title = getLocalizedField(plan.title_i18n, plan.title, locale);
  const features = getLocalizedList(plan.features_json, locale);
  const price = priceFor(plan, currency);
  const date = new Date();
  const reference = `EST-${date.getUTCFullYear()}-${String(plan.id).padStart(3, '0')}`;
  const validUntil = new Date(date.getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString(locale);
  return (
    <Document title={dict.pdf.title} author={displayNameForLocale(locale)}>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <View><Text style={styles.brand}>{displayNameForLocale(locale).toUpperCase()}</Text><Text style={styles.muted}>Automation & CRM Engineering</Text><Text style={styles.muted}>ICE: {settings.ice_registration_number}</Text></View>
          <View><Text style={styles.ref}>{reference}</Text><Text style={styles.muted}>{dict.pdf.validity}: {validUntil}</Text></View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.row}><Text style={styles.label}>{dict.pdf.total}</Text><Text style={styles.price}>{currency} {price.toLocaleString(locale)}</Text></View>
          <View style={styles.row}><Text style={styles.label}>{dict.pricing.turnaround}</Text><Text>{getLocalizedField(plan.turnaround_i18n, plan.turnaround, locale)}</Text></View>
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>{dict.pdf.scope}</Text>
          {features.length ? features.map((feature, index) => <Text key={index} style={styles.bullet}>• {feature}</Text>) : <Text>{dict.pdf.disclaimer}</Text>}
        </View>
        <Text style={styles.footer}>{dict.pdf.disclaimer} · {settings.contact_email}</Text>
      </Page>
    </Document>
  );
}

export async function POST(request: Request) {
  const isDev = process.env.NODE_ENV !== 'production';
  if (!canQueryDb() && !isDev) return dbNotConfigured();

  let raw: unknown;
  try { raw = await request.json(); } catch { return err('invalid_json', 'The estimate request could not be read.', 400); }
  const parsed = inputSchema.safeParse(raw);
  if (!parsed.success || !isCurrency(parsed.data?.currency)) return err('validation_error', 'The estimate selection is invalid.', 400);
  const { plan_id: planId, currency, locale } = parsed.data;
  try {
    let plans: Plan[];
    let settings: PortfolioSettings;
    const dict = await getDictionary(locale);

    if (canQueryDb()) {
      [plans, settings] = await Promise.all([findAllActivePlans(), findSettings()]);
    } else {
      // In dev fallback mode
      plans = samplePlans.map(sampleToPlan);
      settings = sampleSettings;
    }

    const plan = plans.find((item) => item.id === planId);
    if (!plan) return err('not_found', 'The selected plan is unavailable.', 404);
    const buffer = await renderToBuffer(<EstimateDocument dict={dict} locale={locale} settings={settings} plan={plan} currency={currency} />);
    return new NextResponse(buffer as BodyInit, { status: 200, headers: { 'Content-Type': 'application/pdf', 'Content-Disposition': `attachment; filename="estimate-${plan.slug}-${currency}.pdf"`, 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[api/estimate] failed', error);
    return err('internal_error', 'The estimate could not be generated.', 500);
  }
}


