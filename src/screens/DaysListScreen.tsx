import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { DayOfWeek } from '../types/dua';
import { getAllDays, getDayDisplayName, getDuasByDay } from '../services/duaService';

interface DayItemProps {
  day: DayOfWeek;
}

const DayItem: React.FC<DayItemProps> = ({ day }) => {
  const navigation = useNavigation();
  const dayDuas = getDuasByDay(day);
  const dayDisplayName = getDayDisplayName(day);

  const handlePress = () => {
    navigation.navigate('DayView', { day });
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100"
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 mb-1">
            {dayDisplayName}
          </Text>
          <Text className="text-sm text-gray-500">
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
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-indigo-600 pt-12 pb-6 px-6">
        <Text className="text-2xl font-bold text-white mb-2">
          All Days
        </Text>
        <Text className="text-indigo-200 text-base">
          Browse duas by day of the week
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6">
        <FlatList
          data={allDays}
          keyExtractor={(item) => item}
          renderItem={({ item }) => <DayItem day={item} />}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </View>
  );
};

export default DaysListScreen;
