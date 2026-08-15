import type en from '@/dictionaries/en.json';

/**
 * Canonical dictionary type — inferred from en.json.
 * PRD Appendix A: all three dictionaries must carry identical key structure.
 */
export type Dictionary = typeof en;
