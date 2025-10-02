/**
 * NavigationButtons component - extracted from DuaPager
 */

import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import { UI_CONSTANTS } from '../constants/ui';

interface NavigationButtonsProps {
  isFirst: boolean;
  isLast: boolean;
  isOnlyOne: boolean;
  isAnimating: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onComplete: () => void;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = memo(
  ({
    isFirst,
    isLast,
    isOnlyOne,
    isAnimating,
    onPrevious,
    onNext,
    onComplete,
  }) => {
    const { styles, colors } = useTheme();
    const { isRTL } = useApp();

    // Memoized navigation container style
    const navigationContainerStyle = useMemo(
      () => ({
        flexDirection: (isRTL ? 'row-reverse' : 'row') as 'row' | 'row-reverse',
        justifyContent: 'space-between' as const,
        alignItems: 'center' as const,
        paddingHorizontal: UI_CONSTANTS.PADDING.xxl,
        paddingVertical: UI_CONSTANTS.PADDING.xl,
        backgroundColor: colors.background,
      }),
      [isRTL, colors.background]
    );

    // Memoized single button container style
    const singleButtonContainerStyle = useMemo(
      () => ({
        paddingHorizontal: UI_CONSTANTS.PADDING.xxl,
        paddingVertical: UI_CONSTANTS.PADDING.xl,
        backgroundColor: colors.background,
      }),
      [colors.background]
    );

    // Memoized previous button style
    const previousButtonStyle = useMemo(
      () => [
        styles.button,
        {
          backgroundColor: isFirst ? colors.muted : colors.primary,
          paddingHorizontal: UI_CONSTANTS.PADDING.xl,
          paddingVertical: UI_CONSTANTS.PADDING.md,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.large,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          opacity: isFirst ? 0.5 : 1,
        },
      ],
      [isFirst, isRTL, colors.muted, colors.primary, styles.button]
    );

    // Memoized next button style
    const nextButtonStyle = useMemo(
      () => [
        styles.button,
        {
          backgroundColor: isLast ? UI_CONSTANTS.SUCCESS_COLOR : colors.primary,
          paddingHorizontal: UI_CONSTANTS.PADDING.xl,
          paddingVertical: UI_CONSTANTS.PADDING.md,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.large,
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
        },
      ],
      [isLast, isRTL, colors.primary, styles.button]
    );

    // Memoized single button style
    const singleButtonStyle = useMemo(
      () => [
        styles.button,
        {
          backgroundColor: UI_CONSTANTS.SUCCESS_COLOR,
          paddingVertical: UI_CONSTANTS.PADDING.lg,
          borderRadius: UI_CONSTANTS.BORDER_RADIUS.large,
          alignItems: 'center',
        },
      ],
      [styles.button]
    );

    // Memoized button text styles
    const buttonTextStyle = useMemo(
      () => [
        styles.body,
        {
          color: 'white',
          marginLeft: isRTL ? 0 : UI_CONSTANTS.SPACING.sm,
          marginRight: isRTL ? UI_CONSTANTS.SPACING.sm : 0,
          fontWeight: '600',
        },
      ],
      [isRTL, styles.body]
    );

    const previousButtonTextStyle = useMemo(
      () => [
        styles.body,
        {
          color: isFirst ? colors.mutedForeground : colors.primaryForeground,
          marginLeft: isRTL ? 0 : UI_CONSTANTS.SPACING.sm,
          marginRight: isRTL ? UI_CONSTANTS.SPACING.sm : 0,
          fontWeight: '600',
        },
      ],
      [
        isFirst,
        isRTL,
        colors.mutedForeground,
        colors.primaryForeground,
        styles.body,
      ]
    );

    // Memoized press handlers
    const handlePrevious = useCallback(() => {
      if (!isFirst && !isAnimating) {
        onPrevious();
      }
    }, [isFirst, isAnimating, onPrevious]);

    const handleNext = useCallback(() => {
      if (!isLast && !isAnimating) {
        onNext();
      }
    }, [isLast, isAnimating, onNext]);

    const handleComplete = useCallback(() => {
      if (!isAnimating) {
        onComplete();
      }
    }, [isAnimating, onComplete]);

    if (isOnlyOne) {
      return (
        <View style={singleButtonContainerStyle}>
          <TouchableOpacity
            style={singleButtonStyle}
            onPress={handleComplete}
            disabled={isAnimating}
            accessibilityRole="button"
            accessibilityLabel="I am done"
            accessibilityHint="Complete today's session"
          >
            <Text style={buttonTextStyle}>I'm done</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={navigationContainerStyle}>
        {/* Previous Button */}
        <TouchableOpacity
          style={previousButtonStyle}
          onPress={handlePrevious}
          disabled={isFirst || isAnimating}
          accessibilityRole="button"
          accessibilityLabel="Previous dua"
          accessibilityHint="Go to previous dua"
        >
          <Ionicons
            name={isRTL ? 'chevron-forward' : 'chevron-back'}
            size={UI_CONSTANTS.ICON_SIZES.medium}
            color={isFirst ? colors.mutedForeground : colors.primaryForeground}
          />
          <Text style={previousButtonTextStyle}>Previous</Text>
        </TouchableOpacity>

        {/* Next/Complete Button */}
        <TouchableOpacity
          style={nextButtonStyle}
          onPress={isLast ? handleComplete : handleNext}
          disabled={isAnimating}
          accessibilityRole="button"
          accessibilityLabel={isLast ? 'I am done' : 'Next dua'}
          accessibilityHint={
            isLast ? "Complete today's session" : 'Go to next dua'
          }
        >
          <Text style={buttonTextStyle}>{isLast ? "I'm done" : 'Next'}</Text>
          {!isLast && (
            <Ionicons
              name={isRTL ? 'chevron-back' : 'chevron-forward'}
              size={UI_CONSTANTS.ICON_SIZES.medium}
              color="white"
            />
          )}
        </TouchableOpacity>
      </View>
    );
  }
);

NavigationButtons.displayName = 'NavigationButtons';

export default NavigationButtons;
