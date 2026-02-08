import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { ThemeProvider } from './src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';
import {
  Lato_400Regular,
  Lato_700Bold,
} from '@expo-google-fonts/lato';
import { scheduleNotifications } from './src/services/notificationService';

// Disable device font scaling globally - app will use static font sizes
// controlled only by the app's font size settings
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.allowFontScaling = false;

(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.allowFontScaling = false;

function AppContent() {
  const { colorScheme, notificationsEnabled } = useApp();

  // Initialize notifications on app start if enabled
  useEffect(() => {
    const initializeNotifications = async () => {
      if (notificationsEnabled) {
        try {
          // Reschedule notifications daily on app start
          await scheduleNotifications();
          console.log('Notifications initialized and scheduled');
        } catch (error) {
          console.error('Error initializing notifications:', error);
        }
      }
    };

    initializeNotifications();
  }, [notificationsEnabled]);

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
