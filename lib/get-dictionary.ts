import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/types/dictionary';
import en from '@/dictionaries/en.json';
import fr from '@/dictionaries/fr.json';
import ar from '@/dictionaries/ar.json';

const dictionaries: Record<Locale, Dictionary> = {
  en,
  fr,
  ar,
};

export const getDictionary = async (locale: Locale | string): Promise<Dictionary> => {
  return dictionaries[locale as Locale] || dictionaries.en;
};
