/**
 * Custom hook for dua navigation logic
 * Encapsulates navigation logic to prevent duplication
 */

import { useCallback, useMemo } from 'react';
import { Dua } from '../types/dua';
import { validateArrayIndex } from '../utils/validation';

interface UseDuaNavigationProps {
  duas: Dua[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export const useDuaNavigation = ({
  duas,
  currentIndex,
  onIndexChange,
}: UseDuaNavigationProps) => {
  // Navigation state
  const isFirst = useMemo(() => currentIndex === 0, [currentIndex]);
  const isLast = useMemo(
    () => currentIndex === duas.length - 1,
    [currentIndex, duas.length]
  );
  const isOnlyOne = useMemo(() => duas.length === 1, [duas.length]);
  const currentDua = useMemo(() => duas[currentIndex], [duas, currentIndex]);

  // Navigation functions
  const goToPrevious = useCallback(() => {
    if (isFirst) return;

    const newIndex = currentIndex - 1;
    if (!validateArrayIndex(duas, newIndex, 'useDuaNavigation.goToPrevious')) {
      return;
    }

    onIndexChange(newIndex);
  }, [currentIndex, isFirst, duas, onIndexChange]);

  const goToNext = useCallback(() => {
    if (isLast) return;

    const newIndex = currentIndex + 1;
    if (!validateArrayIndex(duas, newIndex, 'useDuaNavigation.goToNext')) {
      return;
    }

    onIndexChange(newIndex);
  }, [currentIndex, isLast, duas, onIndexChange]);

  const goToIndex = useCallback(
    (index: number) => {
      if (!validateArrayIndex(duas, index, 'useDuaNavigation.goToIndex')) {
        return;
      }

      onIndexChange(index);
    },
    [duas, onIndexChange]
  );

  // Progress calculation
  const progress = useMemo(() => {
    if (duas.length === 0) return 0;
    return (currentIndex + 1) / duas.length;
  }, [currentIndex, duas.length]);

  const progressPercentage = useMemo(() => {
    return Math.round(progress * 100);
  }, [progress]);

  return {
    // State
    isFirst,
    isLast,
    isOnlyOne,
    currentDua,
    progress,
    progressPercentage,

    // Actions
    goToPrevious,
    goToNext,
    goToIndex,
  };
};
