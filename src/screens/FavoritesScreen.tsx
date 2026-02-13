import React, { useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Animated,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useApp } from '../contexts/AppContext';
import { getDuasData } from '../services/dataLoader';
import { Dua } from '../types/dua';
import { RootStackParamList } from '../navigation/types';
import TopBar from '../components/TopBar';
import EmptyState from '../components/common/EmptyState';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp as useAppContext } from '../contexts/AppContext';
import { globalStyles } from '../styles/globalStyles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const NUM_COLUMNS = 2;
const CARD_WIDTH = (SCREEN_WIDTH - 32 - CARD_GAP * (NUM_COLUMNS - 1)) / NUM_COLUMNS;

interface FavoriteCardProps {
  item: Dua;
  index: number;
  onPress: (dua: Dua) => void;
  onRemove: (duaId: string) => void;
}

const FavoriteCard: React.FC<FavoriteCardProps> = ({
  item,
  index,
  onPress,
  onRemove,
}) => {
  const { colors } = useTheme();
  const { getFontSizeValue, getArabicFontFamily } = useAppContext();
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 280,
      delay: index * 40,
      useNativeDriver: true,
    }).start();
  }, [index, animValue]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress(item);
  };

  const handleRemovePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onRemove(item.id);
  };

  return (
    <Animated.View
      style={{
        width: CARD_WIDTH,
        marginBottom: CARD_GAP,
        opacity: animValue,
        transform: [
          {
            scale: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [0.92, 1],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={localStyles.gridCard}
        onPress={handlePress}
        activeOpacity={0.85}
        accessibilityRole="button"
        accessibilityLabel={`Dua: ${item.arabic.substring(0, 30)}...`}
      >
        <TouchableOpacity
          style={localStyles.heartBadge}
          onPress={handleRemovePress}
          accessibilityLabel="Remove from favorites"
        >
          <Ionicons name="heart" size={18} color={colors.accent} />
        </TouchableOpacity>
        <Text
          numberOfLines={3}
            style={[
              localStyles.arabicPreview,
              {
                fontFamily: getArabicFontFamily(),
                fontSize: Math.min(16, getFontSizeValue() * 0.8),
                lineHeight: Math.min(28, getFontSizeValue() * 1.4),
              },
            ]}
        >
          {item.arabic}
        </Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  gridCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    minHeight: 120,
    ...globalStyles.shadows.sm,
  },
  heartBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 1,
    padding: 4,
  },
  arabicPreview: {
    color: '#2C3E50',
    textAlign: 'right',
    marginTop: 8,
    paddingBottom: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  clearButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
});

const FavoritesScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { favorites, toggleFavorite, clearFavorites } = useApp();
  const { styles, colors } = useTheme();

  const favoriteDuas = useMemo(() => {
    const allDuas = getDuasData();
    return allDuas.filter((dua) => favorites.includes(dua.id));
  }, [favorites]);

  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('DuaDetail', { duaId: dua.id });
  };

  const handleRemoveFavorite = (duaId: string) => {
    Alert.alert(
      'Remove from Favorites',
      'Are you sure you want to remove this dua from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => await toggleFavorite(duaId),
        },
      ]
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all duas from your favorites?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => await clearFavorites(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="Favorites"
        subtitle={
          favoriteDuas.length > 0
            ? `Option to clear all favorites`
            : undefined
        }
        rightComponent={
          favoriteDuas.length > 0 ? (
            <TouchableOpacity
              onPress={handleClearAll}
              style={localStyles.clearButton}
              accessibilityLabel="Clear all favorites"
            >
              <Text style={[styles.body, { color: colors.accent, fontWeight: '600' }]}>
                Clear
              </Text>
            </TouchableOpacity>
          ) : undefined
        }
      />

      <View style={styles.content}>
        {favoriteDuas.length > 0 ? (
          <FlatList
            data={favoriteDuas}
            keyExtractor={(item) => item.id}
            numColumns={NUM_COLUMNS}
            columnWrapperStyle={localStyles.row}
            renderItem={({ item, index }) => (
              <FavoriteCard
                item={item}
                index={index}
                onPress={handleDuaPress}
                onRemove={handleRemoveFavorite}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              globalStyles.spacingUtils.py('lg'),
              { paddingBottom: 110, paddingHorizontal: 16 },
            ]}
          />
        ) : (
          <EmptyState
            icon={
              <Ionicons
                name="heart-outline"
                size={80}
                color={colors.mutedForeground}
              />
            }
            title="No favorites yet"
            description="Tap the heart icon on any dua to save it here."
          />
        )}
      </View>
    </View>
  );
};

export default FavoritesScreen;
