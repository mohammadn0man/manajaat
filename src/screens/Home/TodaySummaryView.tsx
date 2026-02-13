import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Dua } from '../../types/dua';
import { useTheme } from '../../contexts/ThemeProvider';
import { globalStyles } from '../../styles/globalStyles';

interface TodaySummaryViewProps {
  todayDisplayName: string;
  firstDua: Dua | undefined;
  completedCount: number;
  totalCount: number;
  cardSlideAnim: Animated.Value;
  quickAccessAnim: Animated.Value;
  onStartReading: () => void;
  onQuickAccessFavorites: () => void;
}

const TodaySummaryView: React.FC<TodaySummaryViewProps> = ({
  todayDisplayName,
  firstDua,
  completedCount,
  totalCount,
  cardSlideAnim,
  quickAccessAnim,
  onStartReading,
  onQuickAccessFavorites,
}) => {
  const { styles, colors } = useTheme();

  return (
    <ScrollView
      style={{ flex: 1 }}
      contentContainerStyle={localStyles.summaryScroll}
      showsVerticalScrollIndicator={false}
    >
      <Animated.View
        style={[
          localStyles.featuredCard,
          { backgroundColor: colors.card },
          {
            opacity: cardSlideAnim,
            transform: [
              {
                translateY: cardSlideAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [24, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={onStartReading}
          style={localStyles.featuredCardInner}
        >
          <Text style={[styles.h4, { color: colors.primary, marginBottom: 4 }]}>
            {todayDisplayName} – Dua for the day
          </Text>
          {firstDua && (
            <Text
              numberOfLines={2}
              style={[
                styles.caption,
                {
                  color: colors.mutedForeground,
                  marginBottom: 20,
                  textAlign: 'right',
                },
              ]}
            >
              {firstDua.arabic}
            </Text>
          )}
          <View style={localStyles.playRow}>
            <TouchableOpacity
              onPress={onStartReading}
              style={[localStyles.playButton, { backgroundColor: colors.accent }]}
              accessibilityRole="button"
              accessibilityLabel="Start reading today's duas"
            >
              <Ionicons name="play" size={36} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <Text style={[styles.caption, { color: colors.primary, marginTop: 12 }]}>
            {completedCount}/{totalCount} Completed
          </Text>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View
        style={[
          localStyles.quickAccessCard,
          { backgroundColor: colors.card },
          {
            opacity: quickAccessAnim,
            transform: [
              {
                translateY: quickAccessAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [20, 0],
                }),
              },
            ],
          },
        ]}
      >
        <TouchableOpacity
          style={localStyles.quickAccessInner}
          onPress={onQuickAccessFavorites}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Quick access to Favorites"
        >
          <Ionicons name="heart" size={24} color={colors.accent} />
          <Text
            style={[
              styles.body,
              { color: colors.foreground, marginLeft: 12, flex: 1 },
            ]}
          >
            Quick Access: Favorites
          </Text>
          <Ionicons name="chevron-forward" size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
      </Animated.View>
    </ScrollView>
  );
};

const localStyles = StyleSheet.create({
  summaryScroll: {
    paddingHorizontal: globalStyles.spacing.xs,
    paddingTop: globalStyles.spacing.xs,
    paddingBottom: 120,
  },
  featuredCard: {
    marginTop: 0,
    marginHorizontal: 4,
    borderRadius: 20,
    padding: 24,
    ...globalStyles.shadows.lg,
  },
  featuredCardInner: {
    alignItems: 'center',
  },
  playRow: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickAccessCard: {
    marginTop: 16,
    borderRadius: 16,
    padding: 20,
    ...globalStyles.shadows.md,
  },
  quickAccessInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default TodaySummaryView;
