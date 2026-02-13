import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface IslamicPatternProps {
  width: number;
  height: number;
  color?: string;
  opacity?: number;
}

/**
 * Mihrab (mehraab) decorative overlay for header backgrounds.
 * Uses the mehraab.png asset; no code-generated pattern.
 */
const IslamicPattern: React.FC<IslamicPatternProps> = ({
  width,
  height,
  opacity = 0.3,
}) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        source={require('../../../assets/images/mehraab-1.png')}
        style={[styles.image, { width, height, opacity }]}
        resizeMode="stretch"
        accessibilityLabel="Decorative mihrab arch"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default IslamicPattern;
