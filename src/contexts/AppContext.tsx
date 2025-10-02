import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { I18nManager, useColorScheme, Alert } from 'react-native';
import {
  storageService,
  Language,
  Theme,
  FontSize,
} from '../services/storageService';

export interface AppContextType {
  // State
  language: Language;
  theme: Theme;
  fontSize: FontSize;
  favorites: string[];

  // Actions
  setLanguage: (language: Language) => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  setFontSize: (fontSize: FontSize) => Promise<void>;
  toggleFavorite: (duaId: string) => Promise<boolean>;
  clearFavorites: () => Promise<void>;

  // Computed values
  isFavorite: (duaId: string) => boolean;
  getFontSizeValue: () => number;
  isRTL: boolean;
  isDarkMode: boolean;
  colorScheme: 'light' | 'dark';
}

const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [language, setLanguageState] = useState<Language>('en');
  const [theme, setThemeState] = useState<Theme>('system');
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

  // Load initial state from storage
  useEffect(() => {
    const loadInitialState = async () => {
      try {
        const [settings, savedFavorites] = await Promise.all([
          storageService.getSettings(),
          storageService.getFavorites(),
        ]);

        setLanguageState(settings.language);
        setThemeState(settings.theme);
        setFontSizeState(settings.fontSize);
        setFavorites(savedFavorites);

        // Mark initial load as complete
        setIsInitialLoad(false);
      } catch (error) {
        console.error('Failed to load initial state:', error);
        setIsInitialLoad(false);
      }
    };

    loadInitialState();
  }, []);

  // RTL logic
  const isRTL = language === 'ar' || language === 'ur';

  // Dark mode logic
  const isDarkMode =
    theme === 'dark' || (theme === 'system' && systemColorScheme === 'dark');
  const colorScheme = isDarkMode ? 'dark' : 'light';

  useEffect(() => {
    // Set RTL state during initial load without popup
    if (isInitialLoad && I18nManager.isRTL !== isRTL) {
      console.log('Setting RTL during initial load:', {
        current: I18nManager.isRTL,
        new: isRTL,
      });
      I18nManager.forceRTL(isRTL);
    }
  }, [isRTL, isInitialLoad]);

  // Separate effect for manual language changes (after initial load)
  useEffect(() => {
    if (!isInitialLoad && I18nManager.isRTL !== isRTL) {
      console.log('Manual RTL state change:', {
        current: I18nManager.isRTL,
        new: isRTL,
      });
      I18nManager.forceRTL(isRTL);

      // Show restart prompt for iOS only when user manually changes language
      if (isRTL) {
        Alert.alert(
          'Restart Required',
          'The app needs to restart to apply the language change.',
          [
            {
              text: 'Later',
              style: 'cancel',
            },
            {
              text: 'Restart',
              onPress: () => {
                // On iOS, the app will need to be manually restarted
                // This is a limitation of iOS - the app cannot restart itself
                console.log(
                  'Please restart the app manually to apply RTL changes'
                );
              },
            },
          ]
        );
      }
    }
  }, [isRTL, isInitialLoad]);

  const setLanguage = async (newLanguage: Language) => {
    setLanguageState(newLanguage);
    await storageService.setLanguage(newLanguage);
  };

  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    await storageService.setTheme(newTheme);
  };

  const setFontSize = async (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    await storageService.setFontSize(newFontSize);
  };

  const toggleFavorite = async (duaId: string) => {
    const wasAdded = await storageService.toggleFavorite(duaId);
    const newFavorites = await storageService.getFavorites();
    setFavorites(newFavorites);
    return wasAdded;
  };

  const clearFavorites = async () => {
    await storageService.clearFavorites();
    setFavorites([]);
  };

  const isFavorite = (duaId: string): boolean => {
    return favorites.includes(duaId);
  };

  const getFontSizeValue = (): number => {
    switch (fontSize) {
      case 'small':
        return 16;
      case 'large':
        return 24;
      case 'normal':
      default:
        return 20;
    }
  };

  const value: AppContextType = {
    language,
    theme,
    fontSize,
    favorites,
    setLanguage,
    setTheme,
    setFontSize,
    toggleFavorite,
    clearFavorites,
    isFavorite,
    getFontSizeValue,
    isRTL,
    isDarkMode,
    colorScheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;
