import React from 'react';
import { View, Text, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

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
  const { styles } = useTheme();

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
      <View style={[styles.row, styles.globalStyles.spacingUtils.mb('lg')]}>
        <Ionicons name={icon} size={20} color="#2596be" />
        <Text style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}>
          {title}
        </Text>
      </View>
      <View style={[styles.card, { padding: 0, marginBottom: 0 }]}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.listItem,
              currentValue === option.value && { backgroundColor: '#eef4f7ff' },
            ]}
            onPress={async () => await onSelect(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: currentValue === option.value }}
            accessibilityLabel={option.label}
          >
            <Text
              style={[
                styles.body,
                currentValue === option.value && styles.textPrimary,
              ]}
            >
              {option.label}
            </Text>
            {currentValue === option.value && (
              <Ionicons name="checkmark" size={20} color="#2596be" />
            )}
          </TouchableOpacity>
        ))}
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
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('lg')]}>
            <Ionicons name="heart" size={20} color="#EF4444" />
            <Text
              style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}
            >
              Favorites
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.button,
              styles.row,
              {
                backgroundColor: '#FEF2F2',
                borderColor: '#FECACA',
                borderWidth: 1,
              },
            ]}
            onPress={handleClearFavorites}
            disabled={favorites.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Clear all favorites"
            accessibilityHint="Removes all duas from your favorites list"
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text
              style={[
                styles.body,
                {
                  color: '#EF4444',
                  marginLeft: styles.globalStyles.spacing.sm,
                },
              ]}
            >
              Clear All Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('lg')]}>
            <Ionicons name="information-circle" size={20} color="#6b7280" />
            <Text
              style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}
            >
              About
            </Text>
          </View>
          <View style={styles.card}>
            <Text style={styles.h4}>Manajaat Nomani v1.0.0</Text>
            <Text
              style={[
                styles.textMuted,
                styles.globalStyles.spacingUtils.mt('xs'),
              ]}
            >
              A beautiful app for daily Islamic supplications
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
