import React, { memo, useMemo, useCallback } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeProvider';
import { UI_CONSTANTS } from '../constants/ui';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = memo(
  ({
    title,
    subtitle,
    onBackPress,
    showBackButton = false,
    rightComponent,
  }) => {
    const { colors, styles } = useTheme();

    // Memoized container style
    const containerStyle = useMemo(
      () => [
        styles.rowBetween,
        {
          backgroundColor: colors.primary,
          paddingTop: UI_CONSTANTS.STATUS_BAR_HEIGHT,
          paddingBottom: UI_CONSTANTS.PADDING.xxl,
          paddingHorizontal: UI_CONSTANTS.PADDING.xxl,
        },
      ],
      [styles.rowBetween, colors.primary]
    );

    // Memoized back button style
    const backButtonStyle = useMemo(
      () => ({
        width: 40,
        alignItems: 'flex-start' as const,
      }),
      []
    );

    // Memoized center container style
    const centerContainerStyle = useMemo(
      () => styles.columnCenter,
      [styles.columnCenter]
    );

    // Memoized right container style
    const rightContainerStyle = useMemo(
      () => ({
        width: 40,
        alignItems: 'flex-end' as const,
      }),
      []
    );

    // Memoized title style
    const titleStyle = useMemo(
      () => [
        styles.h3,
        { color: colors.primaryForeground, textAlign: 'center' as const },
      ],
      [styles.h3, colors.primaryForeground]
    );

    // Memoized subtitle style
    const subtitleStyle = useMemo(
      () => [
        styles.body,
        {
          color: colors.primaryForeground,
          textAlign: 'center' as const,
          marginTop: UI_CONSTANTS.SPACING.xs,
        },
      ],
      [styles.body, colors.primaryForeground]
    );

    // Memoized back button press handler
    const handleBackPress = useCallback(() => {
      if (onBackPress) {
        onBackPress();
      }
    }, [onBackPress]);

    return (
      <View style={containerStyle}>
        <View style={backButtonStyle}>
          {showBackButton && (
            <TouchableOpacity
              style={{ padding: UI_CONSTANTS.SPACING.xs }}
              onPress={handleBackPress}
              accessibilityRole="button"
              accessibilityLabel="Go back"
              accessibilityHint="Navigate back to previous screen"
            >
              <Ionicons
                name="arrow-back"
                size={UI_CONSTANTS.ICON_SIZES.large}
                color={colors.primaryForeground}
              />
            </TouchableOpacity>
          )}
        </View>

        <View style={centerContainerStyle}>
          <Text style={titleStyle}>{title}</Text>
          {subtitle && <Text style={subtitleStyle}>{subtitle}</Text>}
        </View>

        <View style={rightContainerStyle}>{rightComponent}</View>
      </View>
    );
  }
);

TopBar.displayName = 'TopBar';

export default TopBar;
