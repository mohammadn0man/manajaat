import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import FavoriteButton from './common/FavoriteButton';
import { globalStyles } from '../styles/globalStyles';

interface DuaCardProps {
  dua: Dua;
  onPress?: (dua: Dua) => void;
  compact?: boolean;
  showActions?: boolean;
  showReference?: boolean;
  onFavoritePress?: () => void;
  onSpeakerPress?: () => void;
  isFavorite?: boolean;
  index?: number;
}

const ACTION_BUTTON_SIZE = 40;

const DuaCard: React.FC<DuaCardProps> = ({
  dua,
  onPress,
  compact = false,
  showActions = false,
  showReference = false,
  onFavoritePress,
  onSpeakerPress,
  isFavorite = false,
  index,
}) => {
  const { styles, colors } = useTheme();
  const { getFontSizeValue, getArabicFontFamily } = useApp();

  const arabicFontSize = getFontSizeValue();

  const cardStyle = compact
    ? [styles.cardCompact, { padding: globalStyles.spacing.lg }]
    : [
        styles.card,
        {
          padding: 24,
          borderRadius: 20,
          ...globalStyles.shadows.lg,
        },
      ];

  return (
    <TouchableOpacity
      style={cardStyle}
      onPress={() => onPress?.(dua)}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityLabel={`Dua: ${dua.arabic.substring(0, 50)}...`}
      accessibilityHint={onPress ? 'Tap to view full dua details' : undefined}
    >
      {showActions && (
        <>
          <View
            style={[
              localStyles.actionCircle,
              { left: 16, top: 16, borderColor: colors.accent },
            ]}
          >
            <TouchableOpacity
              onPress={onSpeakerPress}
              style={localStyles.actionTouch}
              accessibilityRole="button"
              accessibilityLabel="Play audio recitation"
            >
              <Ionicons
                name="volume-high-outline"
                size={20}
                color={colors.primary}
              />
            </TouchableOpacity>
          </View>
          <View
            style={[
              localStyles.actionCircle,
              { right: 16, top: 16, borderColor: colors.accent },
            ]}
          >
            <FavoriteButton
              isFavorite={!!isFavorite}
              onPress={onFavoritePress ?? (() => {})}
              size={20}
            />
          </View>
        </>
      )}

      <Text
        style={[
          compact ? styles.arabic : styles.arabicLarge,
          {
            fontFamily: getArabicFontFamily(),
            fontWeight: 'normal',
            paddingTop: showActions ? 30 : 0,
            lineHeight: compact ? undefined : Math.round(arabicFontSize * 1.2 * 2),
          },
        ]}
      >
        {dua.arabic}
      </Text>

      {showReference && dua.reference && (
        <Text
          style={[
            styles.caption,
            {
              marginTop: 8,
              fontStyle: 'italic',
              color: colors.accent,
            },
          ]}
        >
          {dua.reference}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const localStyles = StyleSheet.create({
  actionCircle: {
    position: 'absolute',
    width: ACTION_BUTTON_SIZE,
    height: ACTION_BUTTON_SIZE,
    borderRadius: ACTION_BUTTON_SIZE / 2,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  actionTouch: {
    padding: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Lato',
    fontWeight: '600',
  },
});

export default DuaCard;
