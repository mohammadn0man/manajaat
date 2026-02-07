import { Dua } from '../types/dua';
import { Language } from '../services/storageService';

/**
 * Get the translation text for a dua based on the selected language
 * @param dua - The dua object containing translations
 * @param language - The selected language
 * @returns The translation text or empty string if not available
 */
export const getTranslation = (dua: Dua, language: Language): string => {
  if (!dua.translations) {
    return '';
  }

  // Priority order based on selected language
  if (language === 'ur') {
    return dua.translations.ur || '';
  }

  if (language === 'rom-ur') {
    return dua.translations['rom-ur'] || '';
  }

  if (language === 'ar') {
    return dua.translations.ar || '';
  }

  // Default to English, with fallback to Urdu, then Roman Urdu
  return (
    dua.translations.en ||
    dua.translations.ur ||
    dua.translations['rom-ur'] ||
    ''
  );
};

/**
 * Check if a language should be displayed as RTL
 * @param language - The selected language
 * @returns true if the language is RTL, false otherwise
 */
export const isLanguageRTL = (language: Language): boolean => {
  return language === 'ar' || language === 'ur';
};
