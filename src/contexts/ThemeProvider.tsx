import React, { createContext, useContext, ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { useApp } from './AppContext';
import { globalStyles } from '../styles/globalStyles';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
}

export interface ThemeStyles {
  colors: ThemeColors;
  styles: {
    // Layout styles
    container: object;
    content: object;
    contentCompact: object;
    centerContent: object;
    row: object;
    rowBetween: object;
    rowCenter: object;
    column: object;
    columnCenter: object;

    // Component styles
    card: object;
    cardCompact: object;
    button: object;
    buttonSmall: object;
    input: object;
    listItem: object;
    section: object;
    sectionHeader: object;

    // Text styles
    text: object;
    textSecondary: object;
    textMuted: object;
    textPrimary: object;
    textAccent: object;

    // Typography styles
    h1: object;
    h2: object;
    h3: object;
    h4: object;
    body: object;
    bodyLarge: object;
    caption: object;
    small: object;
    arabic: object;
    arabicLarge: object;

    // Border and background
    border: object;
    background: object;

    // Global styles access
    globalStyles: typeof globalStyles;
  };
}

const ThemeContext = createContext<ThemeStyles | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const { colorScheme, getFontSizeValue, getArabicFontFamily } = useApp();
  
  // Static base font size for application UI (always uses "normal" size = 20px)
  const STATIC_BASE_FONT_SIZE = 20;

  const colors: ThemeColors = {
    light: {
      background: '#F8F6F3',
      foreground: '#2C3E50',
      card: '#FFFFFF',
      cardForeground: '#2C3E50',
      popover: '#FFFFFF',
      popoverForeground: '#2C3E50',
      primary: '#1A5F5F',
      primaryForeground: '#FFFFFF',
      secondary: '#2C7A7A',
      secondaryForeground: '#FFFFFF',
      muted: '#EDE9E4',
      mutedForeground: '#7F8C9A',
      accent: '#C9A961',
      accentForeground: '#2C3E50',
      destructive: '#E74C3C',
      destructiveForeground: '#FFFFFF',
      border: '#E0DDD8',
      input: '#E0DDD8',
      ring: '#1A5F5F',
    },
    dark: {
      background: '#0F4545',
      foreground: '#F8FAFC',
      card: '#1E293B',
      cardForeground: '#F8FAFC',
      popover: '#1E293B',
      popoverForeground: '#F8FAFC',
      primary: '#2C7A7A',
      primaryForeground: '#FFFFFF',
      secondary: '#1A5F5F',
      secondaryForeground: '#F8FAFC',
      muted: '#0F4545',
      mutedForeground: '#94A3B8',
      accent: '#D4B876',
      accentForeground: '#0A1628',
      destructive: '#F87171',
      destructiveForeground: '#0A1628',
      border: '#1E293B',
      input: '#1E293B',
      ring: '#2C7A7A',
    },
  }[colorScheme];

  const styles = StyleSheet.create({
    // Layout styles
    container: {
      ...globalStyles.layout.container,
      backgroundColor: colors.background,
    },
    content: {
      ...globalStyles.layout.content,
    },
    contentCompact: {
      ...globalStyles.layout.contentCompact,
    },
    centerContent: {
      ...globalStyles.layout.centerContent,
    },
    row: {
      ...globalStyles.layout.row,
    },
    rowBetween: {
      ...globalStyles.layout.rowBetween,
    },
    rowCenter: {
      ...globalStyles.layout.rowCenter,
    },
    column: {
      ...globalStyles.layout.column,
    },
    columnCenter: {
      ...globalStyles.layout.columnCenter,
    },

    // Component styles
    card: {
      ...globalStyles.components.card,
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
    },
    cardCompact: {
      ...globalStyles.components.cardCompact,
      backgroundColor: colors.card,
      borderColor: colors.border,
      borderWidth: 1,
    },
    button: {
      ...globalStyles.components.button,
      backgroundColor: colors.muted,
    },
    buttonSmall: {
      ...globalStyles.components.buttonSmall,
      backgroundColor: colors.muted,
    },
    input: {
      ...globalStyles.components.input,
      backgroundColor: colors.card,
      borderColor: colors.border,
      color: colors.foreground,
    },
    listItem: {
      ...globalStyles.components.listItem,
      borderBottomColor: colors.border,
    },
    section: {
      ...globalStyles.components.section,
    },
    sectionHeader: {
      ...globalStyles.components.sectionHeader,
    },

    // Text styles
    text: {
      ...globalStyles.typography.body,
      color: colors.foreground,
    },
    textSecondary: {
      ...globalStyles.typography.body,
      color: colors.secondaryForeground,
    },
    textMuted: {
      ...globalStyles.typography.caption,
      color: colors.mutedForeground,
    },
    textPrimary: {
      ...globalStyles.typography.body,
      color: colors.primary,
    },
    textAccent: {
      ...globalStyles.typography.body,
      color: colors.accent,
    },

    // Typography styles - STATIC sizes for application UI (not affected by font size setting)
    h1: {
      ...globalStyles.typography.h1,
      fontSize: Math.round(STATIC_BASE_FONT_SIZE * 1.6), // Static 32px
      color: colors.foreground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '700', // Bold weight
    },
    h2: {
      ...globalStyles.typography.h2,
      fontSize: Math.round(STATIC_BASE_FONT_SIZE * 1.4), // Static 28px
      color: colors.foreground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '700', // Bold weight
    },
    h3: {
      ...globalStyles.typography.h3,
      fontSize: Math.round(STATIC_BASE_FONT_SIZE * 1.2), // Static 24px
      color: colors.foreground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '700', // Bold weight
    },
    h4: {
      ...globalStyles.typography.h4,
      fontSize: STATIC_BASE_FONT_SIZE, // Static 20px
      color: colors.foreground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '700', // Bold weight
    },
    body: {
      ...globalStyles.typography.body,
      fontSize: Math.round(STATIC_BASE_FONT_SIZE * 0.8), // Static 16px for UI
      color: colors.foreground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '400', // Regular weight
    },
    bodyLarge: {
      ...globalStyles.typography.bodyLarge,
      fontSize: STATIC_BASE_FONT_SIZE, // Static 20px
      color: colors.foreground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '400', // Regular weight
    },
    caption: {
      ...globalStyles.typography.caption,
      fontSize: Math.round(STATIC_BASE_FONT_SIZE * 0.7), // Static 14px
      color: colors.mutedForeground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '400', // Regular weight
    },
    small: {
      ...globalStyles.typography.small,
      fontSize: Math.round(STATIC_BASE_FONT_SIZE * 0.6), // Static 12px
      color: colors.mutedForeground,
      fontFamily: 'Lato', // Lato Sans-serif for English
      fontWeight: '400', // Regular weight
    },
    arabic: {
      ...globalStyles.typography.arabic,
      fontFamily: getArabicFontFamily(),
      fontSize: getFontSizeValue(), // 20px for normal
      lineHeight: Math.round(getFontSizeValue() * 2.2), // Increased line height for better Arabic spacing
      color: colors.foreground,
    },
    arabicLarge: {
      ...globalStyles.typography.arabicLarge,
      fontFamily: getArabicFontFamily(),
      fontSize: Math.round(getFontSizeValue() * 1.2), // 24px for normal
      lineHeight: Math.round(getFontSizeValue() * 2.5), // Increased line height for better Arabic spacing
      color: colors.foreground,
    },

    // Border and background
    border: {
      borderColor: colors.border,
    },
    background: {
      backgroundColor: colors.background,
    },
  });

  const themeStyles: ThemeStyles = {
    colors,
    styles: {
      ...styles,
      globalStyles,
    },
  };

  return (
    <ThemeContext.Provider value={themeStyles}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeStyles => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
