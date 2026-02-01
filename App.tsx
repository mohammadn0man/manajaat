import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { ThemeProvider } from './src/contexts/ThemeProvider';
import { useFonts } from 'expo-font';

function AppContent() {
  const { colorScheme } = useApp();

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
