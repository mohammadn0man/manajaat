import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { Dua } from '../../types/dua';
import { useTheme } from '../../contexts/ThemeProvider';
import { useApp } from '../../contexts/AppContext';
import { globalStyles } from '../../styles/globalStyles';
import { getStartData, getStartLangKey } from '../../services/dataLoader';
import { fontFamilies } from '../../config/fonts';
import Svg, { Circle } from 'react-native-svg';

const PROGRESS_RING_SIZE = 96;
const PROGRESS_RING_STROKE = 8;
const PROGRESS_RING_RADIUS = PROGRESS_RING_SIZE / 2 - PROGRESS_RING_STROKE / 2;
const PROGRESS_RING_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RING_RADIUS;

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
  const { language, getArabicFontFamily, getFontSizeValue } = useApp();
  const startContent = useMemo(() => {
    const data = getStartData();
    const langKey = getStartLangKey(language);
    return {
      title: data.title[langKey],
      body: data.start[langKey],
      duas: data.duas,
      langKey,
    };
  }, [language]);
  const isUrdu = language === 'ur';
  const arabicFont = getArabicFontFamily();
  const fontScale = getFontSizeValue();
  const insets = useSafeAreaInsets();
  const tabBarHeight = 72;
  const tabBarMarginBottom = Math.max(insets.bottom, 20);
  const floatingButtonBottom = tabBarHeight + tabBarMarginBottom + 16;

  return (
    <View style={localStyles.wrapper}>
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
        <View style={localStyles.featuredCardInner}>
          <Text
            style={[
              styles.h4,
              {
                color: colors.primary,
                marginBottom: 4,
                textAlign: 'center',
                ...(isUrdu && {
                  fontFamily: fontFamilies.urdu,
                  fontWeight: Platform.OS === 'android' ? '400' : undefined,
                  fontSize: Math.round(fontScale * 0.95),
                  lineHeight: Math.round(fontScale * 0.95 * 1.8),
                }),
              },
            ]}
          >
            {startContent.title}
          </Text>
          <Text
            style={[
              styles.caption,
              {
                color: colors.mutedForeground,
                marginBottom: 16,
                textAlign: isUrdu ? 'right' : 'left',
                ...(isUrdu && {
                  fontFamily: fontFamilies.urdu,
                  fontWeight: Platform.OS === 'android' ? '400' : undefined,
                  fontSize: Math.round(fontScale * 0.95),
                  lineHeight: Math.round(fontScale * 0.95 * 1.8),
                }),
              },
            ]}
          >
            {startContent.body}
          </Text>
          <View style={localStyles.startDuasList}>
            {startContent.duas.map((dua) => (
              <View key={dua.id} style={localStyles.startDuaItem}>
                <Text
                  style={[
                    styles.caption,
                    {
                      color: colors.foreground,
                      textAlign: 'right',
                      fontFamily: arabicFont,
                      fontSize: fontScale,
                      lineHeight: Math.round(fontScale * 1.6),
                    },
                  ]}
                >
                  {dua.arabic}
                </Text>
              </View>
            ))}
          </View>
        </View>
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

      <View
        style={[
          localStyles.floatingPlayContainer,
          { bottom: floatingButtonBottom },
        ]}
        pointerEvents="box-none"
      >
        <TouchableOpacity
          onPress={onStartReading}
          style={localStyles.playButtonWrapper}
          activeOpacity={0.9}
          accessibilityRole="button"
          accessibilityLabel="Start reading today's duas"
        >
          <View style={localStyles.playButtonInner}>
            <View style={localStyles.progressRingContainer}>
              <Svg
                width={PROGRESS_RING_SIZE}
                height={PROGRESS_RING_SIZE}
                style={localStyles.progressRingSvg}
              >
                <Circle
                  cx={PROGRESS_RING_SIZE / 2}
                  cy={PROGRESS_RING_SIZE / 2}
                  r={PROGRESS_RING_RADIUS}
                  stroke={colors.secondary}
                  strokeWidth={PROGRESS_RING_STROKE}
                  fill="transparent"
                />
                <Circle
                  cx={PROGRESS_RING_SIZE / 2}
                  cy={PROGRESS_RING_SIZE / 2}
                  r={PROGRESS_RING_RADIUS}
                  stroke={colors.primary}
                  strokeWidth={PROGRESS_RING_STROKE}
                  fill="transparent"
                  strokeDasharray={`${PROGRESS_RING_CIRCUMFERENCE * (totalCount > 0 ? completedCount / totalCount : 0)} ${PROGRESS_RING_CIRCUMFERENCE}`}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${PROGRESS_RING_SIZE / 2} ${PROGRESS_RING_SIZE / 2})`}
                />
              </Svg>
            </View>
            <View
              style={[
                localStyles.playButton,
                { backgroundColor: colors.accent },
              ]}
            >
              <Ionicons name="play" size={28} color="#FFFFFF" />
              <Text
                style={[
                  styles.caption,
                  {
                    color: '#FFFFFF',
                    marginTop: 2,
                    fontSize: 11,
                    fontWeight: '600',
                  },
                ]}
              >
                Start
              </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const localStyles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  summaryScroll: {
    paddingHorizontal: globalStyles.spacing.xs,
    paddingTop: globalStyles.spacing.xs,
    paddingBottom: 240,
  },
  floatingPlayContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    ...globalStyles.shadows.lg,
    elevation: 8,
  },
  featuredCard: {
    marginTop: 0,
    marginHorizontal: 4,
    borderRadius: 20,
    padding: 24,
    ...globalStyles.shadows.lg,
  },
  featuredCardInner: {
    alignItems: 'stretch',
  },
  startDuasList: {
    width: '100%',
    marginBottom: 20,
  },
  startDuaItem: {
    marginBottom: 16,
  },
  playButtonWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonInner: {
    width: PROGRESS_RING_SIZE,
    height: PROGRESS_RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressRingContainer: {
    position: 'absolute',
    width: PROGRESS_RING_SIZE,
    height: PROGRESS_RING_SIZE,
  },
  progressRingSvg: {
    position: 'absolute',
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
