import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Dua } from '../types/dua';
import { getTodayDuas, getTodayDayName, getDayDisplayName } from '../services/duaService';
import TopBar from '../components/TopBar';
import DuaCard from '../components/DuaCard';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const todayDuas = getTodayDuas();
  const todayDayName = getTodayDayName();
  const todayDisplayName = getDayDisplayName(todayDayName);

  const handleDayPress = () => {
    navigation.navigate('DayView', { day: todayDayName });
  };

  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('DuaDetail', { duaId: dua.id });
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="Read today's duas"
        subtitle={todayDisplayName}
        onBackPress={handleDayPress}
        showBackButton={false}
      />

      <View style={styles.content}>
        {todayDuas.length > 0 ? (
          <FlatList
            data={todayDuas}
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
              No duas available for today
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

export default HomeScreen;
