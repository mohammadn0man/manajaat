import React from 'react';
import { Text, TextProps } from 'react-native';
import { useApp } from '../contexts/AppContext';
import { fontFamilies } from '../config/fonts';

export interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'body' | 'caption' | 'arabic' | 'urdu';
  weight?: 'regular' | 'medium' | 'semiBold' | 'bold';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: 'primary' | 'secondary' | 'muted' | 'accent' | 'error' | 'success';
  align?: 'left' | 'center' | 'right' | 'auto';
  children: React.ReactNode;
}

const Typography: React.FC<TypographyProps> = ({
  variant = 'body',
  weight = 'regular',
  size,
  color = 'primary',
  align = 'auto',
  children,
  style,
  ...props
}) => {
  const { language, isRTL, getFontSizeValue, isDarkMode } = useApp();

  // Determine font family based on content and language
  const getFontFamily = (): string => {
    // Check if content contains Arabic characters
    const hasArabic = /[\u0600-\u06FF]/.test(String(children));
    // Check if content contains Urdu characters
    const hasUrdu = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(String(children));
    
    if (hasArabic || language === 'ar') {
      return weight === 'bold' ? fontFamilies.arabicBold : fontFamilies.arabic;
    }
    
    if (hasUrdu || language === 'ur') {
      return weight === 'bold' ? fontFamilies.urduBold : fontFamilies.urdu;
    }
    
    // Default to Latin fonts
    switch (weight) {
      case 'medium':
        return fontFamilies.latinMedium;
      case 'semiBold':
        return fontFamilies.latinSemiBold;
      case 'bold':
        return fontFamilies.latinBold;
      default:
        return fontFamilies.latin;
    }
  };

  // Get font size based on variant and size prop
  const getFontSize = (): number => {
    if (size) {
      const sizeMap = {
        xs: 12,
        sm: 14,
        base: 16,
        lg: 18,
        xl: 20,
        '2xl': 24,
        '3xl': 30,
        '4xl': 36,
      };
      return sizeMap[size];
    }

    // Use context font size for Arabic text
    if (variant === 'arabic') {
      return getFontSizeValue();
    }

    // Default sizes for variants
    const variantSizes = {
      h1: 32,
      h2: 28,
      h3: 24,
      h4: 20,
      body: 16,
      caption: 14,
      arabic: getFontSizeValue(),
      urdu: 18,
    };

    return variantSizes[variant];
  };

  // Get text alignment
  const getTextAlign = (): 'left' | 'center' | 'right' => {
    if (align === 'auto') {
      // Auto-align based on RTL state
      return isRTL ? 'right' : 'left';
    }
    return align;
  };

  // Get writing direction
  const getWritingDirection = (): 'ltr' | 'rtl' => {
    const hasArabic = /[\u0600-\u06FF]/.test(String(children));
    const hasUrdu = /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/.test(String(children));
    
    if (hasArabic || hasUrdu || language === 'ar' || language === 'ur') {
      return 'rtl';
    }
    return 'ltr';
  };

  const typographyStyle = {
    fontFamily: getFontFamily(),
    fontSize: getFontSize(),
    textAlign: getTextAlign(),
    writingDirection: getWritingDirection(),
    ...getColorStyle(color, isDarkMode),
    ...getVariantStyle(variant),
  };

  return (
    <Text
      style={[typographyStyle, style]}
      {...props}
    >
      {children}
    </Text>
  );
};

// Color styles with dark mode support
const getColorStyle = (color: string, isDarkMode: boolean) => {
  const lightColors = {
    primary: { color: '#111827' }, // gray-900
    secondary: { color: '#374151' }, // gray-700
    muted: { color: '#6b7280' }, // gray-500
    accent: { color: '#4F46E5' }, // indigo-600
    error: { color: '#EF4444' }, // red-500
    success: { color: '#10B981' }, // emerald-500
  };

  const darkColors = {
    primary: { color: '#F8FAFC' }, // slate-50
    secondary: { color: '#CBD5E1' }, // slate-300
    muted: { color: '#94A3B8' }, // slate-400
    accent: { color: '#818CF8' }, // indigo-400
    error: { color: '#F87171' }, // red-400
    success: { color: '#34D399' }, // emerald-400
  };

  const colors = isDarkMode ? darkColors : lightColors;
  return colors[color as keyof typeof colors] || colors.primary;
};

// Variant-specific styles
const getVariantStyle = (variant: string) => {
  const variants = {
    h1: { fontWeight: '700' as const, lineHeight: 40 },
    h2: { fontWeight: '600' as const, lineHeight: 36 },
    h3: { fontWeight: '600' as const, lineHeight: 32 },
    h4: { fontWeight: '500' as const, lineHeight: 28 },
    body: { fontWeight: '400' as const, lineHeight: 24 },
    caption: { fontWeight: '400' as const, lineHeight: 20 },
    arabic: { fontWeight: '600' as const, lineHeight: 32 },
    urdu: { fontWeight: '400' as const, lineHeight: 28 },
  };
  return variants[variant as keyof typeof variants] || variants.body;
};

export default Typography;
