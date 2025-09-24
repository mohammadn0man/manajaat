import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/contexts/AppContext';
import { ThemeProvider } from './src/contexts/ThemeProvider';
import { loadFonts } from './src/config/fonts';

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
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error initializing app:', error);
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    };

    initializeApp();
  }, []);

  if (!fontsLoaded) {
    return null; // Or a loading screen
  }

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
