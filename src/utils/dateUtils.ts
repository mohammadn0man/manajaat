/**
 * Date utility functions for the app
 */

/**
 * Get today's date in YYYY-MM-DD format for storage keys
 */
export const dateKeyForToday = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get a date key for a specific date
 */
export const dateKeyForDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Check if a date is today
 */
export const isToday = (date: Date): boolean => {
  return dateKeyForDate(date) === dateKeyForToday();
};

/**
 * Get today's date object
 */
export const getToday = (): Date => {
  const today = new Date();
  return today;
};
