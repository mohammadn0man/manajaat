import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform, useWindowDimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../contexts/ThemeProvider';
import IslamicPattern from './common/IslamicPattern';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  leftComponent?: React.ReactNode;
  rightComponent?: React.ReactNode;
  /** Optional image/node rendered above title and subtitle, centered */
  centerImage?: React.ReactNode;
  /** When true, use taller header (e.g. Home "Today's Duas") */
  hero?: boolean;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  onBackPress,
  showBackButton = false,
  leftComponent,
  rightComponent,
  centerImage,
  hero = false,
}) => {
  const { colors, styles } = useTheme();
  const { width } = useWindowDimensions();
  const headerHeight = hero ? 200 : 120;

  return (
    <View style={[localStyles.container, { height: headerHeight }]}>
      <LinearGradient
        colors={[colors.primary, colors.secondary]}
        style={[StyleSheet.absoluteFill, localStyles.gradient]}
      />
      <IslamicPattern
        width={width}
        height={headerHeight}
        color="#C9A961"
        opacity={0.6}
      />
      <View style={[styles.rowBetween, localStyles.contentContainer]}>
        <View style={{ width: 40, alignItems: 'flex-start' }}>
          {leftComponent ||
            (showBackButton && (
              <TouchableOpacity
                style={localStyles.iconButton}
                onPress={onBackPress}
                accessibilityRole="button"
                accessibilityLabel="Go back"
                accessibilityHint="Navigate back to previous screen"
              >
                <Ionicons
                  name="arrow-back"
                  size={24}
                  color={colors.primaryForeground}
                />
              </TouchableOpacity>
            ))}
        </View>

        <View style={styles.columnCenter}>
          {centerImage && (
            <View style={localStyles.centerImageWrap}>{centerImage}</View>
          )}
          <Text
            style={[
              hero ? styles.h1 : styles.h3,
              {
                color: colors.primaryForeground,
                textAlign: 'center',
                fontWeight: '600',
              },
            ]}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.body,
                {
                  color: colors.primaryForeground,
                  textAlign: 'center',
                  marginTop: 4,
                  opacity: 0.9,
                },
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        <View style={{ width: 40, alignItems: 'flex-end' }}>{rightComponent}</View>
      </View>

      <View style={[localStyles.borderHighlight, { backgroundColor: colors.accent }]} />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
    paddingTop: Platform.OS === 'ios' ? 48 : 40,
    paddingBottom: 24,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  centerImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  borderHighlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
});

export default TopBar;
