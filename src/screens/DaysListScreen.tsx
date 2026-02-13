import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Animated,
  StyleSheet,
} from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { DayOfWeek } from '../types/dua';
import {
  getAllDays,
  getDayDisplayName,
  getDayDisplayNameUrdu,
  getDuasByDay,
} from '../services/duaService';
import TopBar from '../components/TopBar';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../contexts/ThemeProvider';
import { globalStyles } from '../styles/globalStyles';
import { fontFamilies } from '../config/fonts';

interface DayItemProps {
  day: DayOfWeek;
  index: number;
}

const DayItem: React.FC<DayItemProps> = ({ day, index }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { styles, colors } = useTheme();
  const dayDuas = getDuasByDay(day);
  const dayDisplayName = getDayDisplayName(day);
  const dayDisplayNameUrdu = getDayDisplayNameUrdu(day);
  const animValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: 1,
      duration: 300,
      delay: index * 50,
      useNativeDriver: true,
    }).start();
  }, [index, animValue]);

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('DayView', { day });
  };

  return (
    <Animated.View
      style={{
        opacity: animValue,
        transform: [
          {
            translateY: animValue.interpolate({
              inputRange: [0, 1],
              outputRange: [20, 0],
            }),
          },
        ],
      }}
    >
      <TouchableOpacity
        style={[localStyles.dayCard, { backgroundColor: colors.card }]}
        onPress={handlePress}
        activeOpacity={0.8}
        accessibilityRole="button"
        accessibilityLabel={`${dayDisplayName}, ${dayDuas.length} duas available`}
        accessibilityHint="View duas for this day"
      >
        <View style={styles.rowBetween}>
          <View style={styles.column}>
            <View style={localStyles.dayNameRow}>
              <Text
                style={[
                  styles.h4,
                  { fontSize: 18, fontWeight: '600', color: colors.foreground },
                ]}
              >
                {dayDisplayName}
              </Text>
              <Text
                style={[
                  styles.arabic,
                  {
                    fontSize: 25,
                    fontWeight: 'normal' as const,
                    color: colors.mutedForeground,
                    textAlign: 'right',
                    fontFamily: fontFamilies.urdu,
                  },
                ]}
              >
                {dayDisplayNameUrdu}
              </Text>
            </View>
          </View>
          <View style={localStyles.rightBlock}>
            <Text style={[styles.h3, { color: colors.primary, fontSize: 24 }]}>
              {dayDuas.length} Duas
            </Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={colors.mutedForeground}
              style={styles.globalStyles.spacingUtils.ml('sm')}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const localStyles = StyleSheet.create({
  dayNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dayCard: {
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 8,
    marginVertical: 6,
    ...globalStyles.shadows.md,
  },
  rightBlock: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const DaysListScreen: React.FC = () => {
  const { styles } = useTheme();
  const allDays = getAllDays();

  return (
    <View style={styles.container}>
      <TopBar title="All Days" subtitle="Browse duas by day of the week" />

      <View style={styles.content}>
        <FlatList
          data={allDays}
          keyExtractor={(item) => item}
          renderItem={({ item, index }) => (
            <DayItem day={item} index={index} />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.globalStyles.spacingUtils.py('lg'),
            { paddingBottom: 110 },
          ]}
        />
      </View>
    </View>
  );
};

export default DaysListScreen;
