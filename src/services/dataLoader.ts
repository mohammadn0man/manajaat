import { Dua, RawDuaData, DayOfWeek } from '../types/dua';

import duasData from '../../assets/data/duas.json';
import startDataJson from '../../assets/data/start.json';

const rawData = duasData as RawDuaData;

export type StartLangKey = 'en' | 'ur' | 'rom-ur';

export interface StartDuaItem {
  id: number;
  arabic: string;
  translations: Record<StartLangKey, string>;
}

export interface StartData {
  title: Record<StartLangKey, string>;
  start: Record<StartLangKey, string>;
  duas: StartDuaItem[];
}

const startData = startDataJson as {
  title: Record<StartLangKey, string>;
  start: Record<StartLangKey, string>;
  duas: StartDuaItem[];
};

// Normalize the raw data into our typed format
export const normalizeDuasData = (): Dua[] => {
  const normalizedDuas: Dua[] = [];

  Object.entries(rawData.days).forEach(([day, duas]) => {
    duas.forEach((dua, index) => {
      normalizedDuas.push({
        id: `${day}-${index}`,
        day: day as DayOfWeek,
        arabic: dua.arabic,
        translations: {
          en: dua.translations.en,
          ur: dua.translations.ur,
          'rom-ur': dua.translations['rom-ur'],
        },
        reference: dua.reference,
      });
    });
  });

  return normalizedDuas;
};

// Cache the normalized data
let cachedDuas: Dua[] | null = null;

export const getDuasData = (): Dua[] => {
  if (!cachedDuas) {
    cachedDuas = normalizeDuasData();
  }
  return cachedDuas;
};

// Get raw data structure for accessing by days
export const getRawDuasData = (): RawDuaData => {
  return rawData;
};

export const getStartData = (): StartData => ({
  title: startData.title,
  start: startData.start,
  duas: startData.duas,
});

/** Resolve app language to a key present in start.json (no 'ar', fallback to 'en'). */
export const getStartLangKey = (language: string): StartLangKey => {
  if (language === 'ur' || language === 'rom-ur') return language;
  return 'en';
};
