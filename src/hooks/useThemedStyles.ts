/**
 * Custom hook for memoized themed styles
 * Prevents unnecessary style recalculations
 */

import { useMemo } from 'react';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import { UI_CONSTANTS } from '../constants/ui';
import { getDynamicPadding } from '../utils/styleUtils';

export const useThemedStyles = () => {
  const { colors } = useTheme();
  const { getFontSizeValue, isRTL } = useApp();

  // Memoized dynamic padding
  const dynamicPadding = useMemo(() => {
    const fontSize = getFontSizeValue();
    return getDynamicPadding(fontSize);
  }, [getFontSizeValue]);

  // Memoized RTL-aware styles
  const rtlStyles = useMemo(
    () => ({
      flexDirection: isRTL ? 'row-reverse' : 'row',
      textAlign: isRTL ? 'right' : 'left',
    }),
    [isRTL]
  );

  // Memoized button styles
  const buttonStyles = useMemo(
    () => ({
      primary: {
        backgroundColor: colors.primary,
        color: colors.primaryForeground,
      },
      secondary: {
        backgroundColor: colors.secondary,
        color: colors.secondaryForeground,
      },
      success: {
        backgroundColor: UI_CONSTANTS.SUCCESS_COLOR,
        color: 'white',
      },
      muted: {
        backgroundColor: colors.muted,
        color: colors.mutedForeground,
      },
    }),
    [colors]
  );

  // Memoized card styles
  const cardStyles = useMemo(
    () => ({
      container: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: UI_CONSTANTS.CARD_BORDER_WIDTH,
        borderRadius: UI_CONSTANTS.BORDER_RADIUS.large,
      },
      compact: {
        backgroundColor: colors.card,
        borderColor: colors.border,
        borderWidth: UI_CONSTANTS.CARD_BORDER_WIDTH,
        borderRadius: UI_CONSTANTS.BORDER_RADIUS.medium,
      },
    }),
    [colors]
  );

  return {
    dynamicPadding,
    rtlStyles,
    buttonStyles,
    cardStyles,
  };
};
