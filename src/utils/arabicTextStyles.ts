import { Platform, type TextStyle } from 'react-native';

/**
 * Extra styles for Arabic script in cards and lists.
 * Quranic fonts often draw glyphs outside the measured line box; horizontal
 * padding and disabled font padding on Android reduce edge clipping.
 */
export function getArabicTextStyle(
  fontSize: number,
  options?: { lineHeightMultiplier?: number }
): TextStyle {
  const multiplier = options?.lineHeightMultiplier ?? 2.2;
  return {
    textAlign: 'right',
    writingDirection: 'rtl',
    paddingHorizontal: Math.max(8, Math.round(fontSize * 0.18)),
    lineHeight: Math.round(fontSize * multiplier),
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  };
}
