import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useApp } from '../contexts/AppContext';
import { Language, Theme, FontSize } from '../services/storageService';
import TopBar from '../components/TopBar';

const SettingsScreen: React.FC = () => {
  const { 
    language, 
    theme, 
    fontSize, 
    favorites,
    setLanguage, 
    setTheme, 
    setFontSize, 
    clearFavorites 
  } = useApp();

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'اردو (Urdu)' },
    { value: 'ar', label: 'العربية (Arabic)' },
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
      <View style={styles.sectionHeader}>
        <Ionicons name={icon} size={20} color="#4F46E5" />
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.optionsContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.option,
              currentValue === option.value && styles.selectedOption,
            ]}
            onPress={async () => await onSelect(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: currentValue === option.value }}
            accessibilityLabel={option.label}
          >
            <Text
              style={[
                styles.optionText,
                currentValue === option.value && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
            {currentValue === option.value && (
              <Ionicons name="checkmark" size={20} color="#4F46E5" />
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TopBar
        title="Settings"
        subtitle="Customize your app experience"
      />

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {renderOptionSelector(
          'Language',
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
          <View style={styles.sectionHeader}>
            <Ionicons name="heart" size={20} color="#EF4444" />
            <Text style={styles.sectionTitle}>Favorites</Text>
          </View>
          <TouchableOpacity
            style={styles.dangerButton}
            onPress={handleClearFavorites}
            disabled={favorites.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Clear all favorites"
            accessibilityHint="Removes all duas from your favorites list"
          >
            <Ionicons name="trash" size={20} color="#EF4444" />
            <Text style={styles.dangerButtonText}>
              Clear All Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="information-circle" size={20} color="#6b7280" />
            <Text style={styles.sectionTitle}>About</Text>
          </View>
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              Manajaat Nomani v1.0.0
            </Text>
            <Text style={styles.infoSubtext}>
              A beautiful app for daily Islamic supplications
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  optionsContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  selectedOption: {
    backgroundColor: '#f0f4ff',
  },
  optionText: {
    fontSize: 16,
    color: '#374151',
  },
  selectedOptionText: {
    color: '#4F46E5',
    fontWeight: '500',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#fecaca',
    opacity: 0.7,
  },
  dangerButtonText: {
    fontSize: 16,
    color: '#EF4444',
    marginLeft: 12,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  infoText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  infoSubtext: {
    fontSize: 14,
    color: '#6b7280',
  },
});

export default SettingsScreen;
