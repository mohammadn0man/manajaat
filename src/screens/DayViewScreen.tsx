import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { RouteProp, useNavigation, NavigationProp } from '@react-navigation/native';
import { Dua } from '../types/dua';
import { getDuasByDay, getDayDisplayName } from '../services/duaService';
import TopBar from '../components/TopBar';
import DuaCard from '../components/DuaCard';

import { RootStackParamList } from '../navigation/types';

type DayViewScreenRouteProp = RouteProp<RootStackParamList, 'DayView'>;

interface DayViewScreenProps {
  route: DayViewScreenRouteProp;
}

const DayViewScreen: React.FC<DayViewScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { day } = route.params;
  const dayDuas = getDuasByDay(day);
  const dayDisplayName = getDayDisplayName(day);


  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('DuaDetail', { duaId: dua.id });
  };

  return (
    <View style={styles.container}>
      <TopBar
        showBackButton
        onBackPress={() => navigation.goBack()}
        title={`${dayDisplayName} Duas`}
        subtitle={`${dayDuas.length} duas available`}
      />

      <View style={styles.content}>
        {dayDuas.length > 0 ? (
          <FlatList
            data={dayDuas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DuaCard
                dua={item}
                onPress={handleDuaPress}
                showReference={true}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No duas available for {dayDisplayName}
            </Text>
          </View>
        )}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#6b7280',
    fontSize: 18,
  },
});

export default DayViewScreen;
