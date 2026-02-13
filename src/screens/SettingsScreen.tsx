import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

import { useApp } from '../contexts/AppContext';
import { Language, Theme, FontSize, ArabicFont } from '../services/storageService';
import TopBar from '../components/TopBar';
import { useTheme } from '../contexts/ThemeProvider';
import { globalStyles } from '../styles/globalStyles';

const SettingsScreen: React.FC = () => {
  const [expandedDropdown, setExpandedDropdown] = useState<string | null>(null);
  const {
    language,
    theme,
    fontSize,
    arabicFont,
    favorites,
    setLanguage,
    setTheme,
    setFontSize,
    setArabicFont,
    clearFavorites,
  } = useApp();
  const { styles, colors } = useTheme();

  const languageOptions: { value: Language; label: string }[] = [
    { value: 'en', label: 'English' },
    { value: 'ur', label: 'اردو (Urdu)' },
    { value: 'rom-ur', label: 'Roman Urdu' },
  ];

  const fontSizeOptions: { value: FontSize; label: string }[] = [
    { value: 'small', label: 'Small' },
    { value: 'normal', label: 'Normal' },
    { value: 'large', label: 'Large' },
    { value: 'extra-large', label: 'Extra Large' },
  ];

  const arabicFontOptions: { value: ArabicFont; label: string }[] = [
    { value: 'indopak', label: 'Indopak Nastaleeq' },
    { value: 'amiri', label: 'Amiri' },
    { value: 'jameel', label: 'Jameel Noori Nastaleeq' },
    { value: 'almajeed', label: 'Al Majeed Quranic' },
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

  const settingCard = {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    ...globalStyles.shadows.sm,
  };

  const renderDropdownSelector = <T extends string>(
    id: string,
    title: string,
    options: { value: T; label: string }[],
    currentValue: T,
    onSelect: (value: T) => Promise<void>,
    icon: keyof typeof Ionicons.glyphMap
  ) => {
    const isExpanded = expandedDropdown === id;
    const currentLabel = options.find((opt) => opt.value === currentValue)?.label || '';

    return (
      <View style={styles.section}>
        <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
          <Ionicons name={icon} size={22} color={colors.primary} />
          <Text style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}>
            {title}
          </Text>
        </View>
        <TouchableOpacity
          style={[settingCard, { marginBottom: isExpanded ? 8 : 0 }]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setExpandedDropdown(isExpanded ? null : id);
          }}
          accessibilityRole="button"
          accessibilityLabel={`${title}: ${currentLabel}`}
        >
          <View style={styles.rowBetween}>
            <Text style={[styles.body, { color: colors.primary, fontWeight: '600' }]}>
              {currentLabel}
            </Text>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-forward'}
              size={20}
              color={colors.mutedForeground}
            />
          </View>
        </TouchableOpacity>
        {isExpanded && (
          <View style={settingCard}>
            {options.map((option, index) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.listItem,
                  index !== options.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  },
                ]}
                onPress={async () => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  await onSelect(option.value);
                  setExpandedDropdown(null);
                }}
                accessibilityRole="radio"
                accessibilityState={{ checked: currentValue === option.value }}
                accessibilityLabel={option.label}
              >
                <Text
                  style={[
                    styles.body,
                    {
                      color: currentValue === option.value ? colors.primary : colors.foreground,
                      fontWeight: currentValue === option.value ? '600' : '400',
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
        )}
      </View>
    );
  };

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
        {/* Font Size - Segmented control */}
        <View style={styles.section}>
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
            <Ionicons name="text" size={22} color={colors.primary} />
            <Text style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}>
              Font Size
            </Text>
          </View>
          <View style={localStyles.segmentedRow}>
            {fontSizeOptions.map((opt) => {
              const isSelected = fontSize === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[
                    localStyles.segmentButton,
                    {
                      backgroundColor: isSelected ? colors.primary : colors.card,
                      borderWidth: isSelected ? 0 : 1,
                      borderColor: colors.border,
                    },
                  ]}
                  onPress={async () => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                    await setFontSize(opt.value);
                  }}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: isSelected }}
                  accessibilityLabel={opt.label}
                >
                  <Text
                    style={[
                      styles.caption,
                      {
                        fontWeight: '600',
                        color: isSelected ? '#FFFFFF' : colors.foreground,
                      },
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {renderDropdownSelector(
          'arabicFont',
          'Arabic Font',
          arabicFontOptions,
          arabicFont,
          setArabicFont,
          'text-outline'
        )}

        {renderDropdownSelector(
          'language',
          'Translation Language',
          languageOptions,
          language,
          setLanguage,
          'language'
        )}

        {/* Theme - Toggle / dropdown */}
        <View style={styles.section}>
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
            <Ionicons name="color-palette" size={22} color={colors.primary} />
            <Text style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}>
              Theme
            </Text>
          </View>
          <View style={[settingCard, styles.rowBetween]}>
            <Text style={styles.body}>Dark mode</Text>
            <Switch
              value={theme === 'dark'}
              onValueChange={async (value) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                await setTheme(value ? 'dark' : 'light');
              }}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
            <Ionicons name="heart" size={22} color={colors.destructive} />
            <Text style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}>
              Favorites
            </Text>
          </View>
          <TouchableOpacity
            style={[
              settingCard,
              {
                flexDirection: 'row',
                alignItems: 'center',
                opacity: favorites.length === 0 ? 0.5 : 1,
                borderWidth: 1,
                borderColor: colors.destructive,
              },
            ]}
            onPress={handleClearFavorites}
            disabled={favorites.length === 0}
            accessibilityRole="button"
            accessibilityLabel="Clear all favorites"
          >
            <Ionicons name="trash" size={22} color={colors.destructive} />
            <Text
              style={[
                styles.body,
                {
                  color: colors.destructive,
                  marginLeft: styles.globalStyles.spacing.sm,
                  fontWeight: '600',
                },
              ]}
            >
              Clear All Favorites ({favorites.length})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={[styles.row, styles.globalStyles.spacingUtils.mb('md')]}>
            <Ionicons name="information-circle" size={22} color={colors.primary} />
            <Text style={[styles.h4, styles.globalStyles.spacingUtils.ml('sm')]}>
              About
            </Text>
          </View>
          <View
            style={[
              settingCard,
              { backgroundColor: colors.muted },
            ]}
          >
            <Text style={[styles.h4, { fontWeight: '600' }]}>
              Munajaat Nomani v1.0.0
            </Text>
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

const localStyles = StyleSheet.create({
  segmentedRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -4,
  },
  segmentButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 72,
    alignItems: 'center',
    margin: 4,
  },
});

export default SettingsScreen;
