import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import { AppProvider } from './src/contexts/AppContext';

export default function App() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <AppNavigator />
        <StatusBar style="light" />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
