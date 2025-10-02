import { Dua, RawDuaData } from '../types/dua';
import { validateDuasData } from '../utils/validation';
import { errorLogger } from '../utils/errorLogger';

// Import the JSON data
import duasData from '../../assets/data/duas.json';

const rawData = duasData as RawDuaData;

// Normalize the raw data into our typed format with validation
export const normalizeDuasData = (): Dua[] => {
  try {
    // Log the data structure for debugging
    errorLogger.logWarning('Validating duas data structure', {
      context: 'dataLoader.normalizeDuasData',
      hasDays: !!rawData.days,
      hasSchemaVersion: !!rawData.schema_version,
      daysKeys: rawData.days ? Object.keys(rawData.days) : [],
    });

    return validateDuasData(rawData);
  } catch (error) {
    errorLogger.logCritical('Failed to normalize duas data', error, {
      context: 'dataLoader.normalizeDuasData',
    });
    // Return empty array as fallback to prevent app crash
    return [];
  }
};

// Cache the normalized data
let cachedDuas: Dua[] | null = null;

export const getDuasData = (): Dua[] => {
  if (!cachedDuas) {
    try {
      cachedDuas = normalizeDuasData();
    } catch (error) {
      errorLogger.logCritical('Failed to get duas data', error, {
        context: 'dataLoader.getDuasData',
      });
      cachedDuas = [];
    }
  }
  return cachedDuas;
};

// Get raw data structure for accessing by days
export const getRawDuasData = (): RawDuaData => {
  return rawData;
};
