import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  type TextProps,
  type TextStyle,
} from 'react-native';

/** Arabic ligature “صلى الله عليه وسلم” often used after “Muhammad”. */
export const ARABIC_SALAM_GLYPH = '\uFDFA';

type BodyTextWithSalamGlyphProps = Omit<TextProps, 'children'> & {
  children: string;
  /** Font for the salam glyph so it does not fall back to system Arabic (different metrics than Latin). */
  salamFontFamily: string;
};

/**
 * Renders body copy that may contain U+FDFA (ﷺ). That glyph in a Latin font often
 * uses an unpredictable fallback and can collide with adjacent lines; wrapping it in
 * nested Text with a known Arabic font keeps size/line metrics consistent.
 */
const BodyTextWithSalamGlyph: React.FC<BodyTextWithSalamGlyphProps> = ({
  children,
  salamFontFamily,
  style,
  ...rest
}) => {
  const flat = StyleSheet.flatten(style) as TextStyle | undefined;
  const fontSize = flat?.fontSize ?? 14;
  const lineHeight = flat?.lineHeight ?? Math.round(fontSize * 1.8);

  const glyphStyle: TextStyle = {
    fontFamily: salamFontFamily,
    fontSize,
    lineHeight,
    ...(Platform.OS === 'android' ? { includeFontPadding: false } : {}),
  };

  if (!children.includes(ARABIC_SALAM_GLYPH)) {
    return (
      <Text style={style} {...rest}>
        {children}
      </Text>
    );
  }

  const parts = children.split(ARABIC_SALAM_GLYPH);
  const nodes: React.ReactNode[] = [];
  parts.forEach((segment, i) => {
    nodes.push(segment);
    if (i < parts.length - 1) {
      nodes.push(
        <Text key={`salam-${i}`} style={glyphStyle}>
          {ARABIC_SALAM_GLYPH}
        </Text>
      );
    }
  });

  return (
    <Text style={style} {...rest}>
      {nodes}
    </Text>
  );
};

export default BodyTextWithSalamGlyph;
