import * as Font from 'expo-font';
import type { ArabicFont } from '../services/storageService';
import {
  Lato_400Regular,
  Lato_700Bold,
} from '@expo-google-fonts/lato';

// Font configuration - custom fonts bundled with the app for consistency
// Note: Using Amiri for both Arabic and Urdu (Amiri supports Urdu beautifully)
// Using Lato from @expo-google-fonts/lato for English (Sans-serif from Google Fonts)
export const fontConfig = {
  // Arabic/Urdu fonts (Amiri)
  'Amiri-Regular': require('../../assets/fonts/Amiri-Regular.ttf'),
  'Amiri-Bold': require('../../assets/fonts/Amiri-Bold.ttf'),
  Amiri: require('../../assets/fonts/Amiri-Regular.ttf'),
  // Jameel Noori Nastaleeq - using simpler name for Android compatibility
  'JameelNooriNastaleeqKasheeda': require('../../assets/fonts/Jameel-Noori-Nastaleeq-Kasheeda.ttf'),
  // Al Majeed Quranic - using simpler name for Android compatibility
  'AlMajeedQuranicRegular': require('../../assets/fonts/Al-Majeed-Quranic-Regular.ttf'),
  // Indopak Nastaleeq (Quranic font from Tarteel) - using simpler name for Android compatibility
  'IndopakNastaleeq': require('../../assets/fonts/Indopak-Nastaleeq.ttf'),
  // English/Latin fonts (Lato - Sans-serif from Google Fonts via @expo-google-fonts/lato)
  'Lato_400Regular': Lato_400Regular,
  'Lato_700Bold': Lato_700Bold,
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

// Font families - using Amiri for Arabic/Urdu, Lato for English
// Note: Using Amiri for Urdu as it supports Urdu script beautifully
// Using Lato (Sans-serif from Google Fonts) for English text
// Font family names must match the keys used in useFonts() in App.tsx
// Try "Lato" first (registered as alias), fallback to exact variant names if needed
export const fontFamilies = {
  arabic: 'Amiri-Regular',
  arabicBold: 'Amiri-Bold',
  urdu: 'Amiri-Regular', // Amiri works great for Urdu
  urduBold: 'Amiri-Bold',
  latin: 'Lato', // Lato Sans-serif for English (try base name first)
  latinMedium: 'Lato', // Lato doesn't have Medium, use Regular weight
  latinSemiBold: 'Lato', // Lato doesn't have SemiBold, use Regular weight
  latinBold: 'Lato', // Lato - use fontWeight: '700' for bold
} as const;

// Helper function to get Arabic font family name by key
export const getArabicFontFamily = (fontKey: ArabicFont): string => {
  const fontMap: Record<ArabicFont, string> = {
    amiri: 'Amiri-Regular',
    jameel: 'JameelNooriNastaleeqKasheeda',
    almajeed: 'AlMajeedQuranicRegular',
    indopak: 'IndopakNastaleeq',
  };
  return fontMap[fontKey];
};

export type FontFamily = keyof typeof fontFamilies;
