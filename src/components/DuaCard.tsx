import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';

interface DuaCardProps {
  dua: Dua;
  onPress: (dua: Dua) => void;
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
  const { language } = useApp();
  
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
  
  return (
    <TouchableOpacity
      style={compact ? styles.cardCompact : styles.card}
      onPress={() => onPress(dua)}
      accessibilityRole="button"
      accessibilityLabel={`Dua: ${dua.arabic.substring(0, 50)}...`}
      accessibilityHint="Tap to view full dua details"
    >
      <Text style={compact ? styles.arabic : styles.arabicLarge}>
        {dua.arabic}
      </Text>
      
      {translation && (
        <Text style={[styles.textSecondary, styles.globalStyles.spacingUtils.mt('sm')]}>
          {translation}
        </Text>
      )}
      
      {showReference && dua.reference && (
        <Text style={[styles.textMuted, styles.globalStyles.spacingUtils.mt('sm'), { fontStyle: 'italic' }]}>
          {dua.reference}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default DuaCard;
