import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import { Dua } from '../types/dua';
import { getTodayDuas, getTodayDayName, getDayDisplayName } from '../services/duaService';
import TopBar from '../components/TopBar';
import DuaCard from '../components/DuaCard';
import { useTheme } from '../contexts/ThemeProvider';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { styles } = useTheme();
  const todayDuas = getTodayDuas();
  const todayDayName = getTodayDayName();
  const todayDisplayName = getDayDisplayName(todayDayName);

  const handleDayPress = () => {
    navigation.navigate('DayView', { day: todayDayName });
  };

  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('DuaDetail', { duaId: dua.id });
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="Read today's duas"
        subtitle={todayDisplayName}
        onBackPress={handleDayPress}
        showBackButton={false}
      />

      <View style={styles.content}>
        {todayDuas.length > 0 ? (
          <FlatList
            data={todayDuas}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <DuaCard
                dua={item}
                onPress={handleDuaPress}
                showReference={true}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.globalStyles.spacingUtils.py('lg')}
          />
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.textMuted}>
              No duas available for today
            </Text>
          </View>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;
