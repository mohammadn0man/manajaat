import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeProvider';
import { BlurView } from 'expo-blur';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  onBackPress,
  showBackButton = false,
  rightComponent,
}) => {
  const { colors, styles } = useTheme();

  return (
    <View style={localStyles.container}>
      {/* Glassmorphism Background */}
      <BlurView
        intensity={80}
        tint="systemChromeMaterialLight"
        style={localStyles.blurContainer}
      >
        {/* Tinted Overlay */}
        <View
          style={[
            localStyles.glassOverlay,
            {
              backgroundColor: `${colors.primary}CC`, // 80% opacity
            },
          ]}
        />
        
        {/* Content */}
        <View style={[styles.rowBetween, localStyles.contentContainer]}>
          <View style={{ width: 40, alignItems: 'flex-start' }}>
            {showBackButton && (
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
            )}
          </View>

          <View style={styles.columnCenter}>
            <Text
              style={[
                styles.h3,
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

          <View style={{ width: 40, alignItems: 'flex-end' }}>
            {rightComponent}
          </View>
        </View>
      </BlurView>
      
      {/* Bottom Border Highlight */}
      <View
        style={[
          localStyles.borderHighlight,
          {
            backgroundColor: `${colors.primaryForeground}33`,
          },
        ]}
      />
    </View>
  );
};

const localStyles = StyleSheet.create({
  container: {
    position: 'relative',
    overflow: 'hidden',
  },
  blurContainer: {
    overflow: 'hidden',
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    paddingTop: 48,
    paddingBottom: 24,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  contentContainer: {
    paddingHorizontal: 24,
  },
  iconButton: {
    padding: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  borderHighlight: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 1,
  },
});

export default TopBar;
