import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Share, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';

import TopBar from '../components/TopBar';
import IconButton from '../components/IconButton';
import { Dua } from '../types/dua';
import { getDuasData } from '../services/dataLoader';
import { RootStackParamList } from '../navigation/types';

type DuaDetailScreenRouteProp = RouteProp<RootStackParamList, 'DuaDetail'>;

interface DuaDetailScreenProps {
  route: DuaDetailScreenRouteProp;
}

const DuaDetailScreen: React.FC<DuaDetailScreenProps> = ({ route }) => {
  const { duaId } = route.params;
  const [dua, setDua] = useState<Dua | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [fontSize, setFontSize] = useState(24);

  useEffect(() => {
    const allDuas = getDuasData();
    const foundDua = allDuas.find(d => d.id === duaId);
    setDua(foundDua || null);
  }, [duaId]);

  const handleFavoriteToggle = () => {
    setIsFavorite(!isFavorite);
    // TODO: Implement actual favorite storage
  };

  const handleCopy = async () => {
    if (!dua) return;
    
    const textToCopy = `${dua.arabic}\n\n${dua.translations.ur || ''}\n\n${dua.reference || ''}`;
    
    try {
      await Clipboard.setStringAsync(textToCopy);
      Alert.alert('Copied', 'Dua has been copied to clipboard');
    } catch {
      Alert.alert('Error', 'Failed to copy dua');
    }
  };

  const handleShare = async () => {
    if (!dua) return;
    
    const shareText = `${dua.arabic}\n\n${dua.translations.ur || ''}\n\n${dua.reference || ''}`;
    
    try {
      await Share.share({
        message: shareText,
        title: 'Dua from Manajaat Nomani',
      });
    } catch {
      Alert.alert('Error', 'Failed to share dua');
    }
  };

  const handleFontSizeIncrease = () => {
    setFontSize(prev => Math.min(prev + 2, 32));
  };

  const handleFontSizeDecrease = () => {
    setFontSize(prev => Math.max(prev - 2, 16));
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
        rightComponent={
          <View style={styles.headerActions}>
            <IconButton
              iconName={isFavorite ? 'heart' : 'heart-outline'}
              onPress={handleFavoriteToggle}
              color={isFavorite ? '#ef4444' : 'white'}
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityHint="Toggle favorite status for this dua"
            />
          </View>
        }
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.duaContainer}>
          <Text style={[styles.arabicText, { fontSize }]}>
            {dua.arabic}
          </Text>
          
          {dua.translations.ur && (
            <Text style={styles.translationText}>
              {dua.translations.ur}
            </Text>
          )}
          
          {dua.reference && (
            <Text style={styles.referenceText}>
              {dua.reference}
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.controlsContainer}>
        <View style={styles.fontControls}>
          <IconButton
            iconName="remove"
            onPress={handleFontSizeDecrease}
            accessibilityLabel="Decrease font size"
            accessibilityHint="Make the Arabic text smaller"
          />
          <Text style={styles.fontSizeLabel}>{fontSize}px</Text>
          <IconButton
            iconName="add"
            onPress={handleFontSizeIncrease}
            accessibilityLabel="Increase font size"
            accessibilityHint="Make the Arabic text larger"
          />
        </View>

        <View style={styles.actionButtons}>
          <IconButton
            iconName="copy-outline"
            onPress={handleCopy}
            backgroundColor="#f3f4f6"
            color="#4F46E5"
            accessibilityLabel="Copy dua"
            accessibilityHint="Copy this dua to clipboard"
          />
          <IconButton
            iconName="share-outline"
            onPress={handleShare}
            backgroundColor="#f3f4f6"
            color="#4F46E5"
            accessibilityLabel="Share dua"
            accessibilityHint="Share this dua with others"
          />
        </View>
      </View>
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
    paddingHorizontal: 24,
  },
  duaContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  arabicText: {
    fontWeight: 'bold',
    color: '#111827',
    textAlign: 'right',
    lineHeight: 36,
    marginBottom: 16,
  },
  translationText: {
    fontSize: 18,
    color: '#374151',
    lineHeight: 26,
    marginBottom: 16,
  },
  referenceText: {
    fontSize: 16,
    color: '#6b7280',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  controlsContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fontControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fontSizeLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginHorizontal: 12,
    minWidth: 40,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  headerActions: {
    flexDirection: 'row',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#6b7280',
  },
});

export default DuaDetailScreen;
