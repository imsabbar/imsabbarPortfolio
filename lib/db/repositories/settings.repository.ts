/**
 * Settings repository — `portfolio_settings` table (PRD §7.3).
 *
 * Settings are a key/value store with a single-row-per-key shape. Most values
 * are plain strings, but `social_links_json` is a JSON object — parsed via
 * `parseJsonColumn` defensively.
 */

import 'server-only';
import { unstable_cache } from 'next/cache';
import { CACHE_TAGS } from '@/lib/cache-tags';
import { query, isDbConfigured, DbNotConfiguredError } from '@/lib/db/mysql';
import { parseJsonColumn, indexSettings } from '@/lib/db/helpers';
import type { RowDataPacket } from 'mysql2';
import type { PortfolioSettings, SettingRow, SocialLinks } from '@/types/portfolio';

interface SettingsRowRaw extends RowDataPacket {
  setting_key: string;
  setting_value: string;
  updated_at: Date | string;
}

function rowToSetting(r: SettingsRowRaw): SettingRow {
  return {
    setting_key: r.setting_key,
    setting_value: r.setting_value,
    updated_at: typeof r.updated_at === 'string' ? r.updated_at : r.updated_at.toISOString(),
  };
}

const DEFAULT_SOCIAL_LINKS: SocialLinks = {
  linkedin: 'https://www.linkedin.com/in/sabbarismail/',
  github: 'https://github.com/imsabbar',
  youtube: 'https://www.youtube.com/@imsabbar',
  telegram: 'https://t.me/imsabbar',
  whatsapp: 'https://wa.me/212681510095',
  email: 'mailto:contact@imsabbar.com',
};

/**
 * Returns all settings rows as a typed `PortfolioSettings` object.
 * Missing keys fall back to the hard-coded defaults above — these are
 * non-secret, non-translatable values that the site can never go down without.
 */
export async function findSettings(): Promise<PortfolioSettings> {
  if (!isDbConfigured()) throw new DbNotConfiguredError('Settings: DB not configured');
  const rows = await query<SettingsRowRaw>('SELECT setting_key, setting_value, updated_at FROM portfolio_settings');
  const map = indexSettings(rows.map(rowToSetting));

  const socialLinks = parseJsonColumn<SocialLinks>(map.get('social_links_json'), DEFAULT_SOCIAL_LINKS);

  return {
    availability_status: (map.get('availability_status') === 'busy' ? 'busy' : 'online'),
    ice_registration_number: map.get('ice_registration_number') ?? '003294812000045',
    contact_email: map.get('contact_email') ?? 'contact@imsabbar.com',
    contact_phone: map.get('contact_phone') ?? '+212681510095',
    scheduling_link: map.get('scheduling_link') ?? '',
    resume_en_filename: map.get('resume_en_filename') ?? 'imsabbar_MEN_V25.9.pdf',
    resume_fr_filename: map.get('resume_fr_filename') ?? 'imsabbar_MFR_V25.9.pdf',
    // PRD §7.3: ar falls back to en until a dedicated AR file is added.
    resume_ar_filename: map.get('resume_ar_filename') ?? map.get('resume_en_filename') ?? 'imsabbar_MEN_V25.9.pdf',
    social_links: { ...DEFAULT_SOCIAL_LINKS, ...socialLinks },
    sla_notice: map.get('sla_notice') ?? '',
    stats_years_value: map.get('stats_years_value') ?? '12+',
    stats_clients_value: map.get('stats_clients_value') ?? '85+',
    stats_projects_value: map.get('stats_projects_value') ?? '200+',
  };
}

/** Cached version — used by RSC pages and `/api/public/settings`. */
export const findSettingsCached = unstable_cache(findSettings, ['repos', 'findSettings'], {
  tags: [CACHE_TAGS.settings],
  // 1 hour safety net (PRD §7.6) — OS-triggered revalidate is the primary path.
  revalidate: 3600,
});
