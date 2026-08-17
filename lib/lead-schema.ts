import { z } from 'zod';

const optionalText = (max: number) =>
  z.preprocess(
    (value) => (typeof value === 'string' && value.trim() === '' ? undefined : value),
    z.string().trim().max(max).optional()
  );

export const localeSchema = z.enum(['en', 'fr', 'ar']);
export const currencySchema = z.enum(['USD', 'EUR', 'GBP', 'AED', 'MAD']);
const sourcePageSchema = z.string().trim().max(255).refine((value) => value.startsWith('/') && !/[\r\n]/.test(value), 'Source page must be a local path');

export const leadInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(254),
  phone: optionalText(30),
  company: optionalText(200),
  country: optionalText(100),
  service_interest: optionalText(100),
  estimated_budget: z.preprocess(
    (value) => (value === '' || value === undefined || value === null ? undefined : value),
    z.coerce.number().nonnegative().max(1_000_000).optional()
  ),
  currency: currencySchema.default('USD'),
  timeline: optionalText(100),
  message: optionalText(4000),
  calculated_roi_savings: optionalText(1000),
  source_page: sourcePageSchema.default('/'),
  referrer: optionalText(500),
  utm_source: optionalText(100),
  utm_medium: optionalText(100),
  utm_campaign: optionalText(100),
  locale: localeSchema.default('en'),
  consent: z.preprocess((value) => value === 'true' || value === true, z.boolean()).default(false),
  privacy_policy_version: z.string().trim().max(40).default('2026-08-13'),
  turnstile_token: z.string().trim().max(4096).default(''),
  honeypot: z.string().max(200).default(''),
  form_start_time: z.coerce.number().int().nonnegative(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const bookingInputSchema = z.object({
  project_type: z.string().trim().min(1).max(100),
  budget_range: z.enum(['small', 'medium', 'large']),
  source_page: sourcePageSchema.default('/'),
  locale: localeSchema.default('en'),
  turnstile_token: z.string().trim().max(4096).default(''),
  form_start_time: z.coerce.number().int().nonnegative(),
});

export type BookingInput = z.infer<typeof bookingInputSchema>;

export const clickInputSchema = z.object({
  source_page: sourcePageSchema.default('/'),
  locale: localeSchema.default('en'),
});
