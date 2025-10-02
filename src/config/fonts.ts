import * as Font from 'expo-font';
import { Platform } from 'react-native';

// Font configuration with system fallbacks
export const fontConfig = {
  // We'll use system fonts for now, but this structure allows for custom fonts
  'Amiri-Regular': require('../../assets/fonts/Amiri-Regular.ttf'),
  'Amiri-Bold': require('../../assets/fonts/Amiri-Bold.ttf'),
  // Alternative names for Android compatibility
  Amiri: require('../../assets/fonts/Amiri-Regular.ttf'),
  // 'NotoNastaliqUrdu': require('../../assets/fonts/NotoNastaliqUrdu-Regular.ttf'),
  // 'Inter': require('../../assets/fonts/Inter-Regular.ttf'),
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

// Font families with system fallbacks
export const fontFamilies = {
  arabic: Platform.select({
    ios: 'Amiri-Regular',
    android: 'Amiri-Regular', // Use full name for Android too
    default: 'System', // Fallback to system font
  }),
  arabicBold: Platform.select({
    ios: 'Amiri-Bold',
    android: 'Amiri-Bold',
    default: 'System',
  }),
  urdu: Platform.select({
    ios: 'NotoNastaliqUrdu-Regular',
    android: 'NotoNastaliqUrdu-Regular',
    default: 'System',
  }),
  urduBold: Platform.select({
    ios: 'NotoNastaliqUrdu-Bold',
    android: 'NotoNastaliqUrdu-Bold',
    default: 'System',
  }),
  latin: Platform.select({
    ios: 'Inter-Regular',
    android: 'Inter-Regular',
    default: 'System',
  }),
  latinMedium: Platform.select({
    ios: 'Inter-Medium',
    android: 'Inter-Medium',
    default: 'System',
  }),
  latinSemiBold: Platform.select({
    ios: 'Inter-SemiBold',
    android: 'Inter-SemiBold',
    default: 'System',
  }),
  latinBold: Platform.select({
    ios: 'Inter-Bold',
    android: 'Inter-Bold',
    default: 'System',
  }),
} as const;

export type FontFamily = keyof typeof fontFamilies;
