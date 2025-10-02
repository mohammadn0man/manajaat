/**
 * Runtime data validation utilities
 * Provides type-safe validation for critical data structures
 */

import { Dua, RawDuaData, DayOfWeek } from '../types/dua';
import { errorLogger } from './errorLogger';

/**
 * Validate if a value is a valid DayOfWeek
 */
export const isValidDayOfWeek = (value: any): value is DayOfWeek => {
  const validDays: DayOfWeek[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];
  return typeof value === 'string' && validDays.includes(value as DayOfWeek);
};

/**
 * Validate if a value is a valid Dua object (for normalized data)
 */
export const isValidDua = (value: any): value is Dua => {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.id === 'string' &&
    isValidDayOfWeek(value.day) &&
    typeof value.arabic === 'string' &&
    value.arabic.length > 0 &&
    value.translations &&
    typeof value.translations === 'object' &&
    typeof value.translations.en === 'string' &&
    value.translations.en.length > 0 &&
    typeof value.translations.ur === 'string' &&
    value.translations.ur.length > 0 &&
    typeof value.reference === 'string'
  );
};

/**
 * Validate if a value is a valid raw dua object (from JSON)
 */
export const isValidRawDua = (value: any): boolean => {
  if (!value || typeof value !== 'object') return false;

  return (
    typeof value.arabic === 'string' &&
    value.arabic.length > 0 &&
    value.translations &&
    typeof value.translations === 'object' &&
    typeof value.translations.en === 'string' &&
    value.translations.en.length > 0 &&
    typeof value.translations.ur === 'string' &&
    value.translations.ur.length > 0 &&
    typeof value.reference === 'string'
  );
};

/**
 * Validate if a value is a valid RawDuaData structure
 */
export const isValidRawDuaData = (value: any): value is RawDuaData => {
  if (!value || typeof value !== 'object') return false;

  // Check if it has the required days field
  if (!value.days || typeof value.days !== 'object') {
    errorLogger.logError(
      'Missing or invalid days field in data',
      new Error('Expected days object'),
      { context: 'validation.isValidRawDuaData', hasDays: !!value.days },
      'medium'
    );
    return false;
  }

  // Check each day's duas array
  for (const [day, duas] of Object.entries(value.days)) {
    if (!isValidDayOfWeek(day)) {
      errorLogger.logError(
        `Invalid day of week: ${day}`,
        new Error(`Invalid day: ${day}`),
        { context: 'validation.isValidRawDuaData', day },
        'medium'
      );
      return false;
    }

    if (!Array.isArray(duas)) {
      errorLogger.logError(
        `Invalid duas array for day: ${day}`,
        new Error(`Expected array, got ${typeof duas}`),
        { context: 'validation.isValidRawDuaData', day, type: typeof duas },
        'medium'
      );
      return false;
    }

    // Validate each dua in the array
    for (let i = 0; i < duas.length; i++) {
      const dua = duas[i];
      if (!isValidRawDua(dua)) {
        errorLogger.logError(
          `Invalid dua at index ${i} for day ${day}`,
          new Error(`Invalid dua structure`),
          { context: 'validation.isValidRawDuaData', day, index: i, dua },
          'medium'
        );
        return false;
      }
    }
  }

  return true;
};

/**
 * Validate and normalize duas data with error handling
 */
export const validateDuasData = (rawData: any): Dua[] => {
  try {
    if (!isValidRawDuaData(rawData)) {
      throw new Error('Invalid duas data structure');
    }

    const normalizedDuas: Dua[] = [];

    Object.entries(rawData.days).forEach(([day, duas]) => {
      if (Array.isArray(duas)) {
        duas.forEach((dua, index) => {
          if (isValidRawDua(dua)) {
            normalizedDuas.push({
              id: `${day}-${index}`,
              day: day as DayOfWeek,
              arabic: dua.arabic,
              translations: {
                en: dua.translations.en,
                ur: dua.translations.ur,
              },
              reference: dua.reference,
            });
          } else {
            errorLogger.logError(
              `Skipping invalid dua at ${day}[${index}]`,
              new Error('Invalid dua structure'),
              { context: 'validation.validateDuasData', day, index, dua },
              'medium'
            );
          }
        });
      }
    });

    if (normalizedDuas.length === 0) {
      throw new Error('No valid duas found in data');
    }

    return normalizedDuas;
  } catch (error) {
    errorLogger.logCritical('Failed to validate duas data', error, {
      context: 'validation.validateDuasData',
    });
    throw error;
  }
};

/**
 * Validate component props with error logging
 */
export const validateProps = <T extends Record<string, any>>(
  props: T,
  requiredProps: (keyof T)[],
  componentName: string
): boolean => {
  const missingProps: string[] = [];

  requiredProps.forEach((prop) => {
    if (props[prop] === undefined || props[prop] === null) {
      missingProps.push(String(prop));
    }
  });

  if (missingProps.length > 0) {
    errorLogger.logError(
      `Missing required props in ${componentName}`,
      new Error(`Missing props: ${missingProps.join(', ')}`),
      {
        context: 'validation.validateProps',
        component: componentName,
        missingProps,
        receivedProps: Object.keys(props),
      },
      'high'
    );
    return false;
  }

  return true;
};

/**
 * Validate array bounds to prevent index errors
 */
export const validateArrayIndex = (
  array: any[],
  index: number,
  context: string
): boolean => {
  if (index < 0 || index >= array.length) {
    errorLogger.logError(
      `Array index out of bounds`,
      new Error(
        `Index ${index} is out of bounds for array of length ${array.length}`
      ),
      {
        context: 'validation.validateArrayIndex',
        arrayLength: array.length,
        requestedIndex: index,
        operationContext: context,
      },
      'high'
    );
    return false;
  }
  return true;
};

/**
 * Validate that a value is not null/undefined
 */
export const validateNotNull = <T>(
  value: T | null | undefined,
  name: string,
  context: string
): value is T => {
  if (value === null || value === undefined) {
    errorLogger.logError(
      `Null/undefined value for ${name}`,
      new Error(`${name} is null or undefined`),
      {
        context: 'validation.validateNotNull',
        valueName: name,
        operationContext: context,
      },
      'medium'
    );
    return false;
  }
  return true;
};
