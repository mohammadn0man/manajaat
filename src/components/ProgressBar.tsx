/**
 * ProgressBar component - extracted from DuaPager
 */

import React, { memo, useMemo } from 'react';
import { View, Text, Animated } from 'react-native';
import { useTheme } from '../contexts/ThemeProvider';
import { UI_CONSTANTS } from '../constants/ui';

interface ProgressBarProps {
  currentIndex: number;
  totalCount: number;
  progressAnim: Animated.Value;
}

const ProgressBar: React.FC<ProgressBarProps> = memo(
  ({ currentIndex, totalCount, progressAnim }) => {
    const { styles, colors } = useTheme();

    // Memoized progress bar container style
    const containerStyle = useMemo(
      () => ({
        paddingHorizontal: UI_CONSTANTS.PADDING.xxl,
        paddingVertical: UI_CONSTANTS.PADDING.lg,
        backgroundColor: colors.background,
      }),
      [colors.background]
    );

    // Memoized progress bar style
    const progressBarStyle = useMemo(
      () => ({
        height: UI_CONSTANTS.PROGRESS_BAR_HEIGHT,
        backgroundColor: colors.muted,
        borderRadius: UI_CONSTANTS.BORDER_RADIUS.small,
        marginTop: UI_CONSTANTS.SPACING.sm,
        overflow: 'hidden' as const,
      }),
      [colors.muted]
    );

    // Memoized progress bar fill style
    const progressBarFillStyle = useMemo(
      () => ({
        height: '100%' as const,
        backgroundColor: colors.primary,
        borderRadius: UI_CONSTANTS.BORDER_RADIUS.small,
        width: progressAnim.interpolate({
          inputRange: [0, 1],
          outputRange: ['0%', '100%'],
        }),
      }),
      [colors.primary, progressAnim]
    );

    // Memoized progress text
    const progressText = useMemo(
      () => ({
        current: currentIndex + 1,
        total: totalCount,
        percentage: Math.round(((currentIndex + 1) / totalCount) * 100),
      }),
      [currentIndex, totalCount]
    );

    return (
      <View style={containerStyle}>
        <View style={styles.rowBetween}>
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>
            {progressText.current} of {progressText.total}
          </Text>
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>
            {progressText.percentage}%
          </Text>
        </View>

        <View style={progressBarStyle}>
          <Animated.View
            style={progressBarFillStyle}
            accessibilityRole="progressbar"
            accessibilityValue={{
              min: 0,
              max: totalCount,
              now: currentIndex + 1,
            }}
          />
        </View>
      </View>
    );
  }
);

ProgressBar.displayName = 'ProgressBar';

export default ProgressBar;
