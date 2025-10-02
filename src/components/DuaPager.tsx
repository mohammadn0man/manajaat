import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  Dimensions,
  AccessibilityInfo,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import DuaCard from './DuaCard';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { dateKeyForToday } from '../utils/dateUtils';

interface DuaPagerProps {
  duas: Dua[];
  onComplete: () => void;
  onDuaPress: (dua: Dua) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;
const ANIMATION_DURATION = 250;

const DuaPager: React.FC<DuaPagerProps> = ({
  duas,
  onComplete,
  onDuaPress,
}) => {
  const { styles, colors } = useTheme();
  const { isRTL } = useApp();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const [duaStartTime, setDuaStartTime] = useState<number>(Date.now());

  const slideAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  // Load initial progress
  useEffect(() => {
    const loadProgress = async () => {
      const savedProgress = await storageService.getTodayProgress();
      const index = Math.min(savedProgress, duas.length - 1);
      setCurrentIndex(index);
      setDuaStartTime(Date.now());

      // Log initial dua view
      if (duas.length > 0) {
        analyticsService.logDuaView(duas[index].id, index, duas.length);
      }
    };

    loadProgress();
  }, [duas]);

  // Update progress animation when index changes
  useEffect(() => {
    const progress = duas.length > 0 ? (currentIndex + 1) / duas.length : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, duas.length, progressAnim]);

  // Ensure slide animation is reset when currentIndex changes
  useEffect(() => {
    slideAnim.setValue(0);
  }, [currentIndex, slideAnim]);

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > 10
        );
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isAnimating) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimating) return;

        const { dx } = gestureState;
        const shouldSwipe = Math.abs(dx) > SWIPE_THRESHOLD;

        if (shouldSwipe) {
          if (dx > 0) {
            // Swipe right - go to previous
            goToPrevious();
          } else {
            // Swipe left - go to next
            goToNext();
          }
        } else {
          // Reset position with proper animation
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
    })
  ).current;

  const goToPrevious = async () => {
    if (currentIndex > 0 && !isAnimating) {
      setIsAnimating(true);

      // Log navigation
      analyticsService.logDuaNavigated(currentIndex, currentIndex - 1);

      // Log duration for current dua
      const duration = (Date.now() - duaStartTime) / 1000;
      analyticsService.logDuaViewDuration(duas[currentIndex].id, duration);

      const newIndex = currentIndex - 1;

      // Reset animation value before starting
      slideAnim.setValue(0);

      // Animate slide
      Animated.timing(slideAnim, {
        toValue: isRTL ? -screenWidth : screenWidth,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(newIndex);
        setDuaStartTime(Date.now());
        slideAnim.setValue(0);
        setIsAnimating(false);

        // Save progress
        storageService.setTodayProgress(newIndex);

        // Log new dua view
        analyticsService.logDuaView(duas[newIndex].id, newIndex, duas.length);

        // Announce to screen reader
        AccessibilityInfo.announceForAccessibility(
          `Dua ${newIndex + 1} of ${duas.length}`
        );
      });
    }
  };

  const goToNext = async () => {
    if (currentIndex < duas.length - 1 && !isAnimating) {
      setIsAnimating(true);

      // Log navigation
      analyticsService.logDuaNavigated(currentIndex, currentIndex + 1);

      // Log duration for current dua
      const duration = (Date.now() - duaStartTime) / 1000;
      analyticsService.logDuaViewDuration(duas[currentIndex].id, duration);

      const newIndex = currentIndex + 1;

      // Reset animation value before starting
      slideAnim.setValue(0);

      // Animate slide
      Animated.timing(slideAnim, {
        toValue: isRTL ? screenWidth : -screenWidth,
        duration: ANIMATION_DURATION,
        useNativeDriver: true,
      }).start(() => {
        setCurrentIndex(newIndex);
        setDuaStartTime(Date.now());
        slideAnim.setValue(0);
        setIsAnimating(false);

        // Save progress
        storageService.setTodayProgress(newIndex);

        // Log new dua view
        analyticsService.logDuaView(duas[newIndex].id, newIndex, duas.length);

        // Announce to screen reader
        AccessibilityInfo.announceForAccessibility(
          `Dua ${newIndex + 1} of ${duas.length}`
        );
      });
    }
  };

  const handleComplete = async () => {
    if (isAnimating) return;

    // Log session completion
    const totalDuration = (Date.now() - sessionStartTime) / 1000;
    analyticsService.logSessionCompleted(
      dateKeyForToday(),
      duas.length,
      totalDuration
    );

    // Mark as completed
    await storageService.setTodayCompleted();
    await storageService.clearTodayProgress();

    onComplete();
  };

  if (duas.length === 0) {
    return (
      <View style={styles.centerContent}>
        <Ionicons
          name="book-outline"
          size={64}
          color={colors.mutedForeground}
        />
        <Text
          style={[
            styles.h3,
            { color: colors.foreground, marginTop: 16, textAlign: 'center' },
          ]}
        >
          No duas available for today
        </Text>
        <Text style={[styles.textMuted, { textAlign: 'center', marginTop: 8 }]}>
          Check back tomorrow or browse other days
        </Text>
      </View>
    );
  }

  const currentDua = duas[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === duas.length - 1;
  const isOnlyOne = duas.length === 1;

  return (
    <View style={styles.container}>
      {/* Progress Bar */}
      <View
        style={{
          paddingHorizontal: 24,
          paddingVertical: 16,
          backgroundColor: colors.background,
        }}
      >
        <View style={styles.rowBetween}>
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>
            {currentIndex + 1} of {duas.length}
          </Text>
          <Text style={[styles.caption, { color: colors.mutedForeground }]}>
            {Math.round(((currentIndex + 1) / duas.length) * 100)}%
          </Text>
        </View>

        {/* Progress Bar */}
        <View
          style={{
            height: 4,
            backgroundColor: colors.muted,
            borderRadius: 2,
            marginTop: 8,
            overflow: 'hidden',
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: colors.primary,
              borderRadius: 2,
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }}
            accessibilityRole="progressbar"
            accessibilityValue={{
              min: 0,
              max: duas.length,
              now: currentIndex + 1,
            }}
          />
        </View>
      </View>

      {/* Dua Card */}
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
          }}
          {...panResponder.panHandlers}
        >
          <DuaCard
            dua={currentDua}
            onPress={onDuaPress}
            showReference={true}
            compact={false}
          />
        </Animated.View>
      </View>

      {/* Navigation Buttons */}
      {!isOnlyOne && (
        <View
          style={{
            flexDirection: isRTL ? 'row-reverse' : 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingVertical: 20,
            backgroundColor: colors.background,
          }}
        >
          {/* Previous Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isFirst ? colors.muted : colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                opacity: isFirst ? 0.5 : 1,
              },
            ]}
            onPress={goToPrevious}
            disabled={isFirst || isAnimating}
            accessibilityRole="button"
            accessibilityLabel="Previous dua"
            accessibilityHint="Go to previous dua"
          >
            <Ionicons
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              size={20}
              color={
                isFirst ? colors.mutedForeground : colors.primaryForeground
              }
            />
            <Text
              style={[
                styles.body,
                {
                  color: isFirst
                    ? colors.mutedForeground
                    : colors.primaryForeground,
                  marginLeft: isRTL ? 0 : 8,
                  marginRight: isRTL ? 8 : 0,
                  fontWeight: '600',
                },
              ]}
            >
              Previous
            </Text>
          </TouchableOpacity>

          {/* Next/Complete Button */}
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: isLast ? '#10B981' : colors.primary,
                paddingHorizontal: 20,
                paddingVertical: 12,
                borderRadius: 12,
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
              },
            ]}
            onPress={isLast ? handleComplete : goToNext}
            disabled={isAnimating}
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'I am done' : 'Next dua'}
            accessibilityHint={
              isLast ? "Complete today's session" : 'Go to next dua'
            }
          >
            <Text
              style={[
                styles.body,
                {
                  color: 'white',
                  marginLeft: isRTL ? 0 : 8,
                  marginRight: isRTL ? 8 : 0,
                  fontWeight: '600',
                },
              ]}
            >
              {isLast ? "I'm done" : 'Next'}
            </Text>
            {!isLast && (
              <Ionicons
                name={isRTL ? 'chevron-back' : 'chevron-forward'}
                size={20}
                color="white"
              />
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Single Dua Complete Button */}
      {isOnlyOne && (
        <View
          style={{
            paddingHorizontal: 24,
            paddingVertical: 20,
            backgroundColor: colors.background,
          }}
        >
          <TouchableOpacity
            style={[
              styles.button,
              {
                backgroundColor: '#10B981',
                paddingVertical: 16,
                borderRadius: 12,
                alignItems: 'center',
              },
            ]}
            onPress={handleComplete}
            disabled={isAnimating}
            accessibilityRole="button"
            accessibilityLabel="I am done"
            accessibilityHint="Complete today's session"
          >
            <Text
              style={[
                styles.body,
                {
                  color: 'white',
                  fontWeight: '600',
                },
              ]}
            >
              I'm done
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DuaPager;
