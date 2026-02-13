import React, { useState, useEffect, useRef } from 'react';
import { View, Image, StyleSheet, Animated, BackHandler } from 'react-native';
import {
  useNavigation,
  NavigationProp,
  useFocusEffect,
} from '@react-navigation/native';
import { useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { RootStackParamList } from '../navigation/types';
import {
  getTodayDuas,
  getTodayDayName,
  getDayDisplayName,
} from '../services/duaService';
import { storageService } from '../services/storageService';
import TopBar, {
  TOP_BAR_HERO_HEIGHT,
  TOP_BAR_DEFAULT_HEIGHT,
} from '../components/TopBar';
import DuaPager from '../components/DuaPager';
import SessionCompleteModal from '../components/SessionCompleteModal';
import CompletionState from '../components/CompletionState';
import EmptyState from '../components/common/EmptyState';
import { TodaySummaryView } from './Home';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { styles, colors } = useTheme();
  const { setTabBarHidden } = useApp();
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

  // Hide tab bar when in reading mode and this screen is focused; show when leaving or when back to summary
  useFocusEffect(
    useCallback(() => {
      if (showReadingMode) {
        setTabBarHidden(true);
      } else {
        setTabBarHidden(false);
      }
      return () => setTabBarHidden(false);
    }, [showReadingMode, setTabBarHidden])
  );

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

  const handleBackToSummary = useCallback(async () => {
    setShowReadingMode(false);
    const [completed, progress] = await Promise.all([
      storageService.isTodayCompleted(),
      storageService.getTodayProgress(),
    ]);
    setIsCompleted(completed);
    setTodayProgress(progress);
  }, []);

  // When in reading mode, hardware back button should return to summary instead of exiting the app
  useFocusEffect(
    useCallback(() => {
      if (!showReadingMode) return;
      const onHardwareBack = () => {
        handleBackToSummary();
        return true;
      };
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        onHardwareBack
      );
      return () => subscription.remove();
    }, [showReadingMode, handleBackToSummary])
  );

  const handleQuickAccessFavorites = () => {
    (navigation as any).navigate('Favorites');
  };

  const showSummary = !isCompleted && !showReadingMode && todayDuas.length > 0;
  const completedCount = Math.min(todayProgress + 1, todayDuas.length);
  const firstDua = todayDuas[0];

  const headerHeight = showSummary
    ? TOP_BAR_HERO_HEIGHT
    : TOP_BAR_DEFAULT_HEIGHT;

  return (
    <View style={styles.container}>
      {showSummary ? (
        <View style={localStyles.topBarAbsolute} pointerEvents="box-none">
          <TopBar
            title="Today's Duas"
            subtitle={todayDisplayName}
            hero
            showBackButton={false}
            centerImage={
              <Image
                source={require('../../assets/images/munajaat-nomani.png')}
                style={localStyles.appIcon}
                resizeMode="contain"
              />
            }
          />
        </View>
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

      <View
        style={[styles.content, showSummary && localStyles.contentUnderHeader]}
      >
        {isCompleted ? (
          <CompletionState
            totalDuas={todayDuas.length}
            onStartAgain={handleStartAgain}
          />
        ) : showReadingMode && todayDuas.length > 0 ? (
          <DuaPager duas={todayDuas} onComplete={handleSessionComplete} />
        ) : showSummary ? (
          <TodaySummaryView
            todayDisplayName={todayDisplayName}
            firstDua={firstDua}
            completedCount={completedCount}
            totalCount={todayDuas.length}
            headerHeight={headerHeight}
            cardSlideAnim={cardSlideAnim}
            quickAccessAnim={quickAccessAnim}
            onStartReading={handleStartReading}
            onQuickAccessFavorites={handleQuickAccessFavorites}
          />
        ) : todayDuas.length === 0 ? (
          <EmptyState
            icon={
              <Ionicons
                name="book-outline"
                size={64}
                color={colors.mutedForeground}
              />
            }
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
  topBarAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  contentUnderHeader: {
    paddingTop: 0,
  },
});

export default HomeScreen;
