import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { ThemeProvider } from './src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';
import {
  Lato_400Regular,
  Lato_700Bold,
} from '@expo-google-fonts/lato';
import React, { useState, useEffect } from 'react';
import { checkForceUpdate } from './src/services/versionCheck';
import ForceUpdateScreen from './src/screens/ForceUpdateScreen';

// Disable device font scaling globally - app will use static font sizes
// controlled only by the app's font size settings
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;

function AppContent() {
  const { colorScheme } = useApp();
  const [forceUpdate, setForceUpdate] = useState<{ required: boolean; message?: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    checkForceUpdate().then((result) => {
      if (!cancelled && result.updateRequired) {
        setForceUpdate({ required: true, message: result.message });
      }
    });
    return () => { cancelled = true; };
  }, []);

  if (forceUpdate?.required) {
    return (
      <View style={styles.container}>
        <ForceUpdateScreen message={forceUpdate.message} />
        <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AppNavigator />
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    // Arabic fonts (works for Arabic, Urdu, and English!)
    'Amiri-Regular': require('./assets/fonts/Amiri-Regular.ttf'),
    'Amiri-Bold': require('./assets/fonts/Amiri-Bold.ttf'),
    Amiri: require('./assets/fonts/Amiri-Regular.ttf'),
    // Additional Arabic fonts
    'JameelNooriNastaleeqKasheeda': require('./assets/fonts/Jameel-Noori-Nastaleeq-Kasheeda.ttf'),
    'AlMajeedQuranicRegular': require('./assets/fonts/Al-Majeed-Quranic-Regular.ttf'),
    'IndopakNastaleeq': require('./assets/fonts/Indopak-Nastaleeq.ttf'),
    // English/Latin fonts (Lato - Sans-serif from Google Fonts via @expo-google-fonts/lato)
    // Register both the variant names and the base name "Lato"
    'Lato_400Regular': Lato_400Regular,
    'Lato_700Bold': Lato_700Bold,
    'Lato': Lato_400Regular, // Base name alias for easier usage
  });

  // Log font loading status
  if (fontError) {
    console.error('Font loading error:', fontError);
    // Continue anyway with system fonts
  }
  
  if (!fontsLoaded) {
    console.log('Loading fonts...');
    return null; // Loading fonts
  }
  
  console.log('Fonts loaded successfully!');

  return (
    <AppProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
