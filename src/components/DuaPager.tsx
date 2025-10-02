/**
 * Refactored DuaPager component using extracted components and hooks
 * This is a cleaner, more maintainable version
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Animated,
  useWindowDimensions,
  AccessibilityInfo,
} from 'react-native';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import DuaCard from './DuaCard';
import ProgressBar from './ProgressBar';
import NavigationButtons from './NavigationButtons';
import { useDuaProgress } from '../hooks/useDuaProgress';
import { useDuaNavigation } from '../hooks/useDuaNavigation';
import { useSwipeGesture } from '../hooks/useSwipeGesture';
import { useAnalytics } from '../hooks/useAnalytics';
import { storageService } from '../services/storageService';
import { dateKeyForToday } from '../utils/dateUtils';
import { UI_CONSTANTS } from '../constants/ui';
import { errorLogger } from '../utils/errorLogger';

interface DuaPagerProps {
  duas: Dua[];
  onComplete: () => void;
  onDuaPress: (dua: Dua) => void;
}

const DuaPager: React.FC<DuaPagerProps> = ({
  duas,
  onComplete,
  onDuaPress,
}) => {
  const { colors } = useTheme();
  const { width: screenWidth } = useWindowDimensions();

  // State
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const [duaStartTime, setDuaStartTime] = useState<number>(Date.now());

  // Custom hooks
  const { currentIndex, progressAnim, goToIndex, isMounted } = useDuaProgress({
    duas,
    onProgressChange: (index) => {
      setDuaStartTime(Date.now());
    },
  });

  const { isFirst, isLast, isOnlyOne, currentDua, goToPrevious, goToNext } =
    useDuaNavigation({
      duas,
      currentIndex,
      onIndexChange: goToIndex,
    });

  const {
    logDuaView,
    logDuaNavigated,
    logSessionCompleted,
  } = useAnalytics();

  // Animation values
  const slideAnim = useMemo(() => new Animated.Value(0), []);

  // Swipe gesture handling
  const { panResponder } = useSwipeGesture({
    isAnimating,
    slideAnim,
    onPrevious: goToPrevious,
    onNext: goToNext,
  });

  // Memoized container style
  const containerStyle = useMemo(
    () => [{ flex: 1 }, { backgroundColor: colors.background }],
    [colors.background]
  );

  // Memoized content container style
  const contentContainerStyle = useMemo(
    () => [
      { flex: 1 },
      {
        paddingHorizontal: UI_CONSTANTS.PADDING.xxl,
        paddingVertical: UI_CONSTANTS.PADDING.lg,
      },
    ],
    []
  );

  // Memoized card container style
  const cardContainerStyle = useMemo(
    () => [
      { flex: 1 },
      {
        justifyContent: 'center' as const,
        alignItems: 'center' as const,
      },
    ],
    []
  );

  // Memoized animated card style
  const animatedCardStyle = useMemo(
    () => [
      {
        width: screenWidth - UI_CONSTANTS.PADDING.xxl * 2,
        transform: [
          {
            translateX: slideAnim,
          },
        ],
      },
    ],
    [screenWidth, slideAnim]
  );

  // Handle navigation with animation
  const handleNavigate = useCallback(
    async (newIndex: number, direction: 'previous' | 'next') => {
      if (!isMounted || isAnimating) return;

      setIsAnimating(true);

      try {
        // Log navigation analytics
        logDuaNavigated(currentIndex, newIndex);

        // Animate slide
        const slideValue = direction === 'next' ? -screenWidth : screenWidth;
        slideAnim.setValue(slideValue);

        Animated.timing(slideAnim, {
          toValue: 0,
          duration: UI_CONSTANTS.ANIMATION_DURATION,
          useNativeDriver: true,
        }).start(() => {
          setIsAnimating(false);
        });

        // Update index
        goToIndex(newIndex);
      } catch (error) {
        errorLogger.logError(
          'Navigation failed',
          error,
          { context: 'DuaPager.handleNavigate', direction, newIndex },
          'medium'
        );
        setIsAnimating(false);
      }
    },
    [
      isMounted,
      isAnimating,
      currentIndex,
      screenWidth,
      slideAnim,
      goToIndex,
      logDuaNavigated,
    ]
  );

  // Handle previous navigation
  const handlePrevious = useCallback(() => {
    if (isFirst) return;
    handleNavigate(currentIndex - 1, 'previous');
  }, [isFirst, currentIndex, handleNavigate]);

  // Handle next navigation
  const handleNext = useCallback(() => {
    if (isLast) return;
    handleNavigate(currentIndex + 1, 'next');
  }, [isLast, currentIndex, handleNavigate]);

  // Handle completion
  const handleComplete = useCallback(async () => {
    if (!isMounted) return;

    try {
      const sessionDuration = Date.now() - sessionStartTime;
      const dateKey = dateKeyForToday();

      // Log completion analytics
      logSessionCompleted(dateKey, duas.length, sessionDuration);

      // Mark as completed
      await storageService.setTodayCompleted();

      onComplete();
    } catch (error) {
      errorLogger.logError(
        'Failed to complete session',
        error,
        { context: 'DuaPager.handleComplete' },
        'high'
      );
    }
  }, [
    isMounted,
    sessionStartTime,
    duas.length,
    logSessionCompleted,
    onComplete,
  ]);

  // Handle dua press
  const handleDuaPress = useCallback(
    (dua: Dua) => {
      onDuaPress(dua);
    },
    [onDuaPress]
  );

  // Log dua view when current dua changes
  useEffect(() => {
    if (currentDua) {
      logDuaView(currentDua.id, currentIndex, duas.length);
    }
  }, [currentDua, currentIndex, duas.length, logDuaView]);


  // Announce navigation for accessibility
  useEffect(() => {
    if (currentDua) {
      AccessibilityInfo.announceForAccessibility(
        `Dua ${currentIndex + 1} of ${duas.length}: ${currentDua.arabic.substring(0, 50)}...`
      );
    }
  }, [currentDua, currentIndex, duas.length]);


  if (!currentDua) {
    return null;
  }

  return (
    <View style={containerStyle}>
      <ProgressBar
        currentIndex={currentIndex}
        totalCount={duas.length}
        progressAnim={progressAnim}
      />

      <View style={contentContainerStyle}>
        <View style={cardContainerStyle}>
          <Animated.View
            style={animatedCardStyle}
            {...panResponder.panHandlers}
          >
            <DuaCard
              dua={currentDua}
              onPress={handleDuaPress}
              showReference={true}
              compact={false}
            />
          </Animated.View>
        </View>
      </View>

      <NavigationButtons
        isFirst={isFirst}
        isLast={isLast}
        isOnlyOne={isOnlyOne}
        isAnimating={isAnimating}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onComplete={handleComplete}
      />
    </View>
  );
};

export default DuaPager;
