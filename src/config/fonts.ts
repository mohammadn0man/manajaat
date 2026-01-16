import * as Font from 'expo-font';
import { Platform } from 'react-native';

// Font configuration - custom fonts bundled with the app for consistency
// Note: Using Amiri for both Arabic and Urdu (Amiri supports Urdu beautifully)
// System fonts used for English until we can troubleshoot Inter fonts
export const fontConfig = {
  // Arabic/Urdu fonts (Amiri)
  'Amiri-Regular': require('../../assets/fonts/Amiri-Regular.ttf'),
  'Amiri-Bold': require('../../assets/fonts/Amiri-Bold.ttf'),
  Amiri: require('../../assets/fonts/Amiri-Regular.ttf'),
};

export const loadFonts = async (): Promise<void> => {
  try {
    // Load custom fonts when available
    if (Object.keys(fontConfig).length > 0) {
      await Font.loadAsync(fontConfig);
    }
  } catch (error) {
    console.error('Error loading fonts:', error);
  }
};

// Font families - using Amiri for Arabic/Urdu, System fonts for English
// Note: Using Amiri for Urdu as it supports Urdu script beautifully
// Using System fonts for English until we can troubleshoot Inter fonts
export const fontFamilies = {
  arabic: 'Amiri-Regular',
  arabicBold: 'Amiri-Bold',
  urdu: 'Amiri-Regular', // Amiri works great for Urdu
  urduBold: 'Amiri-Bold',
  latin: 'System', // System font for now
  latinMedium: 'System',
  latinSemiBold: 'System',
  latinBold: 'System',
} as const;

export type FontFamily = keyof typeof fontFamilies;
