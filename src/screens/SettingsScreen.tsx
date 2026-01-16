import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';

import { useApp } from '../contexts/AppContext';
import { Language, Theme, FontSize } from '../services/storageService';
import TopBar from '../components/TopBar';
import { useTheme } from '../contexts/ThemeProvider';

const SettingsScreen: React.FC = () => {
  const {
    language,
    theme,
    fontSize,
    favorites,
    setLanguage,
    setTheme,
    setFontSize,
    clearFavorites,
  } = useApp();
  const { styles, colors } = useTheme();

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'اردو (Urdu)' },
  ];

  const themeOptions: { value: Theme; label: string }[] = [
    { value: 'system', label: 'System' },
    { value: 'light', label: 'Light' },
    { value: 'dark', label: 'Dark' },
  ];

  const fontSizeOptions: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
  ];

  const handleClearFavorites = () => {
    Alert.alert(
      'Clear All Favorites',
      'Are you sure you want to remove all duas from your favorites? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await clearFavorites();
          },
        },
      ]
    );
  };

  const renderOptionSelector = <T extends string>(
    title: string,
    options: { value: T; label: string }[],
    currentValue: T,
    onSelect: (value: T) => Promise<void>,
    icon: keyof typeof Ionicons.glyphMap
  ) => (
    <View style={styles.section}>
      <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
        <Ionicons name={icon} size={22} color={colors.primary} />
        <Text style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}>
          {title}
        </Text>
      </View>
      <View
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          marginBottom: 0,
        }}
      >
        <BlurView intensity={80} tint="light" style={{ overflow: 'hidden' }}>
          <View
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
            }}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.listItem,
                  index !== options.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
                  },
                ]}
                onPress={async () => await onSelect(option.value)}
                accessibilityRole="radio"
                accessibilityState={{ checked: currentValue === option.value }}
                accessibilityLabel={option.label}
              >
                {currentValue === option.value && (
                  <View
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: `${colors.primary}22`,
                    }}
                  />
                )}
                <Text
                  style={[
                    styles.body,
                    currentValue === option.value && {
                      color: colors.primary,
                      fontWeight: '600',
                    },
                  ]}
                >
                  {option.label}
                </Text>
                {currentValue === option.value && (
                  <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar title="Settings" subtitle="Customize your app experience" />

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.globalStyles.spacingUtils.py('lg'),
          { paddingBottom: 110 },
        ]}
      >
        {renderOptionSelector(
          'Translation Language',
          languageOptions,
          language,
          setLanguage,
          'language'
        )}

        {renderOptionSelector(
          'Theme',
          themeOptions,
          theme,
          setTheme,
          'color-palette'
        )}

        {renderOptionSelector(
          'Font Size',
          fontSizeOptions,
          fontSize,
          setFontSize,
          'text'
        )}

        <View style={styles.section}>
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
            <Ionicons name="heart" size={22} color="#EF4444" />
            <Text
              style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}
            >
              Favorites
            </Text>
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 20,
              overflow: 'hidden',
              opacity: favorites.length === 0 ? 0.5 : 1,
            }}
            onPress={handleClearFavorites}
            disabled={favorites.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Clear all favorites"
            accessibilityHint="Removes all duas from your favorites list"
          >
            <BlurView
              intensity={80}
              tint="light"
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 16,
                paddingHorizontal: 20,
              }}
            >
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: '#EF444433',
                }}
              />
              <Ionicons name="trash" size={22} color="#EF4444" />
              <Text
                style={[
                  styles.body,
                  {
                    color: '#EF4444',
                    marginLeft: styles.globalStyles.spacing.sm,
                    fontWeight: '600',
                  },
                ]}
              >
                Clear All Favorites ({favorites.length})
              </Text>
            </BlurView>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
            <Ionicons name="information-circle" size={22} color={colors.primary} />
            <Text
              style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}
            >
              About
            </Text>
          </View>
          <View
            style={{
              borderRadius: 20,
              overflow: 'hidden',
            }}
          >
            <BlurView
              intensity={80}
              tint="light"
              style={{
                padding: 20,
              }}
            >
              <View
                style={{
                  ...StyleSheet.absoluteFillObject,
                  backgroundColor: 'rgba(255, 255, 255, 0.3)',
                }}
              />
              <Text style={[styles.h4, { fontWeight: '600' }]}>
                Manajaat Nomani v1.0.0
              </Text>
              <Text
                style={[
                  styles.textMuted,
                  styles.globalStyles.spacingUtils.mt('xs'),
                ]}
              >
                A beautiful app for daily Islamic supplications
              </Text>
            </BlurView>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
