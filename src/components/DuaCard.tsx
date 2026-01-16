import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';

interface DuaCardProps {
  dua: Dua;
  onPress?: (dua: Dua) => void;
  showReference?: boolean;
  compact?: boolean;
}

const DuaCard: React.FC<DuaCardProps> = ({
  dua,
  onPress,
  showReference = true,
  compact = false,
}) => {
  const { styles } = useTheme();
  const { language, getFontSizeValue } = useApp();

  // Get the appropriate translation based on current language
  const getTranslation = () => {
    switch (language) {
      case 'en':
        return dua.translations.en;
      case 'ur':
        return dua.translations.ur;
      default:
        return dua.translations.en;
    }
  };

  const translation = getTranslation();
  const arabicFontSize = getFontSizeValue();

  // Calculate translation font size (proportionally smaller than Arabic)
  // Arabic sizes: small=16, normal=20, large=24
  // Urdu should be 95% (closer to Arabic size), English 85%
  const getTranslationFontSize = () => {
    if (language === 'ur') {
      return arabicFontSize * 0.95;
    }
    return arabicFontSize * 0.85;
  };

  // Calculate reference font size (smaller than translation)
  const getReferenceFontSize = () => {
    return arabicFontSize * 0.75;
  };

  // Add extra padding for large font sizes to prevent text cutting
  const getDynamicPadding = () => {
    if (arabicFontSize >= 24) {
      // Large font size
      return {
        paddingHorizontal: 20,
        paddingVertical: 50, // Increased for Arabic characters
        marginHorizontal: 4,
        marginVertical: 4,
      };
    } else if (arabicFontSize >= 20) {
      // Normal font size
      return {
        paddingHorizontal: 16,
        paddingVertical: 24, // Increased for Arabic characters
        marginHorizontal: 2,
        marginVertical: 2,
      };
    }
    return {
      paddingVertical: 16, // Add some padding even for small font size
    };
  };

  const dynamicPadding = getDynamicPadding();

  return (
    <TouchableOpacity
      style={[compact ? styles.cardCompact : styles.card, dynamicPadding]}
      onPress={() => onPress?.(dua)}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? "button" : "text"}
      accessibilityLabel={`Dua: ${dua.arabic.substring(0, 50)}...`}
      accessibilityHint={onPress ? "Tap to view full dua details" : undefined}
    >
      <Text
        style={[
          compact ? styles.arabic : styles.arabicLarge,
          {
            fontFamily: 'Amiri-Regular',
            fontWeight: 'normal', // Ensure no conflicting font weight
          },
        ]}
      >
        {dua.arabic}
      </Text>

      {translation && (
        <Text
          style={[
            styles.textSecondary,
            styles.globalStyles.spacingUtils.mt('sm'),
            { 
              fontSize: getTranslationFontSize(),
              lineHeight: language === 'ur' ? getTranslationFontSize() * 1.8 : undefined,
            },
          ]}
        >
          {translation}
        </Text>
      )}

      {showReference && dua.reference && (
        <Text
          style={[
            styles.textMuted,
            styles.globalStyles.spacingUtils.mt('sm'),
            { 
              fontStyle: 'italic',
              fontSize: getReferenceFontSize(),
            },
          ]}
        >
          {dua.reference}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default DuaCard;
