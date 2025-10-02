import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type IconButtonProps = React.ComponentProps<typeof TouchableOpacity> & {
  iconName: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
  backgroundColor?: string;
  style?: ViewStyle;
  accessibilityLabel: string;
  accessibilityHint?: string;
};

const IconButton = ({
  iconName,
  size = 24,
  color = '#4F46E5',
  backgroundColor = 'transparent',
  style,
  accessibilityLabel,
  accessibilityHint,
  ...touchableProps
}: IconButtonProps) => (
  <TouchableOpacity
    style={[styles.container, { backgroundColor }, style]}
    accessibilityRole="button"
    accessibilityLabel={accessibilityLabel}
    accessibilityHint={accessibilityHint}
    {...touchableProps}
  >
    <Ionicons name={iconName} size={size} color={color} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
