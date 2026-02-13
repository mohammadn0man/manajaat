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
  StyleSheet,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import DuaCard from './DuaCard';
import EmptyState from './common/EmptyState';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { dateKeyForToday } from '../utils/dateUtils';
import { fontFamilies } from '../config/fonts';
import { getTranslation, isLanguageRTL } from '../utils/translationUtils';

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
  const { isRTL, isFavorite, toggleFavorite, language, getFontSizeValue } = useApp();
  const insets = useSafeAreaInsets();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionStartTime] = useState<number>(Date.now());
  const [duaStartTime, setDuaStartTime] = useState<number>(Date.now());
  const [showToast, setShowToast] = useState(false);
  const toastOpacity = useRef(new Animated.Value(0)).current;

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
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentIdx = currentIndexRef.current;
    const rtl = isRTLRef.current;
    if (currentIdx > 0 && !isAnimating) {
      setIsAnimating(true);

      // Log navigation
      analyticsService.logDuaNavigated(currentIdx, currentIdx - 1);

      // Log duration for current dua
      const duration = (Date.now() - duaStartTime) / 1000;
      if (duas[currentIdx]) {
        analyticsService.logDuaViewDuration(duas[currentIdx].id, duration);
      }

      const newIndex = currentIdx - 1;

      // Validate new index
      if (newIndex < 0 || newIndex >= duas.length || !duas[newIndex]) {
        setIsAnimating(false);
        return;
      }

      // Set new card starting position (off-screen from the direction it's coming from)
      // Previous card comes from left (LTR) or right (RTL)
      slideAnim.setValue(rtl ? screenWidth : -screenWidth);

      // Update content immediately
      setCurrentIndex(newIndex);
      setDuaStartTime(Date.now());

      // Reset scroll to top for new card
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }

      // Save progress
      storageService.setTodayProgress(newIndex);

      // Log new dua view
      analyticsService.logDuaView(duas[newIndex].id, newIndex, duas.length);

      // Animate new card sliding in to center
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);

        // Announce to screen reader
        AccessibilityInfo.announceForAccessibility(
          `Dua ${newIndex + 1} of ${duas.length}`
        );
      });
    }
  };

  const goToNext = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const currentIdx = currentIndexRef.current;
    const rtl = isRTLRef.current;
    if (currentIdx < duas.length - 1 && !isAnimating) {
      setIsAnimating(true);

      // Log navigation
      analyticsService.logDuaNavigated(currentIdx, currentIdx + 1);

      // Log duration for current dua
      const duration = (Date.now() - duaStartTime) / 1000;
      if (duas[currentIdx]) {
        analyticsService.logDuaViewDuration(duas[currentIdx].id, duration);
      }

      const newIndex = currentIdx + 1;

      // Validate new index
      if (newIndex < 0 || newIndex >= duas.length || !duas[newIndex]) {
        setIsAnimating(false);
        return;
      }

      // Set new card starting position (off-screen from the direction it's coming from)
      // Next card comes from right (LTR) or left (RTL)
      slideAnim.setValue(rtl ? -screenWidth : screenWidth);

      // Update content immediately
      setCurrentIndex(newIndex);
      setDuaStartTime(Date.now());

      // Reset scroll to top for new card
      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({ y: 0, animated: false });
      }

      // Save progress
      storageService.setTodayProgress(newIndex);

      // Log new dua view
      analyticsService.logDuaView(duas[newIndex].id, newIndex, duas.length);

      // Animate new card sliding in to center
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start(() => {
        setIsAnimating(false);

        // Announce to screen reader
        AccessibilityInfo.announceForAccessibility(
          `Dua ${newIndex + 1} of ${duas.length}`
        );
      });
    }
  };

  const handleComplete = async () => {
    if (isAnimating) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

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
      <View style={styles.container}>
        <EmptyState
          icon={
            <Ionicons
              name="book-outline"
              size={64}
              color={colors.mutedForeground}
            />
          }
          title="No duas available for today"
          description="Check back tomorrow or browse other days from the calendar."
        />
      </View>
    );
  }

  // Safety check: ensure currentIndex is within bounds
  if (currentIndex >= duas.length) {
    setCurrentIndex(duas.length - 1);
    return null;
  }
  if (currentIndex < 0) {
    setCurrentIndex(0);
    return null;
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
            height: 6,
            backgroundColor: colors.muted,
            borderRadius: 3,
            marginTop: 8,
            overflow: 'hidden',
            flexDirection: isRTL ? 'row-reverse' : 'row',
          }}
        >
          <Animated.View
            style={{
              height: '100%',
              backgroundColor: colors.accent,
              borderRadius: 3,
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
              paddingTop: 20,
              paddingBottom: 220,
              paddingHorizontal: 16,
            }}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            bounces={true}
            scrollEnabled={true}
            scrollEventThrottle={16}
          >
            {/* Arabic Card */}
            <DuaCard
              dua={currentDua}
              onPress={onDuaPress}
              compact={false}
              showActions={true}
              onFavoritePress={() => toggleFavorite(currentDua.id)}
              onSpeakerPress={() => {
                // Show toast
                setShowToast(true);
                Animated.sequence([
                  Animated.timing(toastOpacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                  Animated.delay(2000),
                  Animated.timing(toastOpacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                  }),
                ]).start(() => setShowToast(false));
              }}
              isFavorite={isFavorite(currentDua.id)}
              index={currentIndex}
            />

            {/* Translation */}
            {(() => {
              const translation = getTranslation(currentDua, language);
              const isTranslationRTL = isLanguageRTL(language);
              
              if (!translation) {
                return null;
              }

              return (
                <View
                  style={{
                    marginTop: 24,
                    paddingHorizontal: 8,
                  }}
                >
                  <Text
                    style={[
                      styles.body,
                      {
                        color: colors.foreground,
                        fontFamily: isTranslationRTL 
                          ? fontFamilies.urdu 
                          : fontFamilies.latin,
                        fontSize: Math.round(getFontSizeValue() * 0.95), // Dynamic font size for content
                        // Line height: generous for Urdu; increased for English/Roman Urdu to reduce clutter
                        lineHeight: isTranslationRTL 
                          ? Math.round(getFontSizeValue() * 0.95 * 1.8) 
                          : Math.round(getFontSizeValue() * 0.95 * 1.65),
                        textAlign: isTranslationRTL ? 'right' : 'left',
                        // Padding: Urdu keeps existing; English/Roman Urdu get spacing so text isn't cluttered
                        paddingTop: isTranslationRTL 
                          ? Math.max(8, Math.round(getFontSizeValue() * 0.25)) 
                          : Math.round(getFontSizeValue() * 0.2),
                        paddingBottom: isTranslationRTL 
                          ? Math.max(8, Math.round(getFontSizeValue() * 0.25)) 
                          : Math.round(getFontSizeValue() * 0.2),
                      },
                    ]}
                  >
                    {translation}
                  </Text>
                </View>
              );
            })()}

            {/* Reference */}
            {currentDua.reference && (
              <View
                style={{
                  marginTop: 16,
                  paddingHorizontal: 8,
                }}
              >
                <Text
                  style={[
                    styles.caption,
                    {
                      color: colors.accent,
                      fontSize: Math.round(getFontSizeValue() * 0.7),
                      fontStyle: 'italic',
                      textAlign: isRTL ? 'right' : 'left',
                    },
                  ]}
                >
                  {currentDua.reference}
                </Text>
              </View>
            )}
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
            paddingTop: 20,
            paddingBottom: 70 + Math.max(insets.bottom, 20) + 10,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          {/* Previous Button - Outlined when active */}
          <TouchableOpacity
            style={{
              flex: 1,
              minWidth: 140,
              borderRadius: 999,
              borderWidth: 2,
              borderColor: isFirst ? colors.border : colors.primary,
              backgroundColor: isFirst ? colors.muted : 'transparent',
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              paddingHorizontal: 32,
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
              opacity: isFirst ? 0.6 : 1,
            }}
            onPress={goToPrevious}
            disabled={isFirst || isAnimating}
            accessibilityRole="button"
            accessibilityLabel="Previous dua"
            accessibilityHint="Go to previous dua"
          >
            <Ionicons
              name={isRTL ? 'chevron-forward' : 'chevron-back'}
              size={20}
              color={isFirst ? colors.mutedForeground : colors.primary}
            />
            <Text
              style={[
                styles.body,
                {
                  color: isFirst ? colors.mutedForeground : colors.primary,
                  marginLeft: isRTL ? 0 : 8,
                  marginRight: isRTL ? 8 : 0,
                  fontWeight: '600',
                },
              ]}
            >
              Prev
            </Text>
          </TouchableOpacity>

          {/* Next/Complete Button - Filled teal */}
          <TouchableOpacity
            style={{
              flex: 1,
              minWidth: 140,
              borderRadius: 999,
              backgroundColor: isLast ? '#10B981' : colors.primary,
              flexDirection: isRTL ? 'row-reverse' : 'row',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 14,
              paddingHorizontal: 32,
            }}
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
                  color: '#FFFFFF',
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
                color="#FFFFFF"
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
            paddingTop: 20,
            paddingBottom: 70 + Math.max(insets.bottom, 20) + 10,
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          <TouchableOpacity
            style={{
              borderRadius: 999,
              backgroundColor: '#10B981',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 16,
            }}
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
                  color: '#FFFFFF',
                  fontWeight: '600',
                },
              ]}
            >
              I'm done
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Toast Message */}
      {showToast && (
        <Animated.View
          style={{
            position: 'absolute',
            bottom: 100 + Math.max(insets.bottom, 20),
            left: 20,
            right: 20,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            borderRadius: 12,
            paddingVertical: 12,
            paddingHorizontal: 16,
            alignItems: 'center',
            opacity: toastOpacity,
          }}
        >
          <Text
            style={{
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: '500',
            }}
          >
            Coming Soon: Audio recitation
          </Text>
        </Animated.View>
      )}
    </View>
  );
};

export default DuaPager;
