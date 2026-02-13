import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DayOfWeek } from '../types/dua';
import { getDayDisplayName } from '../services/duaService';
import { useTheme } from '../contexts/ThemeProvider';

interface DayPillProps {
  day: DayOfWeek;
  isSelected?: boolean;
  onPress: (day: DayOfWeek) => void;
  count?: number;
}

const DayPill: React.FC<DayPillProps> = ({
  day,
  isSelected = false,
  onPress,
  count,
}) => {
  const dayName = getDayDisplayName(day);
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          borderColor: colors.border,
          backgroundColor: colors.card,
        },
        isSelected && {
          backgroundColor: colors.primary,
          borderColor: colors.primary,
        },
      ]}
      onPress={() => onPress(day)}
      accessibilityRole="button"
      accessibilityLabel={`${dayName}${count ? `, ${count} duas` : ''}`}
      accessibilityHint={`View duas for ${dayName}`}
    >
      <Text
        style={[
          styles.text,
          { color: colors.foreground },
          isSelected && { color: colors.primaryForeground },
        ]}
      >
        {dayName}
      </Text>
      {count !== undefined && (
        <Text
          style={[
            styles.count,
            { color: colors.mutedForeground },
            isSelected && { color: 'rgba(255,255,255,0.9)' },
          ]}
        >
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  count: {
    fontSize: 12,
    marginTop: 2,
  },
});

export default DayPill;
