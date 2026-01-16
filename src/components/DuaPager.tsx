import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  AccessibilityInfo,
  ScrollView,
  PanResponder,
  Dimensions,
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
  onDuaPress?: (dua: Dua) => void;
}

const { width: screenWidth } = Dimensions.get('window');
const SWIPE_THRESHOLD = 50;

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

  const progressAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scrollViewRef = useRef<ScrollView>(null);
  const currentIndexRef = useRef(currentIndex);
  const isRTLRef = useRef(isRTL);
  
  // Keep refs in sync with state
  useEffect(() => {
    currentIndexRef.current = currentIndex;
  }, [currentIndex]);
  
  useEffect(() => {
    isRTLRef.current = isRTL;
  }, [isRTL]);

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
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, duas.length, progressAnim]);

  // Reset scroll position when card changes
  useEffect(() => {
    slideAnim.setValue(0);
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: false });
    }
  }, [currentIndex, slideAnim]);

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, gestureState) => {
        if (isAnimating) return false;
        
        // Only capture clear horizontal swipes
        const isHorizontalSwipe = Math.abs(gestureState.dx) > Math.abs(gestureState.dy) * 2;
        const isSignificantMove = Math.abs(gestureState.dx) > 15;
        
        return isHorizontalSwipe && isSignificantMove;
      },
      onPanResponderGrant: () => {
        // Stop any ongoing animations
        slideAnim.stopAnimation();
      },
      onPanResponderMove: (_, gestureState) => {
        if (!isAnimating && Math.abs(gestureState.dx) > Math.abs(gestureState.dy)) {
          slideAnim.setValue(gestureState.dx);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (isAnimating) {
          slideAnim.setValue(0);
          return;
        }

        const { dx } = gestureState;
        const shouldSwipe = Math.abs(dx) > SWIPE_THRESHOLD;
        const currentIdx = currentIndexRef.current;
        const rtl = isRTLRef.current;

        if (shouldSwipe) {
          // In RTL mode, reverse the swipe direction
          const isSwipeRight = dx > 0;
          const shouldGoNext = rtl ? isSwipeRight : !isSwipeRight;
          
          if (shouldGoNext && currentIdx < duas.length - 1) {
            // Go to next
            goToNext();
          } else if (!shouldGoNext && currentIdx > 0) {
            // Go to previous
            goToPrevious();
          } else {
            // Can't go further, reset
            Animated.spring(slideAnim, {
              toValue: 0,
              tension: 100,
              friction: 8,
              useNativeDriver: true,
            }).start();
          }
        } else {
          // Reset position
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: 100,
            friction: 8,
            useNativeDriver: true,
          }).start();
        }
      },
      onPanResponderTerminate: () => {
        slideAnim.setValue(0);
      },
    })
  ).current;

  const goToPrevious = async () => {
    const currentIdx = currentIndexRef.current;
    const rtl = isRTLRef.current;
    if (currentIdx > 0 && !isAnimating) {
      setIsAnimating(true);

      // Log navigation
      analyticsService.logDuaNavigated(currentIdx, currentIdx - 1);

      // Log duration for current dua
      const duration = (Date.now() - duaStartTime) / 1000;
      analyticsService.logDuaViewDuration(duas[currentIdx].id, duration);

      const newIndex = currentIdx - 1;

      // Animate slide out (RTL: left, LTR: right)
      Animated.timing(slideAnim, {
        toValue: rtl ? -screenWidth : screenWidth,
        duration: 250,
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
    const currentIdx = currentIndexRef.current;
    const rtl = isRTLRef.current;
    if (currentIdx < duas.length - 1 && !isAnimating) {
      setIsAnimating(true);

      // Log navigation
      analyticsService.logDuaNavigated(currentIdx, currentIdx + 1);

      // Log duration for current dua
      const duration = (Date.now() - duaStartTime) / 1000;
      analyticsService.logDuaViewDuration(duas[currentIdx].id, duration);

      const newIndex = currentIdx + 1;

      // Animate slide out (RTL: right, LTR: left)
      Animated.timing(slideAnim, {
        toValue: rtl ? screenWidth : -screenWidth,
        duration: 250,
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
            flexDirection: isRTL ? 'row-reverse' : 'row',
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
      <View style={{ flex: 1 }} {...panResponder.panHandlers}>
        <Animated.View
          style={{
            flex: 1,
            transform: [{ translateX: slideAnim }],
          }}
        >
          <ScrollView
            ref={scrollViewRef}
            style={{ flex: 1 }}
            contentContainerStyle={{ 
              flexGrow: 1,
              justifyContent: 'center',
              paddingVertical: 20,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bounces={true}
            scrollEnabled={true}
            scrollEventThrottle={16}
          >
            <DuaCard
              dua={currentDua}
              onPress={onDuaPress}
              showReference={true}
              compact={false}
            />
          </ScrollView>
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
