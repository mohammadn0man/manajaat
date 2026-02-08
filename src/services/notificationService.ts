import * as Notifications from 'expo-notifications';
import * as Location from 'expo-location';
import { calculateSunTimes, getNextNotificationTime } from '../utils/sunTimes';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const MORNING_NOTIFICATION_ID = 'morning-dua-reminder';
const EVENING_NOTIFICATION_ID = 'evening-dua-reminder';

export interface NotificationPermissions {
  notifications: boolean;
  location: boolean;
}

/**
 * Request notification permissions
 */
export async function requestNotificationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
}

/**
 * Request location permissions
 */
export async function requestLocationPermissions(): Promise<boolean> {
  try {
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Location.requestForegroundPermissionsAsync();
      finalStatus = status;
    }

    return finalStatus === 'granted';
  } catch (error) {
    console.error('Error requesting location permissions:', error);
    return false;
  }
}

/**
 * Get device location coordinates
 * Returns null if location is unavailable or permission denied
 */
export async function getDeviceLocation(): Promise<{
  latitude: number;
  longitude: number;
} | null> {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      console.warn('Location permission denied');
      return null;
    }

    const location = await Location.getCurrentPositionAsync({});
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error('Error getting device location:', error);
    return null;
  }
}

/**
 * Schedule morning notification (10 minutes before sunrise)
 */
async function scheduleMorningNotification(
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    const sunTimes = calculateSunTimes(latitude, longitude);
    const nextNotificationTime = getNextNotificationTime(sunTimes.morningNotification);

    await Notifications.scheduleNotificationAsync({
      identifier: MORNING_NOTIFICATION_ID,
      content: {
        title: 'Morning Dua Reminder',
        body: 'Time for your morning dua',
        sound: true,
      },
      trigger: nextNotificationTime.getTime(),
    });

    console.log('Morning notification scheduled for:', nextNotificationTime);
  } catch (error) {
    console.error('Error scheduling morning notification:', error);
    throw error;
  }
}

/**
 * Schedule evening notification (20 minutes after sunset)
 */
async function scheduleEveningNotification(
  latitude: number,
  longitude: number
): Promise<void> {
  try {
    const sunTimes = calculateSunTimes(latitude, longitude);
    const nextNotificationTime = getNextNotificationTime(sunTimes.eveningNotification);

    await Notifications.scheduleNotificationAsync({
      identifier: EVENING_NOTIFICATION_ID,
      content: {
        title: 'Evening Dua Reminder',
        body: 'Time for your evening dua',
        sound: true,
      },
      trigger: nextNotificationTime.getTime(),
    });

    console.log('Evening notification scheduled for:', nextNotificationTime);
  } catch (error) {
    console.error('Error scheduling evening notification:', error);
    throw error;
  }
}

/**
 * Schedule both morning and evening notifications
 */
export async function scheduleNotifications(): Promise<boolean> {
  try {
    // Request notification permissions first
    const hasNotificationPermission = await requestNotificationPermissions();
    if (!hasNotificationPermission) {
      console.warn('Notification permission denied');
      return false;
    }

    // Get device location
    const location = await getDeviceLocation();
    if (!location) {
      console.warn('Location unavailable, cannot schedule notifications');
      return false;
    }

    // Cancel existing notifications first
    await cancelAllNotifications();

    // Schedule new notifications
    await scheduleMorningNotification(location.latitude, location.longitude);
    await scheduleEveningNotification(location.latitude, location.longitude);

    return true;
  } catch (error) {
    console.error('Error scheduling notifications:', error);
    return false;
  }
}

/**
 * Cancel all scheduled notifications
 */
export async function cancelAllNotifications(): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(MORNING_NOTIFICATION_ID);
    await Notifications.cancelScheduledNotificationAsync(EVENING_NOTIFICATION_ID);
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
}

/**
 * Check if notifications are currently scheduled
 */
export async function areNotificationsScheduled(): Promise<boolean> {
  try {
    const scheduledNotifications = await Notifications.getAllScheduledNotificationsAsync();
    return (
      scheduledNotifications.some((n) => n.identifier === MORNING_NOTIFICATION_ID) &&
      scheduledNotifications.some((n) => n.identifier === EVENING_NOTIFICATION_ID)
    );
  } catch (error) {
    console.error('Error checking scheduled notifications:', error);
    return false;
  }
}

/**
 * Get current notification and location permission status
 */
export async function getPermissionStatus(): Promise<NotificationPermissions> {
  try {
    const notificationStatus = await Notifications.getPermissionsAsync();
    const locationStatus = await Location.getForegroundPermissionsAsync();

    return {
      notifications: notificationStatus.status === 'granted',
      location: locationStatus.status === 'granted',
    };
  } catch (error) {
    console.error('Error getting permission status:', error);
    return {
      notifications: false,
      location: false,
    };
  }
}
