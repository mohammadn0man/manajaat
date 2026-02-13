import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Share, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

import TopBar from '../components/TopBar';
import IconButton from '../components/IconButton';
import DuaCard from '../components/DuaCard';
import { Dua } from '../types/dua';
import { getDuasData } from '../services/dataLoader';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeProvider';
import { getTranslation, isLanguageRTL } from '../utils/translationUtils';
import { fontFamilies } from '../config/fonts';

type DuaDetailScreenRouteProp = RouteProp<RootStackParamList, 'DuaDetail'>;

interface DuaDetailScreenProps {
  route: DuaDetailScreenRouteProp;
}

const DuaDetailScreen: React.FC<DuaDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { duaId } = route.params;
  const [dua, setDua] = useState<Dua | null>(null);
  const {
    isFavorite: isDuaFavorite,
    toggleFavorite,
    language,
    getFontSizeValue,
    isRTL,
  } = useApp();
  const { styles, colors } = useTheme();

  useEffect(() => {
    const allDuas = getDuasData();
    const foundDua = allDuas.find((d) => d.id === duaId);
    setDua(foundDua || null);
  }, [duaId]);

  const handleFavoriteToggle = async () => {
    await toggleFavorite(duaId);
  };

  const handleCopy = async () => {
    if (!dua) return;

    const translation = getTranslation(dua, language);
    const textToCopy = `${dua.arabic}\n\n${translation}\n\n${dua.reference || ''}`;

    try {
      await Clipboard.setStringAsync(textToCopy);
      Alert.alert('Copied', 'Dua has been copied to clipboard');
    } catch {
      Alert.alert('Error', 'Failed to copy dua');
    }
  };

  const handleShare = async () => {
    if (!dua) return;

    const translation = getTranslation(dua, language);
    const shareText = `${dua.arabic}\n\n${translation}\n\n${dua.reference || ''}\n\n#MunajaatNomani`;

    try {
      await Share.share({
        message: shareText,
        title: 'Dua from Munajaat Nomani',
      });
    } catch {
      Alert.alert('Error', 'Failed to share dua');
    }
  };

  if (!dua) {
    return (
      <View style={styles.container}>
        <TopBar title="Dua Not Found" showBackButton />
        <View style={[styles.centerContent, { flex: 1, padding: 20 }]}>
          <Text style={styles.textMuted}>Dua not found</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TopBar
        title="Dua Details"
        showBackButton
        onBackPress={() => navigation.goBack()}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          paddingBottom: 120,
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        bounces={true}
        scrollEnabled={true}
      >
        {/* Arabic Card */}
        <DuaCard
          dua={dua}
          compact={false}
          showActions={true}
          onFavoritePress={handleFavoriteToggle}
          onSpeakerPress={() => {
            // Show alert for now (can be replaced with toast later)
            Alert.alert('Coming Soon', 'Audio recitation feature coming soon');
          }}
          isFavorite={isDuaFavorite(duaId)}
        />

        {/* Translation */}
        {(() => {
          const translation = getTranslation(dua, language);
          const isTranslationRTL = isLanguageRTL(language);
          
          if (!translation) {
            return null;
          }

          return (
            <View
              style={{
                marginTop: 24,
                paddingHorizontal: 8,
              }}
            >
              <Text
                style={[
                  styles.body,
                  {
                    color: colors.foreground,
                    fontFamily: isTranslationRTL 
                      ? fontFamilies.urdu 
                      : fontFamilies.latin,
                    fontSize: Math.round(getFontSizeValue() * 0.95), // Dynamic font size for content
                    // Increased line height for Urdu to match Arabic spacing
                    lineHeight: isTranslationRTL 
                      ? Math.round(getFontSizeValue() * 0.95 * 1.8) 
                      : 24,
                    textAlign: isTranslationRTL ? 'right' : 'left',
                    // Add generous padding for Urdu text to prevent trimming (similar to Arabic)
                    paddingTop: isTranslationRTL ? Math.max(8, Math.round(getFontSizeValue() * 0.25)) : 0,
                    paddingBottom: isTranslationRTL ? Math.max(8, Math.round(getFontSizeValue() * 0.25)) : 0,
                  },
                ]}
              >
                {translation}
              </Text>
            </View>
          );
        })()}

        {/* Reference */}
        {dua.reference && (
          <View
            style={{
              marginTop: 16,
              paddingHorizontal: 8,
            }}
          >
            <Text
              style={[
                styles.textMuted,
                {
                  fontSize: Math.round(getFontSizeValue() * 0.7), // Dynamic font size (14px for normal)
                  fontStyle: 'italic',
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {dua.reference}
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={[
          styles.rowCenter,
          styles.border,
          {
            borderTopWidth: 1,
            paddingVertical: styles.globalStyles.spacing.lg,
          },
        ]}
      >
        <View style={styles.row}>
          <IconButton
            iconName="copy-outline"
            onPress={handleCopy}
            backgroundColor={colors.muted}
            color={colors.primary}
            accessibilityLabel="Copy dua"
            accessibilityHint="Copy this dua to clipboard"
          />
          <IconButton
            iconName="share-outline"
            onPress={handleShare}
            backgroundColor={colors.muted}
            color={colors.primary}
            accessibilityLabel="Share dua"
            accessibilityHint="Share this dua with others"
          />
        </View>
      </View>
    </View>
  );
};

export default DuaDetailScreen;
