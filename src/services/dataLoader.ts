import { Dua, RawDuaData, DayOfWeek } from '../types/dua';

// Import the JSON data
import duasData from '../../assets/data/duas.json';

const rawData = duasData as RawDuaData;

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
