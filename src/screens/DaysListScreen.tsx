import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { DayOfWeek } from '../types/dua';
import {
  getAllDays,
  getDayDisplayName,
  getDuasByDay,
} from '../services/duaService';
import TopBar from '../components/TopBar';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../contexts/ThemeProvider';

interface DayItemProps {
  day: DayOfWeek;
}

const DayItem: React.FC<DayItemProps> = ({ day }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { styles } = useTheme();
  const dayDuas = getDuasByDay(day);
  const dayDisplayName = getDayDisplayName(day);

  const handlePress = () => {
    navigation.navigate('DayView', { day });
  };

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={handlePress}
      accessibilityRole="button"
      accessibilityLabel={`${dayDisplayName}, ${dayDuas.length} duas available`}
      accessibilityHint="View duas for this day"
    >
      <View style={styles.rowBetween}>
        <View style={styles.column}>
          <Text style={styles.h4}>{dayDisplayName}</Text>
          <Text
            style={[
              styles.textMuted,
              styles.globalStyles.spacingUtils.mt('xs'),
            ]}
          >
            {dayDuas.length} duas available
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
  );
};

const DaysListScreen: React.FC = () => {
  const { styles } = useTheme();
  const allDays = getAllDays();

  return (
    <View style={styles.container}>
      <TopBar title="All Days" subtitle="Browse duas by day of the week" />

      <View style={styles.content}>
        <FlatList
          data={allDays}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <DayItem day={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.globalStyles.spacingUtils.py('lg'),
            { paddingBottom: 110 },
          ]}
        />
      </View>
    </View>
  );
};

export default DaysListScreen;
