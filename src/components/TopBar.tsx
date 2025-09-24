import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../contexts/ThemeProvider';

interface TopBarProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  showBackButton?: boolean;
  rightComponent?: React.ReactNode;
}

const TopBar: React.FC<TopBarProps> = ({
  title,
  subtitle,
  onBackPress,
  showBackButton = false,
  rightComponent,
}) => {
  const { colors, styles } = useTheme();
  
  return (
    <View style={[styles.rowBetween, { backgroundColor: colors.primary, paddingTop: 48, paddingBottom: 24, paddingHorizontal: 24 }]}>
      <View style={{ width: 40, alignItems: 'flex-start' }}>
        {showBackButton && (
          <TouchableOpacity
            style={{ padding: 4 }}
            onPress={onBackPress}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Navigate back to previous screen"
          >
            <Ionicons name="arrow-back" size={24} color={colors.primaryForeground} />
          </TouchableOpacity>
        )}
      </View>
      
      <View style={styles.columnCenter}>
        <Text style={[styles.h3, { color: colors.primaryForeground, textAlign: 'center' }]}>{title}</Text>
        {subtitle && <Text style={[styles.body, { color: colors.primaryForeground, textAlign: 'center', marginTop: 4 }]}>{subtitle}</Text>}
      </View>
      
      <View style={{ width: 40, alignItems: 'flex-end' }}>
        {rightComponent}
      </View>
    </View>
  );
};

export default TopBar;
