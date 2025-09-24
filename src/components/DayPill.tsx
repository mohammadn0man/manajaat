import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { DayOfWeek } from '../types/dua';
import { getDayDisplayName } from '../services/duaService';

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
  
  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={() => onPress(day)}
      accessibilityRole="button"
      accessibilityLabel={`${dayName}${count ? `, ${count} duas` : ''}`}
      accessibilityHint={`View duas for ${dayName}`}
    >
      <Text style={[
        styles.text,
        isSelected && styles.selectedText,
      ]}>
        {dayName}
      </Text>
      {count !== undefined && (
        <Text style={[
          styles.count,
          isSelected && styles.selectedCount,
        ]}>
          {count}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginHorizontal: 4,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
  },
  selectedContainer: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  selectedText: {
    color: 'white',
  },
  count: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 2,
  },
  selectedCount: {
    color: '#c7d2fe',
  },
});

export default DayPill;