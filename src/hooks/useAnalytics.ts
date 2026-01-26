/**
 * Custom hook for analytics tracking
 * Centralizes analytics logic to prevent duplication
 */

import { useCallback } from 'react';
import { analyticsService } from '../services/analyticsService';
import { errorLogger } from '../utils/errorLogger';

export const useAnalytics = () => {
  // Memoized analytics functions
  const logDuaView = useCallback(
    (duaId: string, index: number, total: number) => {
      try {
        analyticsService.logDuaView(duaId, index, total);
      } catch (error) {
        errorLogger.logError(
          'Failed to log dua view',
          error,
          { context: 'useAnalytics.logDuaView', duaId, index, total },
          'low'
        );
      }
    },
    []
  );

  const logDuaNavigated = useCallback((fromIndex: number, toIndex: number) => {
    try {
      analyticsService.logDuaNavigated(fromIndex, toIndex);
    } catch (error) {
      errorLogger.logError(
        'Failed to log dua navigation',
        error,
        { context: 'useAnalytics.logDuaNavigated', fromIndex, toIndex },
        'low'
      );
    }
  }, []);

  const logDuaViewDuration = useCallback((duaId: string, duration: number) => {
    try {
      analyticsService.logDuaViewDuration(duaId, duration);
    } catch (error) {
      errorLogger.logError(
        'Failed to log dua view duration',
        error,
        { context: 'useAnalytics.logDuaViewDuration', duaId, duration },
        'low'
      );
    }
  }, []);

  const logSessionCompleted = useCallback(
    (dateKey: string, totalDuas: number, duration: number) => {
      try {
        analyticsService.logSessionCompleted(dateKey, totalDuas, duration);
      } catch (error) {
        errorLogger.logError(
          'Failed to log session completion',
          error,
          {
            context: 'useAnalytics.logSessionCompleted',
            dateKey,
            totalDuas,
            duration,
          },
          'medium'
        );
      }
    },
    []
  );

  return {
    logDuaView,
    logDuaNavigated,
    logDuaViewDuration,
    logSessionCompleted,
  };
};
