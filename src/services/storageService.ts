import AsyncStorage from '@react-native-async-storage/async-storage';
import { errorLogger } from '../utils/errorLogger';

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: 'favorites',
  LANGUAGE: 'language',
  THEME: 'theme',
  FONT_SIZE: 'fontSize',
} as const;

export type Language = 'en' | 'ur' | 'ar';
export type Theme = 'system' | 'light' | 'dark';
export type FontSize = 'small' | 'normal' | 'large';

export interface AppSettings {
  language: Language;
  theme: Theme;
  fontSize: FontSize;
}

class StorageService {
  // Favorites management
  async getFavorites(): Promise<string[]> {
    try {
      const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      errorLogger.logError(
        'Failed to get favorites from storage',
        error,
        { context: 'storageService.getFavorites' },
        'medium'
      );
      return [];
    }
  }

  async toggleFavorite(duaId: string): Promise<boolean> {
    try {
      const favorites = await this.getFavorites();
      const index = favorites.indexOf(duaId);

      if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
      } else {
        // Add to favorites
        favorites.push(duaId);
      }

      await AsyncStorage.setItem(
        STORAGE_KEYS.FAVORITES,
        JSON.stringify(favorites)
      );
      return index === -1; // Return true if added, false if removed
    } catch (error) {
      errorLogger.logError(
        'Failed to toggle favorite',
        error,
        { context: 'storageService.toggleFavorite', duaId },
        'medium'
      );
      return false;
    }
  }

  async clearFavorites(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.FAVORITES);
    } catch (error) {
      errorLogger.logError(
        'Failed to clear favorites',
        error,
        { context: 'storageService.clearFavorites' },
        'medium'
      );
    }
  }

  async isFavorite(duaId: string): Promise<boolean> {
    const favorites = await this.getFavorites();
    return favorites.includes(duaId);
  }

  // Settings management
  async getSettings(): Promise<AppSettings> {
    try {
      const [language, theme, fontSize] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.FONT_SIZE),
      ]);

      return {
        language: (language as Language) || 'en',
        theme: (theme as Theme) || 'system',
        fontSize: (fontSize as FontSize) || 'normal',
      };
    } catch (error) {
      errorLogger.logError(
        'Failed to get settings from storage',
        error,
        { context: 'storageService.getSettings' },
        'medium'
      );
      return {
        language: 'en',
        theme: 'system',
        fontSize: 'normal',
      };
    }
  }

  async setLanguage(language: Language): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, language);
    } catch (error) {
      errorLogger.logError(
        'Failed to set language',
        error,
        { context: 'storageService.setLanguage', language },
        'medium'
      );
    }
  }

  async setTheme(theme: Theme): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.THEME, theme);
    } catch (error) {
      errorLogger.logError(
        'Failed to set theme',
        error,
        { context: 'storageService.setTheme', theme },
        'medium'
      );
    }
  }

  async setFontSize(fontSize: FontSize): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.FONT_SIZE, fontSize);
    } catch (error) {
      errorLogger.logError(
        'Failed to set font size',
        error,
        { context: 'storageService.setFontSize', fontSize },
        'medium'
      );
    }
  }

  // Progress tracking methods
  async getTodayProgress(): Promise<number> {
    try {
      const todayKey = `todayProgress_${new Date().toISOString().split('T')[0]}`;
      const progress = await AsyncStorage.getItem(todayKey);
      return progress ? parseInt(progress, 10) : 0;
    } catch (error) {
      errorLogger.logError(
        'Failed to get today progress',
        error,
        { context: 'storageService.getTodayProgress' },
        'medium'
      );
      return 0;
    }
  }

  async setTodayProgress(progress: number): Promise<void> {
    try {
      const todayKey = `todayProgress_${new Date().toISOString().split('T')[0]}`;
      await AsyncStorage.setItem(todayKey, progress.toString());
    } catch (error) {
      errorLogger.logError(
        'Failed to set today progress',
        error,
        { context: 'storageService.setTodayProgress', progress },
        'medium'
      );
    }
  }

  async clearTodayProgress(): Promise<void> {
    try {
      const todayKey = `todayProgress_${new Date().toISOString().split('T')[0]}`;
      await AsyncStorage.removeItem(todayKey);
    } catch (error) {
      errorLogger.logError(
        'Failed to clear today progress',
        error,
        { context: 'storageService.clearTodayProgress' },
        'medium'
      );
    }
  }

  async isTodayCompleted(): Promise<boolean> {
    try {
      const todayKey = `completed_${new Date().toISOString().split('T')[0]}`;
      const completed = await AsyncStorage.getItem(todayKey);
      return completed === 'true';
    } catch (error) {
      errorLogger.logError(
        'Failed to check if today is completed',
        error,
        { context: 'storageService.isTodayCompleted' },
        'medium'
      );
      return false;
    }
  }

  async setTodayCompleted(p0: boolean): Promise<void> {
    try {
      const todayKey = `completed_${new Date().toISOString().split('T')[0]}`;
      await AsyncStorage.setItem(todayKey, 'true');
    } catch (error) {
      errorLogger.logError(
        'Failed to set today as completed',
        error,
        { context: 'storageService.setTodayCompleted' },
        'medium'
      );
    }
  }

  async resetTodayProgress(): Promise<void> {
    try {
      const todayKey = `todayProgress_${new Date().toISOString().split('T')[0]}`;
      const completedKey = `completed_${new Date().toISOString().split('T')[0]}`;
      await AsyncStorage.removeItem(todayKey);
      await AsyncStorage.removeItem(completedKey);
    } catch (error) {
      errorLogger.logError(
        'Failed to reset today progress',
        error,
        { context: 'storageService.resetTodayProgress' },
        'medium'
      );
    }
  }

  // Utility methods
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      errorLogger.logError(
        'Failed to clear all storage',
        error,
        { context: 'storageService.clearAll' },
        'high'
      );
    }
  }
}

export const storageService = new StorageService();
export default storageService;
