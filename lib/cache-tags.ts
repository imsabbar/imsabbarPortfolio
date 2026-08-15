/**
 * Cache tags — PRD §7.6.
 *
 * `revalidateTag()` is the OS-triggered cache invalidation mechanism. The tag
 * names below are the **single source of truth** — the imsabbar OS Portfolio
 * Manager module (separate repo, per PRD §2.1) imports the same names.
 *
 * Never inline tag strings. Always import `CACHE_TAGS.<key>`.
 */

export const CACHE_TAGS = {
  settings: 'portfolio_settings',
  contentBlocks: 'portfolio_content_blocks',
  services: 'portfolio_services',
  plans: 'portfolio_plans',
  caseStudies: 'portfolio_case_studies',
  techStack: 'portfolio_tech_stack',
  testimonials: 'portfolio_testimonials',
  clientLogos: 'portfolio_client_logos',
  faq: 'portfolio_faq',
} as const;

export type CacheTag = (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];

/** Frozen allowlist — used by `/api/revalidate` to reject unknown tags (PRD §8.1). */
export const ALLOWED_TAGS: ReadonlySet<CacheTag> = new Set(Object.values(CACHE_TAGS));

/** Returns true iff `tag` is a known revalidation tag. */
export function isAllowedTag(tag: unknown): tag is CacheTag {
  return typeof tag === 'string' && (ALLOWED_TAGS as ReadonlySet<string>).has(tag);
}
