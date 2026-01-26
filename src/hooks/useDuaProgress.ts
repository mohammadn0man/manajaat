/**
 * Custom hook for dua progress tracking
 * Extracted from DuaPager to reduce complexity
 */

import { useState, useEffect, useCallback } from 'react';
import { Animated } from 'react-native';
import { storageService } from '../services/storageService';
import { errorLogger } from '../utils/errorLogger';
import { validateArrayIndex } from '../utils/validation';
import { UI_CONSTANTS } from '../constants/ui';

interface UseDuaProgressProps {
  duas: any[];
  onProgressChange?: (index: number) => void;
}

export const useDuaProgress = ({
  duas,
  onProgressChange,
}: UseDuaProgressProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMounted, setIsMounted] = useState(true);
  const [progressAnim] = useState(new Animated.Value(0));

  // Load initial progress with race condition protection
  useEffect(() => {
    let isMountedRef = true;

    const loadProgress = async () => {
      try {
        const savedProgress = await storageService.getTodayProgress();

        if (!isMountedRef || !isMounted) return;

        const index = Math.min(savedProgress, duas.length - 1);

        if (!validateArrayIndex(duas, index, 'useDuaProgress.loadProgress')) {
          return;
        }

        setCurrentIndex(index);
        onProgressChange?.(index);
      } catch (error) {
        errorLogger.logError(
          'Failed to load progress',
          error,
          { context: 'useDuaProgress.loadProgress' },
          'medium'
        );
      }
    };

    loadProgress();

    return () => {
      isMountedRef = false;
    };
  }, [duas, isMounted, onProgressChange]);

  // Update progress animation when index changes
  useEffect(() => {
    const progress = duas.length > 0 ? (currentIndex + 1) / duas.length : 0;
    Animated.timing(progressAnim, {
      toValue: progress,
      duration: UI_CONSTANTS.ANIMATION_DURATION,
      useNativeDriver: false,
    }).start();
  }, [currentIndex, duas.length, progressAnim]);

  // Save progress to storage
  const saveProgress = useCallback(async (index: number) => {
    try {
      await storageService.setTodayProgress(index);
    } catch (error) {
      errorLogger.logError(
        'Failed to save progress',
        error,
        { context: 'useDuaProgress.saveProgress', index },
        'medium'
      );
    }
  }, []);

  // Navigate to specific index
  const goToIndex = useCallback(
    (index: number) => {
      if (!isMounted) return;

      if (!validateArrayIndex(duas, index, 'useDuaProgress.goToIndex')) {
        return;
      }

      setCurrentIndex(index);
      saveProgress(index);
      onProgressChange?.(index);
    },
    [isMounted, duas, saveProgress, onProgressChange]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      setIsMounted(false);
    };
  }, []);

  return {
    currentIndex,
    progressAnim,
    goToIndex,
    isMounted,
  };
};
