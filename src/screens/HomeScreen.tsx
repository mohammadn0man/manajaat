import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Dua } from '../types/dua';
import { getTodayDuas, getTodayDayName, getDayDisplayName } from '../services/duaService';

interface DuaItemProps {
  dua: Dua;
}

const DuaItem: React.FC<DuaItemProps> = ({ dua }) => {
  return (
    <View style={styles.duaItem}>
      <Text style={styles.arabicText}>
        {dua.arabic}
      </Text>
      {dua.translations.ur && (
        <Text style={styles.translationText}>
          {dua.translations.ur}
        </Text>
      )}
      {dua.reference && (
        <Text style={styles.referenceText}>
          {dua.reference}
        </Text>
      )}
    </View>
  );
};

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const todayDuas = getTodayDuas();
  const todayDayName = getTodayDayName();
  const todayDisplayName = getDayDisplayName(todayDayName);

  const handleDayPress = () => {
    navigation.navigate('DayView', { day: todayDayName });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Read today's duas
        </Text>
        <TouchableOpacity onPress={handleDayPress}>
          <Text style={styles.headerSubtitle}>
            {todayDisplayName}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {todayDuas.length > 0 ? (
          <FlatList
            data={todayDuas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <DuaItem dua={item} />}
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
  header: {
    backgroundColor: '#4F46E5',
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    color: '#c7d2fe',
    fontSize: 18,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
  },
  listContent: {
    paddingBottom: 20,
  },
  duaItem: {
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
  arabicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'right',
  },
  translationText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
  },
  referenceText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
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
