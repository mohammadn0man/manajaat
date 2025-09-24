import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Dua } from '../types/dua';

interface DuaCardProps {
  dua: Dua;
  onPress: (dua: Dua) => void;
  showReference?: boolean;
  compact?: boolean;
}

const DuaCard: React.FC<DuaCardProps> = ({
  dua,
  onPress,
  showReference = true,
  compact = false,
}) => (
  <TouchableOpacity
    style={[styles.container, compact && styles.compactContainer]}
    onPress={() => onPress(dua)}
    accessibilityRole="button"
    accessibilityLabel={`Dua: ${dua.arabic.substring(0, 50)}...`}
    accessibilityHint="Tap to view full dua details"
  >
    <Text style={[styles.arabicText, compact && styles.compactArabicText]}>
      {dua.arabic}
    </Text>
    
    {dua.translations.ur && (
      <Text style={[styles.translationText, compact && styles.compactTranslationText]}>
        {dua.translations.ur}
      </Text>
    )}
    
    {showReference && dua.reference && (
      <Text style={[styles.referenceText, compact && styles.compactReferenceText]}>
        {dua.reference}
      </Text>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  compactContainer: {
    padding: 12,
    marginBottom: 8,
  },
  arabicText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
    textAlign: 'right',
    lineHeight: 28,
  },
  compactArabicText: {
    fontSize: 16,
    lineHeight: 22,
  },
  translationText: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 8,
    lineHeight: 22,
  },
  compactTranslationText: {
    fontSize: 14,
    lineHeight: 20,
  },
  referenceText: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
  },
  compactReferenceText: {
    fontSize: 12,
  },
});

export default DuaCard;
