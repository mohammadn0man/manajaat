import * as suncalc from 'suncalc';

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
  morningNotification: Date; // Sunrise - 10 minutes
  eveningNotification: Date; // Sunset + 20 minutes
}

/**
 * Calculate sunrise and sunset times for a given date and location
 * @param latitude - Latitude coordinate
 * @param longitude - Longitude coordinate
 * @param date - Date to calculate for (defaults to today)
 * @returns SunTimes object with sunrise, sunset, and notification times
 */
export function calculateSunTimes(
  latitude: number,
  longitude: number,
  date: Date = new Date()
): SunTimes {
  // Get sunrise and sunset times for the given date and location
  const times = suncalc.getTimes(date, latitude, longitude);

  const sunrise = times.sunrise;
  const sunset = times.sunset;

  // Calculate notification times
  // Morning: 10 minutes before sunrise
  const morningNotification = new Date(sunrise);
  morningNotification.setMinutes(morningNotification.getMinutes() - 10);

  // Evening: 20 minutes after sunset
  const eveningNotification = new Date(sunset);
  eveningNotification.setMinutes(eveningNotification.getMinutes() + 20);

  return {
    sunrise,
    sunset,
    morningNotification,
    eveningNotification,
  };
}

/**
 * Get the next occurrence of a notification time
 * If the time has already passed today, return tomorrow's time
 * @param notificationTime - The notification time for today
 * @returns Date for the next occurrence
 */
export function getNextNotificationTime(notificationTime: Date): Date {
  const now = new Date();
  const todayNotification = new Date(notificationTime);
  
  // Set to today's date but keep the time
  todayNotification.setFullYear(now.getFullYear());
  todayNotification.setMonth(now.getMonth());
  todayNotification.setDate(now.getDate());

  // If the time has already passed today, schedule for tomorrow
  if (todayNotification <= now) {
    todayNotification.setDate(todayNotification.getDate() + 1);
  }

  return todayNotification;
}
