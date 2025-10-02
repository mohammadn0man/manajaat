import React, { memo, useMemo, useCallback } from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { UI_CONSTANTS } from '../constants/ui';
import { COLORS } from '../constants/colors';

type IconButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

const IconButton = memo(
  ({
    iconName,
    size = UI_CONSTANTS.ICON_SIZES.large,
    color = COLORS.LEGACY_PRIMARY,
    backgroundColor = 'transparent',
    style,
    accessibilityLabel,
    accessibilityHint,
    ...touchableProps
  }: IconButtonProps) => {
    // Memoized container style
    const containerStyle = useMemo(
      () => [styles.container, { backgroundColor }, style],
      [backgroundColor, style]
    );

    // Memoized press handler
    const handlePress = useCallback(
      (event: any) => {
        if (touchableProps.onPress) {
          touchableProps.onPress(event);
        }
      },
      [touchableProps]
    );

    return (
      <TouchableOpacity
        style={containerStyle}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        onPress={handlePress}
        {...touchableProps}
      >
        <Ionicons name={iconName} size={size} color={color} />
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: UI_CONSTANTS.PADDING.sm,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.small,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

IconButton.displayName = 'IconButton';

export default IconButton;
