/**
 * Custom hook for favorites management
 * Encapsulates favorites logic to prevent duplication
 */

import { useCallback, useMemo } from 'react';
import { useApp } from '../contexts/AppContext';
import { errorLogger } from '../utils/errorLogger';

export const useFavorites = (duaId?: string) => {
  const { isFavorite, toggleFavorite } = useApp();

  // Memoized favorite status for specific dua
  const isFav = useMemo(() => {
    if (!duaId) return false;
    return isFavorite(duaId);
  }, [duaId, isFavorite]);

  // Memoized toggle function for specific dua
  const toggle = useCallback(async () => {
    if (!duaId) {
      errorLogger.logWarning('Attempted to toggle favorite without duaId', {
        context: 'useFavorites.toggle',
      });
      return;
    }

    try {
      await toggleFavorite(duaId);
    } catch (error) {
      errorLogger.logError(
        'Failed to toggle favorite',
        error,
        { context: 'useFavorites.toggle', duaId },
        'medium'
      );
    }
  }, [duaId, toggleFavorite]);

  return {
    isFavorite: isFav,
    toggleFavorite: toggle,
  };
};
