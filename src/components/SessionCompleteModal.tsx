import React from 'react';
import { View, Text, Modal, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeProvider';

interface SessionCompleteModalProps {
  visible: boolean;
  onClose: () => void;
  onViewFavorites: () => void;
  onBackToHome: () => void;
  totalDuas: number;
}

const { width } = Dimensions.get('window');

const SessionCompleteModal: React.FC<SessionCompleteModalProps> = ({
  visible,
  onClose,
  onBackToHome,
  totalDuas,
}) => {
  const { styles, colors } = useTheme();

  const handleBackToHome = () => {
    onClose();
    onBackToHome();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={{
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 24,
      }}>
        <View style={[
          styles.card,
          {
            width: width - 48,
            maxWidth: 400,
            backgroundColor: colors.card,
            borderRadius: 16,
            padding: 24,
            alignItems: 'center',
          }
        ]}>
          {/* Success Icon */}
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: '#10B981',
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 16,
          }}>
            <Ionicons name="checkmark" size={32} color="white" />
          </View>

          {/* Title */}
          <Text style={[
            styles.h2,
            { 
              color: colors.foreground,
              textAlign: 'center',
              marginBottom: 8,
            }
          ]}>
            Great job! 🎉
          </Text>

          {/* Message */}
          <Text style={[
            styles.body,
            { 
              color: colors.mutedForeground,
              textAlign: 'center',
              marginBottom: 24,
              lineHeight: 24,
            }
          ]}>
            You've completed all {totalDuas} duas for today. Keep up the great work!
          </Text>

          {/* Action Buttons */}
          <View style={{ width: '100%', gap: 12 }}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: 'transparent',
                  borderWidth: 1,
                  borderColor: colors.border,
                  paddingVertical: 16,
                  borderRadius: 12,
                }
              ]}
              onPress={handleBackToHome}
              accessibilityRole="button"
              accessibilityLabel="Back to home"
              accessibilityHint="Return to home screen"
            >
              <Text style={[
                styles.body,
                { 
                  color: colors.foreground,
                  textAlign: 'center',
                }
              ]}>
                Back to Home
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SessionCompleteModal;
