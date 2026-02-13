import React from 'react';
import { View, FlatList } from 'react-native';
import {
  RouteProp,
  useNavigation,
  NavigationProp,
} from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Dua } from '../types/dua';
import { getDuasByDay, getDayDisplayName } from '../services/duaService';
import TopBar from '../components/TopBar';
import DuaCard from '../components/DuaCard';
import EmptyState from '../components/common/EmptyState';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../contexts/ThemeProvider';

type DayViewScreenRouteProp = RouteProp<RootStackParamList, 'DayView'>;

interface DayViewScreenProps {
  route: DayViewScreenRouteProp;
}

const DayViewScreen: React.FC<DayViewScreenProps> = ({ route }) => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { styles, colors } = useTheme();
  const { day } = route.params;
  const dayDuas = getDuasByDay(day);
  const dayDisplayName = getDayDisplayName(day);

  const handleDuaPress = (dua: Dua) => {
    navigation.navigate('DuaDetail', { duaId: dua.id });
  };

  return (
    <View style={styles.container}>
      <TopBar
        showBackButton
        onBackPress={() => navigation.goBack()}
        title={`${dayDisplayName} Duas`}
        subtitle={`${dayDuas.length} duas available`}
      />

      <View style={styles.content}>
        {dayDuas.length > 0 ? (
          <FlatList
            data={dayDuas}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <DuaCard
                dua={item}
                onPress={handleDuaPress}
                showReference
                index={index}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={[
              styles.globalStyles.spacingUtils.py('lg'),
              { paddingBottom: 110 },
            ]}
          />
        ) : (
          <EmptyState
            icon={
              <Ionicons
                name="book-outline"
                size={64}
                color={colors.mutedForeground}
              />
            }
            title={`No duas for ${dayDisplayName}`}
            description="There are no duas available for this day."
          />
        )}
      </View>
    </View>
  );
};

export default DayViewScreen;
