import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '../../contexts/ThemeProvider';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onActionPress,
}) => {
  const { styles } = useTheme();

  return (
    <View style={[styles.centerContent, { paddingHorizontal: 32 }]}>
      {icon}
      <Text
        style={[
          styles.h2,
          {
            marginTop: 24,
            textAlign: 'center',
          },
        ]}
      >
        {title}
      </Text>
      <Text
        style={[
          styles.textMuted,
          {
            textAlign: 'center',
            marginTop: 12,
            lineHeight: 22,
          },
        ]}
      >
        {description}
      </Text>
      {actionLabel != null && onActionPress != null && (
        <TouchableOpacity
          style={[
            styles.button,
            {
              marginTop: 24,
              paddingVertical: 14,
              paddingHorizontal: 24,
              minWidth: 160,
            },
          ]}
          onPress={onActionPress}
          accessibilityRole="button"
          accessibilityLabel={actionLabel}
        >
          <Text style={[styles.body, { fontWeight: '600' }]}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default EmptyState;
