import React, { memo, useMemo, useCallback } from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DayOfWeek } from '../types/dua';
import { getDayDisplayName } from '../services/duaService';
import { UI_CONSTANTS } from '../constants/ui';
import { COLORS } from '../constants/colors';

interface DayPillProps {
  day: DayOfWeek;
  isSelected?: boolean;
  onPress: (day: DayOfWeek) => void;
  count?: number;
}

const DayPill: React.FC<DayPillProps> = memo(
  ({ day, isSelected = false, onPress, count }) => {
    // Memoized day name
    const dayName = useMemo(() => getDayDisplayName(day), [day]);

    // Memoized container style
    const containerStyle = useMemo(
      () => [styles.container, isSelected && styles.selectedContainer],
      [isSelected]
    );

    // Memoized text style
    const textStyle = useMemo(
      () => [styles.text, isSelected && styles.selectedText],
      [isSelected]
    );

    // Memoized count style
    const countStyle = useMemo(
      () => [styles.count, isSelected && styles.selectedCount],
      [isSelected]
    );

    // Memoized press handler
    const handlePress = useCallback(() => {
      onPress(day);
    }, [onPress, day]);

    // Memoized accessibility label
    const accessibilityLabel = useMemo(() => {
      return `${dayName}${count ? `, ${count} duas` : ''}`;
    }, [dayName, count]);

    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={`View duas for ${dayName}`}
      >
        <Text style={textStyle}>{dayName}</Text>
        {count !== undefined && <Text style={countStyle}>{count}</Text>}
      </TouchableOpacity>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.BACKGROUND,
    paddingHorizontal: UI_CONSTANTS.PADDING.lg,
    paddingVertical: UI_CONSTANTS.PADDING.sm,
    borderRadius: UI_CONSTANTS.BORDER_RADIUS.round,
    marginHorizontal: UI_CONSTANTS.SPACING.xs,
    marginVertical: UI_CONSTANTS.SPACING.xs,
    borderWidth: UI_CONSTANTS.CARD_BORDER_WIDTH,
    borderColor: COLORS.LEGACY_BORDER,
    alignItems: 'center',
  },
  selectedContainer: {
    backgroundColor: COLORS.LEGACY_PRIMARY,
    borderColor: COLORS.LEGACY_PRIMARY,
  },
  text: {
    fontSize: UI_CONSTANTS.FONT_SIZE_MULTIPLIERS.caption * 20, // 14px
    fontWeight: '500',
    color: COLORS.FOREGROUND,
  },
  selectedText: {
    color: COLORS.PRIMARY_FOREGROUND,
  },
  count: {
    fontSize: UI_CONSTANTS.FONT_SIZE_MULTIPLIERS.small * 20, // 12px
    color: COLORS.LEGACY_GRAY,
    marginTop: UI_CONSTANTS.SPACING.xs,
  },
  selectedCount: {
    color: COLORS.LEGACY_LIGHT_GRAY,
  },
});

DayPill.displayName = 'DayPill';

export default DayPill;
