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
  ArabicFont,
} from '../services/storageService';
import { getArabicFontFamily as getArabicFontFamilyHelper } from '../config/fonts';

export interface AppContextType {
  // State
  language: Language;
  theme: Theme;
  fontSize: FontSize;
  arabicFont: ArabicFont;
  favorites: string[];

  // Actions
  setLanguage: (language: Language) => Promise<void>;
  setTheme: (theme: Theme) => Promise<void>;
  setFontSize: (fontSize: FontSize) => Promise<void>;
  setArabicFont: (font: ArabicFont) => Promise<void>;
  toggleFavorite: (duaId: string) => Promise<boolean>;
  clearFavorites: () => Promise<void>;

  // Computed values
  isFavorite: (duaId: string) => boolean;
  getFontSizeValue: () => number;
  getArabicFontFamily: () => string;
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
  const [language, setLanguageState] = useState<Language>('rom-ur');
  const [theme, setThemeState] = useState<Theme>('system');
  const [fontSize, setFontSizeState] = useState<FontSize>('normal');
  const [arabicFont, setArabicFontState] = useState<ArabicFont>('indopak');
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
        setArabicFontState(settings.arabicFont);
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

  const setArabicFont = async (newFont: ArabicFont) => {
    setArabicFontState(newFont);
    await storageService.setArabicFont(newFont);
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
      case 'normal':
        return 20;
      case 'large':
        return 24;
      case 'extra-large':
        return 28;
      default:
        return 20;
    }
  };

  const getArabicFontFamily = (): string => {
    return getArabicFontFamilyHelper(arabicFont);
  };

  const value: AppContextType = {
    language,
    theme,
    fontSize,
    arabicFont,
    favorites,
    setLanguage,
    setTheme,
    setFontSize,
    setArabicFont,
    toggleFavorite,
    clearFavorites,
    isFavorite,
    getFontSizeValue,
    getArabicFontFamily,
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
