/**
 * Translation utility functions to eliminate duplicate code
 */

import { Dua } from '../types/dua';

export type Language = 'en' | 'ur' | 'ar';

/**
 * Get translation for a specific language with fallback
 * Centralized logic to prevent duplication across components
 */
export const getTranslationForLanguage = (
  translations: Dua['translations'],
  language: Language
): string => {
  // Try the requested language first
  if (translations[language]) {
    return translations[language];
  }

  // Fallback to English
  if (translations.en) {
    return translations.en;
  }

  // Fallback to Urdu
  if (translations.ur) {
    return translations.ur;
  }

  // Return empty string if no translation found
  return '';
};

/**
 * Get all available translations for a dua
 */
export const getAllTranslations = (
  translations: Dua['translations']
): Record<string, string> => {
  const availableTranslations: Record<string, string> = {};

  if (translations.en) availableTranslations.en = translations.en;
  if (translations.ur) availableTranslations.ur = translations.ur;
  if (translations.ar) availableTranslations.ar = translations.ar;

  return availableTranslations;
};

/**
 * Check if a translation exists for a specific language
 */
export const hasTranslation = (
  translations: Dua['translations'],
  language: Language
): boolean => {
  return !!(translations[language] && translations[language].trim().length > 0);
};
