import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/types';
import {
  getTodayDuas,
  getTodayDayName,
  getDayDisplayName,
} from '../services/duaService';
import { storageService } from '../services/storageService';
import TopBar from '../components/TopBar';
import DuaPager from '../components/DuaPager';
import SessionCompleteModal from '../components/SessionCompleteModal';
import CompletionState from '../components/CompletionState';
import { useTheme } from '../contexts/ThemeProvider';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const { styles } = useTheme();
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const todayDuas = getTodayDuas();
  const todayDayName = getTodayDayName();
  const todayDisplayName = getDayDisplayName(todayDayName);

  // Check if today's session is completed
  useEffect(() => {
    const checkCompletionStatus = async () => {
      const completed = await storageService.isTodayCompleted();
      setIsCompleted(completed);
    };

    checkCompletionStatus();
  }, []);

  const handleDayPress = () => {
    navigation.navigate('DayView', { day: todayDayName });
  };

  const handleSessionComplete = () => {
    setShowCompleteModal(true);
  };

  const handleBackToHome = () => {
    // Modal will close automatically and show completion state
    setIsCompleted(true);
  };

  const handleCloseModal = () => {
    setShowCompleteModal(false);
  };

  const handleViewFavorites = () => {
    setShowCompleteModal(false);
    // Note: Currently not used by SessionCompleteModal
  };

  const handleStartAgain = async () => {
    // Reset today's progress and completion status
    await storageService.resetTodayProgress();
    setIsCompleted(false);
  };

  return (
    <View style={styles.container}>
      <TopBar
        title="Read today's Duas"
        subtitle={todayDisplayName}
        onBackPress={handleDayPress}
        showBackButton={false}
      />

      <View style={styles.content}>
        {isCompleted ? (
          <CompletionState
            totalDuas={todayDuas.length}
            onStartAgain={handleStartAgain}
          />
        ) : todayDuas.length > 0 ? (
          <DuaPager
            duas={todayDuas}
            onComplete={handleSessionComplete}
          />
        ) : (
          <View style={styles.centerContent}>
            <Text style={styles.textMuted}>No duas available for today</Text>
          </View>
        )}
      </View>

      <SessionCompleteModal
        visible={showCompleteModal}
        onClose={handleCloseModal}
        onViewFavorites={handleViewFavorites}
        onBackToHome={handleBackToHome}
        totalDuas={todayDuas.length}
      />
    </View>
  );
};

export default HomeScreen;
