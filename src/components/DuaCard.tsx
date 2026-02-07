import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';

interface DuaCardProps {
  dua: Dua;
  onPress?: (dua: Dua) => void;
  compact?: boolean;
  showActions?: boolean;
  onFavoritePress?: () => void;
  onSpeakerPress?: () => void;
  isFavorite?: boolean;
  index?: number;
}

const DuaCard: React.FC<DuaCardProps> = ({
  dua,
  onPress,
  compact = false,
  showActions = false,
  onFavoritePress,
  onSpeakerPress,
  isFavorite = false,
  index,
}) => {
  const { styles, colors } = useTheme();
  const { getFontSizeValue, getArabicFontFamily } = useApp();

  const arabicFontSize = getFontSizeValue();

  // Add extra padding for large font sizes to prevent text cutting
  const getDynamicPadding = () => {
    // Extra top padding when action buttons are shown to prevent overlap
    const topPaddingOffset = showActions ? 10 : 0;
    
    if (arabicFontSize >= 24) {
      // Large font size
      return {
        paddingHorizontal: 20,
        paddingTop: 20 + topPaddingOffset, // Increased for Arabic characters + buttons
        paddingBottom: 20, // 25% less than top
        marginHorizontal: 4,
        marginVertical: 4,
      };
    } else if (arabicFontSize >= 20) {
      // Normal font size
      return {
        paddingHorizontal: 16,
        paddingTop: 24 + topPaddingOffset, // Increased for Arabic characters + buttons
        paddingBottom: 18, // 25% less than top
        marginHorizontal: 2,
        marginVertical: 2,
      };
    }
    return {
      paddingTop: 16 + topPaddingOffset, // Add some padding even for small font size + buttons
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
      {/* Action Buttons */}
      {showActions && (
        <>
          {/* Speaker Button - Top Left */}
          <TouchableOpacity
            onPress={onSpeakerPress}
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              zIndex: 10,
              padding: 4,
            }}
            accessibilityRole="button"
            accessibilityLabel="Play audio recitation"
            accessibilityHint="Tap to hear the dua recited"
          >
            <Ionicons
              name="volume-high-outline"
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>

          {/* Favorite Button - Top Right */}
          <TouchableOpacity
            onPress={onFavoritePress}
            style={{
              position: 'absolute',
              top: 12,
              right: 12,
              zIndex: 10,
              padding: 4,
            }}
            accessibilityRole="button"
            accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            accessibilityHint="Toggle favorite status for this dua"
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={20}
              color={isFavorite ? '#EF4444' : colors.primary}
            />
          </TouchableOpacity>
        </>
      )}

      {/* Index Badge */}
      {index !== undefined && (
        <Text
          style={{
            position: 'absolute',
            bottom: 12,
            left: 12,
            backgroundColor: colors.primary,
            color: '#FFFFFF',
            paddingHorizontal: 8,
            paddingVertical: 4,
            borderRadius: 12,
            fontSize: 12,
            fontWeight: '600',
          }}
        >
          #{index + 1}
        </Text>
      )}

      <Text
        style={[
          compact ? styles.arabic : styles.arabicLarge,
          {
            fontFamily: getArabicFontFamily(),
            fontWeight: 'normal', // Ensure no conflicting font weight
            paddingTop: 8, // Add a little padding before Arabic text
          },
        ]}
      >
        {dua.arabic}
      </Text>
    </TouchableOpacity>
  );
};

export default DuaCard;
