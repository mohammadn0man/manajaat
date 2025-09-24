import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { Dua, DayOfWeek } from '../types/dua';
import { getDuasByDay, getDayDisplayName } from '../services/duaService';

interface DuaItemProps {
  dua: Dua;
}

const DuaItem: React.FC<DuaItemProps> = ({ dua }) => {
  return (
    <View className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-100">
      <Text className="text-xl font-bold text-gray-900 mb-2 text-right" style={{ fontFamily: 'System' }}>
        {dua.arabic}
      </Text>
      {dua.translations.ur && (
        <Text className="text-base text-gray-700 mb-2">
          {dua.translations.ur}
        </Text>
      )}
      {dua.reference && (
        <Text className="text-sm text-gray-500 italic">
          {dua.reference}
        </Text>
      )}
    </View>
  );
};

type RootStackParamList = {
  DayView: { day: DayOfWeek };
};

type DayViewScreenRouteProp = RouteProp<RootStackParamList, 'DayView'>;

interface DayViewScreenProps {
  route: DayViewScreenRouteProp;
}

const DayViewScreen: React.FC<DayViewScreenProps> = ({ route }) => {
  const { day } = route.params;
  const dayDuas = getDuasByDay(day);
  const dayDisplayName = getDayDisplayName(day);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-indigo-600 pt-12 pb-6 px-6">
        <Text className="text-2xl font-bold text-white mb-2">
          {dayDisplayName} Duas
        </Text>
        <Text className="text-indigo-200 text-base">
          {dayDuas.length} duas available
        </Text>
      </View>

      {/* Content */}
      <View className="flex-1 px-6 pt-6">
        {dayDuas.length > 0 ? (
          <FlatList
            data={dayDuas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <DuaItem dua={item} />}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text className="text-gray-500 text-lg">
              No duas available for {dayDisplayName}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default DayViewScreen;
