import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Constants from 'expo-constants';
import { useTheme } from '../contexts/ThemeProvider';

const ANDROID_PACKAGE = 'com.nomani.munajaat';
const PLAY_STORE_URL = `https://play.google.com/store/apps/details?id=${ANDROID_PACKAGE}`;

function getAppStoreUrl(): string {
  const extra = Constants.expoConfig?.extra as Record<string, string> | undefined;
  const id = extra?.iosAppStoreId;
  if (id) return `https://apps.apple.com/app/id${id}`;
  return 'https://apps.apple.com/search?term=Munajaat+Nomani'; // fallback until iosAppStoreId is set in app.json
}

interface ForceUpdateScreenProps {
  message?: string;
}

const ForceUpdateScreen: React.FC<ForceUpdateScreenProps> = ({
  message = 'A new version of Munajaat Nomani is available. Please update to continue using the app.',
}) => {
  const { colors } = useTheme();

  const openStore = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const url = Platform.OS === 'ios' ? getAppStoreUrl() : PLAY_STORE_URL;
    Linking.openURL(url);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + '20' }]}>
          <Ionicons name="cloud-download-outline" size={48} color={colors.primary} />
        </View>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Update required
        </Text>
        <Text style={[styles.message, { color: colors.mutedForeground }]}>
          {message}
        </Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.primary }]}
          onPress={openStore}
          activeOpacity={0.8}
        >
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
            {Platform.OS === 'ios' ? 'Open App Store' : 'Open Play Store'}
          </Text>
          <Ionicons name="open-outline" size={20} color={colors.primaryForeground} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    padding: 28,
    alignItems: 'center',
    maxWidth: 360,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    fontFamily: 'Lato',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontFamily: 'Lato',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    minWidth: 200,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Lato',
  },
});

export default ForceUpdateScreen;
