import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';

interface DuaCardProps {
  dua: Dua;
  onPress?: (dua: Dua) => void;
  compact?: boolean;
}

const DuaCard: React.FC<DuaCardProps> = ({
  dua,
  onPress,
  compact = false,
}) => {
  const { styles } = useTheme();
  const { getFontSizeValue, getArabicFontFamily } = useApp();

  const arabicFontSize = getFontSizeValue();

  // Add extra padding for large font sizes to prevent text cutting
  const getDynamicPadding = () => {
    if (arabicFontSize >= 24) {
      // Large font size
      return {
        paddingHorizontal: 20,
        paddingTop: 20, // Increased for Arabic characters
        paddingBottom: 20, // 25% less than top
        marginHorizontal: 4,
        marginVertical: 4,
      };
    } else if (arabicFontSize >= 20) {
      // Normal font size
      return {
        paddingHorizontal: 16,
        paddingTop: 24, // Increased for Arabic characters
        paddingBottom: 18, // 25% less than top
        marginHorizontal: 2,
        marginVertical: 2,
      };
    }
    return {
      paddingTop: 16, // Add some padding even for small font size
      paddingBottom: 12, // 25% less than top
    };
  };

  const dynamicPadding = getDynamicPadding();

  return (
    <TouchableOpacity
      style={[compact ? styles.cardCompact : styles.card, dynamicPadding]}
      onPress={() => onPress?.(dua)}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`Dua: ${dua.arabic.substring(0, 50)}...`}
      accessibilityHint={onPress ? 'Tap to view full dua details' : undefined}
    >
      <Text
        style={[
          compact ? styles.arabic : styles.arabicLarge,
          {
            fontFamily: getArabicFontFamily(),
            fontWeight: 'normal', // Ensure no conflicting font weight
          },
        ]}
      >
        {dua.arabic}
      </Text>
    </TouchableOpacity>
  );
};

export default DuaCard;
