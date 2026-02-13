import React from 'react';
import { View } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';

const PATTERN_UNIT = 80;

interface IslamicPatternProps {
  width: number;
  height: number;
  color?: string;
  opacity?: number;
}

/**
 * SVG-based Islamic geometric pattern (octagonal star / interlocking tiles)
 * for header backgrounds. Gold (#C9A961) at 0.3 opacity by default.
 */
const IslamicPattern: React.FC<IslamicPatternProps> = ({
  width,
  height,
  color = '#C9A961',
  opacity = 0.3,
}) => {
  // Repeat pattern to fill viewport (add one extra for overlap)
  const cols = Math.ceil(width / PATTERN_UNIT) + 1;
  const rows = Math.ceil(height / PATTERN_UNIT) + 1;

  // Simple 8-pointed star / diamond tile (one unit)
  const starPath = `
    M ${PATTERN_UNIT / 2} 0
    L ${PATTERN_UNIT * 0.65} ${PATTERN_UNIT * 0.35}
    L ${PATTERN_UNIT} ${PATTERN_UNIT / 2}
    L ${PATTERN_UNIT * 0.65} ${PATTERN_UNIT * 0.65}
    L ${PATTERN_UNIT / 2} ${PATTERN_UNIT}
    L ${PATTERN_UNIT * 0.35} ${PATTERN_UNIT * 0.65}
    L 0 ${PATTERN_UNIT / 2}
    L ${PATTERN_UNIT * 0.35} ${PATTERN_UNIT * 0.35}
    Z
  `;

  const tiles: React.ReactNode[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x = col * PATTERN_UNIT;
      const y = row * PATTERN_UNIT;
      tiles.push(
        <G key={`${row}-${col}`} transform={`translate(${x}, ${y})`}>
          <Path
            d={starPath}
            fill={color}
            fillOpacity={opacity}
            stroke="none"
          />
        </G>
      );
    }
  }

  return (
    <View style={{ width, height, position: 'absolute', overflow: 'hidden' }}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <G>
          {tiles}
        </G>
      </Svg>
    </View>
  );
};

export default IslamicPattern;
