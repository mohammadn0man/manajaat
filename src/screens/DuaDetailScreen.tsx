import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Share, Alert } from 'react-native';
import { RouteProp, useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

import TopBar from '../components/TopBar';
import IconButton from '../components/IconButton';
import Typography from '../components/Typography';
import { Dua } from '../types/dua';
import { getDuasData } from '../services/dataLoader';
import { RootStackParamList } from '../navigation/types';
import { useApp } from '../contexts/AppContext';
import { useTheme } from '../contexts/ThemeProvider';

type DuaDetailScreenRouteProp = RouteProp<RootStackParamList, 'DuaDetail'>;

interface DuaDetailScreenProps {
  route: DuaDetailScreenRouteProp;
}

const DuaDetailScreen: React.FC<DuaDetailScreenProps> = ({ route }) => {
  const navigation = useNavigation();
  const { duaId } = route.params;
  const [dua, setDua] = useState<Dua | null>(null);
  const { isFavorite: isDuaFavorite, toggleFavorite, language } = useApp();
  const { styles, colors } = useTheme();

  useEffect(() => {
    const allDuas = getDuasData();
    const foundDua = allDuas.find(d => d.id === duaId);
    setDua(foundDua || null);
  }, [duaId]);

  const handleFavoriteToggle = async () => {
    await toggleFavorite(duaId);
  };

  const handleCopy = async () => {
    if (!dua) return;
    
    const translation = language === 'ur' ? dua.translations.ur : 
                      dua.translations.en || dua.translations.ur || '';
    
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
    
    const translation = language === 'ur' ? dua.translations.ur : 
                      dua.translations.en || dua.translations.ur || '';
    
    const shareText = `${dua.arabic}\n\n${translation}\n\n${dua.reference || ''}\n\n#ManajaatNomani`;
    
    try {
      await Share.share({
        message: shareText,
        title: 'Dua from Manajaat Nomani',
      });
    } catch {
      Alert.alert('Error', 'Failed to share dua');
    }
  };

  if (!dua) {
    return (
      <View style={styles.container}>
        <TopBar
          title="Dua Not Found"
          showBackButton
        />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Dua not found</Text>
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
        rightComponent={
          <View style={styles.headerActions}>
            <IconButton
              iconName={isDuaFavorite(duaId) ? 'heart' : 'heart-outline'}
              onPress={handleFavoriteToggle}
              color={isDuaFavorite(duaId) ? '#ef4444' : 'white'}
              accessibilityLabel={isDuaFavorite(duaId) ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityHint="Toggle favorite status for this dua"
            />
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <Typography variant="arabic" color="primary">
            {dua.arabic}
          </Typography>
          
          {(() => {
            const translation = language === 'ur' ? dua.translations.ur : 
                              language === 'ar' ? dua.translations.ar : 
                              dua.translations.en || dua.translations.ur;
            return translation ? (
              <Typography variant="body" color="secondary" style={styles.translationText}>
                {translation}
              </Typography>
            ) : null;
          })()}
          
          {dua.reference && (
            <Typography variant="caption" color="muted" style={styles.referenceText}>
              {dua.reference}
            </Typography>
          )}
        </View>
      </ScrollView>

      <View style={[styles.rowCenter, styles.border, { borderTopWidth: 1, paddingVertical: styles.globalStyles.spacing.lg }]}>
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
