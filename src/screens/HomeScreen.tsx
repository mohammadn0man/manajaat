import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import {
  getTodayDuas,
  getTodayDayName,
  getDayDisplayName,
} from '../services/duaService';
import { storageService } from '../services/storageService';
import TopBar from '../components/TopBar';
import DuaPager from '../components/DuaPager';
import SessionCompleteModal from '../components/SessionCompleteModal';
import CompletionState from '../components/CompletionState';
import EmptyState from '../components/common/EmptyState';
import { useTheme } from '../contexts/ThemeProvider';
import { globalStyles } from '../styles/globalStyles';


const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { styles, colors } = useTheme();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [showReadingMode, setShowReadingMode] = useState(false);
  const [todayProgress, setTodayProgress] = useState(0);
  const cardSlideAnim = useRef(new Animated.Value(0)).current;
  const quickAccessAnim = useRef(new Animated.Value(0)).current;

  const todayDuas = getTodayDuas();
  const todayDayName = getTodayDayName();
  const todayDisplayName = getDayDisplayName(todayDayName);

  useEffect(() => {
    const check = async () => {
      const completed = await storageService.isTodayCompleted();
      setIsCompleted(completed);
      const progress = await storageService.getTodayProgress();
      setTodayProgress(progress);
    };
    check();
  }, []);

  useEffect(() => {
    if (!showReadingMode && todayDuas.length > 0) {
      Animated.parallel([
        Animated.timing(cardSlideAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(quickAccessAnim, {
          toValue: 1,
          duration: 300,
          delay: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      cardSlideAnim.setValue(0);
      quickAccessAnim.setValue(0);
    }
  }, [showReadingMode, todayDuas.length, cardSlideAnim, quickAccessAnim]);

  const handleDayPress = () => {
    navigation.navigate('DayView', { day: todayDayName });
  };

  const handleSessionComplete = () => {
    setShowCompleteModal(true);
  };

  const handleBackToHome = () => {
    setIsCompleted(true);
    setShowReadingMode(false);
  };

  const handleCloseModal = () => {
    setShowCompleteModal(false);
  };

  const handleViewFavorites = () => {
    setShowCompleteModal(false);
  };

  const handleStartAgain = async () => {
    await storageService.resetTodayProgress();
    setIsCompleted(false);
    setShowReadingMode(false);
    setTodayProgress(0);
  };

  const handleStartReading = () => {
    setShowReadingMode(true);
  };

  const handleBackToSummary = async () => {
    setShowReadingMode(false);
    const [completed, progress] = await Promise.all([
      storageService.isTodayCompleted(),
      storageService.getTodayProgress(),
    ]);
    setIsCompleted(completed);
    setTodayProgress(progress);
  };

  const handleQuickAccessFavorites = () => {
    (navigation as any).navigate('Favorites');
  };

  const showSummary =
    !isCompleted && !showReadingMode && todayDuas.length > 0;
  const completedCount = Math.min(todayProgress + 1, todayDuas.length);
  const firstDua = todayDuas[0];

  return (
    <View style={styles.container}>
      {showSummary ? (
        <TopBar
          title="Today's Duas"
          subtitle={todayDisplayName}
          hero
          showBackButton={false}
          rightComponent={
            <Image
              source={require('../../assets/images/munajaat-nomani.png')}
              style={localStyles.appIcon}
              resizeMode="contain"
            />
          }
        />
      ) : (
        <TopBar
          title="Read today's Duas"
          subtitle={todayDisplayName}
          onBackPress={handleBackToSummary}
          showBackButton
          rightComponent={
            <Image
              source={require('../../assets/images/munajaat-nomani.png')}
              style={localStyles.appIcon}
              resizeMode="contain"
            />
          }
        />
      )}

      <View style={styles.content}>
        {isCompleted ? (
          <CompletionState
            totalDuas={todayDuas.length}
            onStartAgain={handleStartAgain}
          />
        ) : showReadingMode && todayDuas.length > 0 ? (
          <DuaPager
            duas={todayDuas}
            onComplete={handleSessionComplete}
          />
        ) : showSummary ? (
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
                onPress={handleStartReading}
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
                    onPress={handleStartReading}
                    style={[localStyles.playButton, { backgroundColor: colors.accent }]}
                    accessibilityRole="button"
                    accessibilityLabel="Start reading today's duas"
                  >
                    <Ionicons name="play" size={36} color="#FFFFFF" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.caption, { color: colors.primary, marginTop: 12 }]}>
                  {completedCount}/{todayDuas.length} Completed
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
                onPress={handleQuickAccessFavorites}
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
        ) : todayDuas.length === 0 ? (
          <EmptyState
            icon={<Ionicons name="book-outline" size={64} color={colors.mutedForeground} />}
            title="No duas for today"
            description="Check back tomorrow or browse other days from the calendar."
          />
        ) : null}
      </View>

      <SessionCompleteModal
        visible={showCompleteModal}
        onClose={handleCloseModal}
        onViewFavorites={handleViewFavorites}
        onBackToHome={handleBackToHome}
        totalDuas={todayDuas.length}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  appIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
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

export default HomeScreen;
