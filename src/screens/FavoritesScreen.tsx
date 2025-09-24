import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../contexts/AppContext';
import { getDuasData } from '../services/dataLoader';
import { Dua } from '../types/dua';
import { RootStackParamList } from '../navigation/types';
import TopBar from '../components/TopBar';
import DuaCard from '../components/DuaCard';
import IconButton from '../components/IconButton';

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { favorites, toggleFavorite, clearFavorites } = useApp();

  // Get all duas and filter favorites
  const favoriteDuas = useMemo(() => {
    const allDuas = getDuasData();
    return allDuas.filter(dua => favorites.includes(dua.id));
  }, [favorites]);

  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('DuaDetail', { duaId: dua.id });
  };

  const handleRemoveFavorite = (duaId: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this dua from your favorites?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            await toggleFavorite(duaId);
          },
        },
      ]
    );
  };

  const renderDuaItem = ({ item }: { item: Dua }) => (
    <View style={styles.duaItemContainer}>
      <DuaCard
        dua={item}
        onPress={handleDuaPress}
        showReference={true}
        compact={true}
      />
      <IconButton
        iconName="heart"
        onPress={() => handleRemoveFavorite(item.id)}
        color="#EF4444"
        style={styles.removeButton}
        accessibilityLabel="Remove from favorites"
        accessibilityHint="Removes this dua from your favorites list"
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar
        title="Favorites"
        subtitle={`${favoriteDuas.length} favorite duas`}
        rightComponent={
          favoriteDuas.length > 0 ? (
            <IconButton
              iconName="trash-outline"
              onPress={() => {
                Alert.alert(
                  'Clear All Favorites',
                  'Are you sure you want to remove all duas from your favorites?',
                  [
                    {
                      text: 'Cancel',
                      style: 'cancel',
                    },
                    {
                      text: 'Clear All',
                      style: 'destructive',
                      onPress: async () => {
                        // Clear all favorites
                        await clearFavorites();
                      },
                    },
                  ]
                );
              }}
              color="#EF4444"
              accessibilityLabel="Clear all favorites"
              accessibilityHint="Removes all duas from your favorites list"
            />
          ) : undefined
        }
      />

      <View style={styles.content}>
        {favoriteDuas.length > 0 ? (
          <FlatList
            data={favoriteDuas}
            keyExtractor={(item) => item.id}
            renderItem={renderDuaItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="heart-outline" size={64} color="#9CA3AF" />
            <Text style={styles.emptyTitle}>No Favorites Yet</Text>
            <Text style={styles.emptySubtitle}>
              Tap the heart icon on any dua to add it to your favorites
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
  duaItemContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  removeButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 6,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default FavoritesScreen;
