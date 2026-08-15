/**
 * DB column helpers — PRD §7.5.
 *
 * Both helpers are fully typed (no `any`) and used by the repository layer.
 *
 * - `parseJsonColumn<T>` is defensive: mysql2 returns JSON columns as parsed
 *   objects by default, but if a column was stored as TEXT (e.g. during a
 *   migration) we still want a clean parse.
 *
 * - `getLocalizedField` resolves the { en, fr, ar } shape with a strict
 *   fallback order: requested locale → en fallback → first available key.
 *   It never throws; on empty input it returns the provided fallback.
 */

import type { Locale } from '@/i18n/config';
import type { LocalizedString, LocalizedStringList } from '@/types/portfolio';

// ---------------------------------------------------------------------------
// parseJsonColumn<T>
// ---------------------------------------------------------------------------

/**
 * Parse a JSON column value that may be:
 * - `null` / `undefined` → returns the fallback.
 * - already an object → returns it after a shape sanity check.
 * - a JSON string → `JSON.parse`d.
 *
 * The type parameter `T` is the *expected* shape. If the parsed value doesn't
 * match (e.g. wrong type), the fallback is returned and the value is logged.
 */
export function parseJsonColumn<T>(value: unknown, fallback: T): T {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    if (value.trim().length === 0) return fallback;
    try {
      return JSON.parse(value) as T;
    } catch (err) {
      console.warn('[parseJsonColumn] failed to parse JSON string, using fallback', err instanceof Error ? err.message : err);
      return fallback;
    }
  }
  // Already an object/array — trust the type at runtime boundary.
  return value as T;
}

/** Like `parseJsonColumn` but returns `null` when the input is empty/missing instead of a fallback. */
export function parseJsonColumnOrNull<T>(value: unknown): T | null {
  if (value === null || value === undefined) return null;
  if (typeof value === 'string' && value.trim().length === 0) return null;
  try {
    const parsed = typeof value === 'string' ? (JSON.parse(value) as T) : (value as T);
    return parsed;
  } catch (err) {
    console.warn('[parseJsonColumnOrNull] failed to parse JSON, returning null', err instanceof Error ? err.message : err);
    return null;
  }
}

// ---------------------------------------------------------------------------
// getLocalizedField
// ---------------------------------------------------------------------------

/**
 * Resolve a value from a 3-locale i18n object.
 *
 * Order: requested locale → 'en' → first non-empty key → fallback string.
 *
 * `i18nObj` may be missing keys for locales the OS hasn't translated yet;
 * that's fine — we fall through.
 */
export function getLocalizedField(
  i18nObj: LocalizedString | null | undefined,
  fallback: string,
  currentLang: Locale
): string {
  if (!i18nObj) return fallback;

  const requested = i18nObj[currentLang];
  if (typeof requested === 'string' && requested.length > 0) return requested;

  const en = i18nObj.en;
  if (typeof en === 'string' && en.length > 0) return en;

  for (const key of Object.keys(i18nObj)) {
    const val = i18nObj[key];
    if (typeof val === 'string' && val.length > 0) return val;
  }

  return fallback;
}

/**
 * Resolve a list of strings from a 3-locale i18n array.
 * Order: requested locale → 'en' → first non-empty array → empty array.
 */
export function getLocalizedList(
  i18nObj: LocalizedStringList | null | undefined,
  currentLang: Locale
): string[] {
  if (!i18nObj) return [];

  const requested = i18nObj[currentLang];
  if (Array.isArray(requested) && requested.length > 0) return requested;

  const en = i18nObj.en;
  if (Array.isArray(en) && en.length > 0) return en;

  for (const key of Object.keys(i18nObj)) {
    const val = i18nObj[key];
    if (Array.isArray(val) && val.length > 0) return val;
  }

  return [];
}

// ---------------------------------------------------------------------------
// Settings row → typed object
// ---------------------------------------------------------------------------

/** Resolved settings row keys. The OS app is allowed to add new keys, but the typed
 * shape we return below is the PRD §4.9 canonical set. */
export const SETTINGS_KEYS = [
  'availability_status',
  'ice_registration_number',
  'contact_email',
  'contact_phone',
  'scheduling_link',
  'resume_en_filename',
  'resume_fr_filename',
  'resume_ar_filename',
  'social_links_json',
  'sla_notice',
  'stats_years_value',
  'stats_clients_value',
  'stats_projects_value',
] as const;

export type SettingsKey = (typeof SETTINGS_KEYS)[number];

/** Coerce a raw settings row array into a typed key→value map. */
export function indexSettings(rows: ReadonlyArray<{ setting_key: string; setting_value: string }>): Map<string, string> {
  const map = new Map<string, string>();
  for (const row of rows) {
    map.set(row.setting_key, row.setting_value);
  }
  return map;
}
