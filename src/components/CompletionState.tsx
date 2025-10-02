import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeProvider';

interface CompletionStateProps {
  totalDuas: number;
  onStartAgain: () => void;
}

const CompletionState: React.FC<CompletionStateProps> = ({
  totalDuas,
  onStartAgain,
}) => {
  const { styles, colors } = useTheme();

  return (
    <View style={styles.centerContent}>
      {/* Success Icon */}
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: '#10B981',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 24,
        }}
      >
        <Ionicons name="checkmark" size={40} color="white" />
      </View>

      {/* Title */}
      <Text
        style={[
          styles.h2,
          {
            color: colors.foreground,
            textAlign: 'center',
            marginBottom: 12,
          },
        ]}
      >
        Completed today's Zikr! 🎉
      </Text>

      {/* Subtitle */}
      <Text
        style={[
          styles.body,
          {
            color: colors.mutedForeground,
            textAlign: 'center',
            marginBottom: 32,
            lineHeight: 24,
          },
        ]}
      >
        You've completed all {totalDuas} duas for today.
        {'\n'}May Allah accept your prayers and grant you peace.
      </Text>

      {/* Start Again Button */}
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: colors.primary,
            paddingVertical: 16,
            paddingHorizontal: 32,
            borderRadius: 12,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 200,
          },
        ]}
        onPress={onStartAgain}
        accessibilityRole="button"
        accessibilityLabel="Start again"
        accessibilityHint="Restart today's duas session"
      >
        <Ionicons name="refresh" size={20} color={colors.primaryForeground} />
        <Text
          style={[
            styles.body,
            {
              color: colors.primaryForeground,
              marginLeft: 8,
              fontWeight: '600',
            },
          ]}
        >
          Start Again
        </Text>
      </TouchableOpacity>

      {/* Optional: Show completion time */}
      <Text
        style={[
          styles.caption,
          {
            color: colors.mutedForeground,
            textAlign: 'center',
            marginTop: 16,
            fontStyle: 'italic',
          },
        ]}
      >
        Completed at{' '}
        {new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}
      </Text>
    </View>
  );
};

export default CompletionState;
