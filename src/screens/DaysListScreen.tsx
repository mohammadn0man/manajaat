import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { DayOfWeek } from '../types/dua';
import { getAllDays, getDayDisplayName, getDuasByDay } from '../services/duaService';
import TopBar from '../components/TopBar';
import { RootStackParamList } from '../navigation/types';

interface DayItemProps {
  day: DayOfWeek;
}

const DayItem: React.FC<DayItemProps> = ({ day }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const dayDuas = getDuasByDay(day);
  const dayDisplayName = getDayDisplayName(day);

  const handlePress = () => {
    navigation.navigate('DayView', { day });
  };

  return (
    <TouchableOpacity
      style={styles.dayItem}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${dayDisplayName}, ${dayDuas.length} duas available`}
      accessibilityHint="View duas for this day"
    >
      <View style={styles.dayItemContent}>
        <View style={styles.dayItemText}>
          <Text style={styles.dayItemTitle}>
            {dayDisplayName}
          </Text>
          <Text style={styles.dayItemSubtitle}>
            {dayDuas.length} duas available
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const DaysListScreen: React.FC = () => {
  const allDays = getAllDays();

  return (
    <View style={styles.container}>
      <TopBar
        title="All Days"
        subtitle="Browse duas by day of the week"
      />

      <View style={styles.content}>
        <FlatList
          data={allDays}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <DayItem day={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  dayItem: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  dayItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayItemText: {
    flex: 1,
  },
  dayItemTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  dayItemSubtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default DaysListScreen;
