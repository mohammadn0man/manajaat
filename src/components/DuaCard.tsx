import React, { memo, useMemo, useCallback } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import { getTranslationForLanguage } from '../utils/translationUtils';
import { getDynamicPadding } from '../utils/styleUtils';

interface DuaCardProps {
  dua: Dua;
  onPress: (dua: Dua) => void;
  showReference?: boolean;
  compact?: boolean;
}

const DuaCard: React.FC<DuaCardProps> = memo(
  ({ dua, onPress, showReference = true, compact = false }) => {
    const { styles } = useTheme();
    const { language, getFontSizeValue } = useApp();

    // Memoized translation
    const translation = useMemo(() => {
      return getTranslationForLanguage(dua.translations, language);
    }, [dua.translations, language]);

    // Memoized dynamic padding
    const memoizedDynamicPadding = useMemo(() => {
      const fontSize = getFontSizeValue();
      return getDynamicPadding(fontSize);
    }, [getFontSizeValue]);

    // Memoized onPress handler
    const handlePress = useCallback(() => {
      onPress(dua);
    }, [onPress, dua]);

    // Memoized card style
    const cardStyle = useMemo(
      () => [
        compact ? styles.cardCompact : styles.card,
        memoizedDynamicPadding,
      ],
      [compact, styles.card, styles.cardCompact, memoizedDynamicPadding]
    );

    // Memoized Arabic text style
    const arabicTextStyle = useMemo(
      () => [
        compact ? styles.arabic : styles.arabicLarge,
        {
          fontFamily: 'Amiri-Regular',
          fontWeight: 'normal',
        },
      ],
      [compact, styles.arabic, styles.arabicLarge]
    );

    // Memoized translation text style
    const translationTextStyle = useMemo(
      () => [styles.textSecondary, styles.globalStyles.spacingUtils.mt('sm')],
      [styles.textSecondary, styles.globalStyles.spacingUtils]
    );

    // Memoized reference text style
    const referenceTextStyle = useMemo(
      () => [
        styles.textMuted,
        styles.globalStyles.spacingUtils.mt('sm'),
        { fontStyle: 'italic' },
      ],
      [styles.textMuted, styles.globalStyles.spacingUtils]
    );

    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`Dua: ${dua.arabic.substring(0, 50)}...`}
        accessibilityHint="Tap to view full dua details"
      >
        <Text style={arabicTextStyle}>{dua.arabic}</Text>

        {translation && <Text style={translationTextStyle}>{translation}</Text>}

        {showReference && dua.reference && (
          <Text style={referenceTextStyle}>{dua.reference}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

DuaCard.displayName = 'DuaCard';

export default DuaCard;
