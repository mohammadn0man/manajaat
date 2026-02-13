import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';

import HomeScreen from '../screens/HomeScreen';
import DayViewScreen from '../screens/DayViewScreen';
import DaysListScreen from '../screens/DaysListScreen';
import DuaDetailScreen from '../screens/DuaDetailScreen';
import FavoritesScreen from '../screens/FavoritesScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { RootStackParamList, MainTabParamList } from './types';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const MainTabs: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { colorScheme, tabBarHidden } = useApp();
  const tabBarBg = colorScheme === 'dark' ? '#1E293B' : colors.background;

  const baseTabBarStyle = {
    position: 'absolute' as const,
    backgroundColor: Platform.OS === 'android' ? tabBarBg : 'transparent',
    borderTopWidth: 0,
    elevation: Platform.OS === 'android' ? 8 : 0,
    height: 72,
    paddingBottom: 8,
    paddingTop: 8,
    borderRadius: 30,
    marginHorizontal: 20,
    marginBottom: Math.max(insets.bottom, 20),
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  };

  return (
    <Tab.Navigator
      screenOptions={({ route, navigation }) => {
        const state = navigation.getState();
        const currentRouteName = state?.routes?.[state.index]?.name;
        const shouldHideTabBar = currentRouteName === 'Home' && tabBarHidden;
        return {
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Days') {
            iconName = focused ? 'calendar' : 'calendar-outline';
          } else if (route.name === 'Favorites') {
            iconName = focused ? 'heart' : 'heart-outline';
          } else if (route.name === 'Settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else {
            iconName = 'help-outline';
          }

          const iconSize = typeof size === 'number' && size > 0 ? size : 24;
          const iconColor = focused ? colors.primary : color;
          return (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor}
            />
          );
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.mutedForeground,
        headerShown: false,
        tabBarStyle: shouldHideTabBar
          ? { ...baseTabBarStyle, display: 'none' as const }
          : baseTabBarStyle,
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === 'ios' ? 80 : 0}
            tint={colorScheme === 'dark' ? 'dark' : 'light'}
            style={[
              StyleSheet.absoluteFill,
              {
                overflow: 'hidden',
                borderRadius: 30,
                backgroundColor: Platform.OS === 'android' ? tabBarBg : undefined,
              },
            ]}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          fontFamily: 'Lato',
        },
        tabBarButton: (props) => {
          const { onPress, ...rest } = props;
          return (
            <TouchableOpacity
              {...rest}
              onPress={(e) => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onPress?.(e);
              }}
              activeOpacity={0.7}
            />
          );
        },
      };
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Days" component={DaysListScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

const AppNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="MainTabs" component={MainTabs} />
        <Stack.Screen
          name="DayView"
          component={DayViewScreen}
          options={{
            headerTitle: '',
            headerStyle: {
              backgroundColor: colors.primary,
            },
            headerTintColor: colors.primaryForeground,
          }}
        />
        <Stack.Screen
          name="DuaDetail"
          component={DuaDetailScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
