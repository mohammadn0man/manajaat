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
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import DuaCard from './DuaCard';
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
  const { isRTL, isFavorite, toggleFavorite, language } = useApp();
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
                          : (fontFamilies.latin === 'System' ? undefined : fontFamilies.latin),
                        fontSize: 16,
                        lineHeight: isTranslationRTL ? 28 : 24,
                        textAlign: isTranslationRTL ? 'right' : 'left',
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
                    styles.textMuted,
                    {
                      fontSize: 14,
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
          {/* Previous Button */}
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 20,
              overflow: 'hidden',
              opacity: isFirst ? 0.5 : 1,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 5,
              marginRight: isRTL ? 0 : 12,
              marginLeft: isRTL ? 12 : 0,
            }}
            onPress={goToPrevious}
            disabled={isFirst || isAnimating}
            accessibilityRole="button"
            accessibilityLabel="Previous dua"
            accessibilityHint="Go to previous dua"
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 100 : 0}
              tint="light"
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
                backgroundColor: Platform.OS === 'android' 
                  ? (isFirst ? colors.muted : colors.primary)
                  : 'transparent',
              }}
            >
              {Platform.OS === 'ios' && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: isFirst
                      ? `${colors.muted}55`
                      : `${colors.primary}66`,
                    borderRadius: 20,
                  }}
                />
              )}
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
            </BlurView>
          </TouchableOpacity>

          {/* Next/Complete Button */}
          <TouchableOpacity
            style={{
              flex: 1,
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 10,
            }}
            onPress={isLast ? handleComplete : goToNext}
            disabled={isAnimating}
            accessibilityRole="button"
            accessibilityLabel={isLast ? 'I am done' : 'Next dua'}
            accessibilityHint={
              isLast ? "Complete today's session" : 'Go to next dua'
            }
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 100 : 0}
              tint="light"
              style={{
                flexDirection: isRTL ? 'row-reverse' : 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 20,
                paddingVertical: 12,
                backgroundColor: Platform.OS === 'android' 
                  ? (isLast ? '#10B981' : colors.primary)
                  : 'transparent',
              }}
            >
              {Platform.OS === 'ios' && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: isLast ? '#10B98166' : `${colors.primary}66`,
                    borderRadius: 20,
                  }}
                />
              )}
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
            </BlurView>
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
              borderRadius: 20,
              overflow: 'hidden',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.15,
              shadowRadius: 8,
              elevation: 10,
            }}
            onPress={handleComplete}
            disabled={isAnimating}
            accessibilityRole="button"
            accessibilityLabel="I am done"
            accessibilityHint="Complete today's session"
          >
            <BlurView
              intensity={Platform.OS === 'ios' ? 100 : 0}
              tint="light"
              style={{
                alignItems: 'center',
                paddingVertical: 16,
                backgroundColor: Platform.OS === 'android' ? '#10B981' : 'transparent',
              }}
            >
              {Platform.OS === 'ios' && (
                <View
                  style={{
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: '#10B98166',
                    borderRadius: 20,
                  }}
                />
              )}
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
            </BlurView>
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
