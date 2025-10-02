/**
 * Custom hook for swipe gesture handling
 * Extracted from DuaPager to reduce complexity
 */

import { useMemo } from 'react';
import { PanResponder, Animated } from 'react-native';
import { UI_CONSTANTS } from '../constants/ui';

interface UseSwipeGestureProps {
  isAnimating: boolean;
  slideAnim: Animated.Value;
  onPrevious: () => void;
  onNext: () => void;
}

export const useSwipeGesture = ({
  isAnimating,
  slideAnim,
  onPrevious,
  onNext,
}: UseSwipeGestureProps) => {
  // Memoized pan responder
  const panResponder = useMemo(() => {
    return PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        return (
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy) &&
          Math.abs(gestureState.dx) > UI_CONSTANTS.GESTURE_MIN_DISTANCE
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
        const shouldSwipe = Math.abs(dx) > UI_CONSTANTS.SWIPE_THRESHOLD;

        if (shouldSwipe) {
          if (dx > 0) {
            // Swipe right - go to previous
            onPrevious();
          } else {
            // Swipe left - go to next
            onNext();
          }
        } else {
          // Reset position with proper animation
          Animated.spring(slideAnim, {
            toValue: 0,
            tension: UI_CONSTANTS.SPRING_TENSION,
            friction: UI_CONSTANTS.SPRING_FRICTION,
            useNativeDriver: true,
          }).start();
        }
      },
    });
  }, [isAnimating, slideAnim, onPrevious, onNext]);

  return {
    panResponder,
  };
};
