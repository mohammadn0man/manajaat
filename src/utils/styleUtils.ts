/**
 * Style utility functions to eliminate duplicate code
 */

import { UI_CONSTANTS } from '../constants/ui';

export interface DynamicPadding {
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginHorizontal?: number;
  marginVertical?: number;
}

/**
 * Get dynamic padding based on font size
 * Centralized logic to prevent duplication across components
 */
export const getDynamicPadding = (fontSize: number): DynamicPadding => {
  if (fontSize >= 24) {
    // Large font size
    return {
      paddingHorizontal: UI_CONSTANTS.PADDING.xl,
      paddingVertical: 50, // Increased for Arabic characters
      marginHorizontal: UI_CONSTANTS.SPACING.xs,
      marginVertical: UI_CONSTANTS.SPACING.xs,
    };
  } else if (fontSize >= 20) {
    // Normal font size
    return {
      paddingHorizontal: UI_CONSTANTS.PADDING.lg,
      paddingVertical: UI_CONSTANTS.PADDING.xxl,
      marginHorizontal: UI_CONSTANTS.SPACING.xs,
      marginVertical: UI_CONSTANTS.SPACING.xs,
    };
  }
  return {
    paddingVertical: UI_CONSTANTS.PADDING.lg, // Add some padding even for small font size
  };
};

/**
 * Get responsive font size based on base font size
 */
export const getResponsiveFontSize = (
  baseFontSize: number,
  multiplier: number
): number => {
  return Math.round(baseFontSize * multiplier);
};

/**
 * Get responsive line height for Arabic text
 */
export const getArabicLineHeight = (
  fontSize: number,
  multiplier: number = UI_CONSTANTS.LINE_HEIGHT_MULTIPLIERS.arabic
): number => {
  return Math.round(fontSize * multiplier);
};
