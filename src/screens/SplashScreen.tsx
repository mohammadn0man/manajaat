import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

// Brand palette (design system: teal + gold + warm cream only)
const COLORS = {
  // warm background tones
  sandLight: '#FBF4E6',
  sand: '#F3E6CC',
  sandDeep: '#EADBBE',
  // brand accents
  teal: '#1A5F5F',
  tealDeep: '#0F4545',
  gold: '#C9A961',
  goldDeep: '#A87E2E',
  ink: '#2C3E50',
  inkMuted: 'rgba(44, 62, 80, 0.62)',
  surface: '#FFFFFF',
};

const FONT_URDU = 'JameelNooriNastaleeqKasheeda';
const FONT_EN = 'Lato';

const SPLASH_DURATION_MS = 5000;
const FADE_OUT_MS = 600;

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  onFinish?: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const screenOpacity = useRef(new Animated.Value(1)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.82)).current;
  const titleTranslate = useRef(new Animated.Value(16)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const dividerWidth = useRef(new Animated.Value(0)).current;
  const bodyOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 700,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
      ]),
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(titleTranslate, {
          toValue: 0,
          duration: 600,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(dividerWidth, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
      Animated.timing(bodyOpacity, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    const fadeOutTimer = setTimeout(() => {
      Animated.timing(screenOpacity, {
        toValue: 0,
        duration: FADE_OUT_MS,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }).start(() => onFinish?.());
    }, SPLASH_DURATION_MS - FADE_OUT_MS);

    return () => clearTimeout(fadeOutTimer);
  }, [
    screenOpacity,
    logoOpacity,
    logoScale,
    titleOpacity,
    titleTranslate,
    dividerWidth,
    bodyOpacity,
    onFinish,
  ]);

  return (
    <Animated.View style={[styles.root, { opacity: screenOpacity }]}>
      <LinearGradient
        colors={[COLORS.sandLight, COLORS.sand, COLORS.sandDeep]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative mihrab arch, faint, anchored to the top */}
      <Image
        source={require('../../assets/images/mehraab.png')}
        style={styles.mehraab}
        resizeMode="contain"
      />

      <View style={styles.content}>
        <Animated.View
          style={[
            styles.logoRing,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image
            source={require('../../assets/images/munajaat-nomani.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View
          style={{
            opacity: titleOpacity,
            transform: [{ translateY: titleTranslate }],
          }}
        >
          <Text allowFontScaling={false} style={styles.titleUrdu}>
            مناجاتِ نعمانی
          </Text>
          <Text allowFontScaling={false} style={styles.titleEn}>
            Munajat-e-Nomani
          </Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.divider,
            {
              width: dividerWidth.interpolate({
                inputRange: [0, 1],
                outputRange: [0, Math.min(120, width * 0.32)],
              }),
            },
          ]}
        />

        <Animated.View style={[styles.body, { opacity: bodyOpacity }]}>
          <Text allowFontScaling={false} style={styles.taglineUrdu}>
            روزانہ کی مستند دعاؤں کو دن کے اعتبار سے ترتیب دینے والی ایک خوبصورت
            موبائل ایپلیکیشن
          </Text>
          <Text allowFontScaling={false} style={styles.taglineEn}>
            A beautifully designed mobile app that organizes authentic daily
            supplications by day.
          </Text>

          <View style={styles.attributionWrap}>
            <Text allowFontScaling={false} style={styles.attributionLabel}>
              Compiled & Translated By
            </Text>
            <Text allowFontScaling={false} style={styles.attributionUrdu}>
              حضرت مولانا یحییٰ نعمانی دامت برکاتہم
            </Text>
            <Text allowFontScaling={false} style={styles.attributionEn}>
              Hazrat Maolana Yahya Nomani DB
            </Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.sandLight,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 999,
  },
  mehraab: {
    position: 'absolute',
    top: -40,
    width: width * 1.1,
    height: width * 1.1,
    opacity: 0.1,
    tintColor: COLORS.gold,
  },
  content: {
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  logoRing: {
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: COLORS.surface,
    borderWidth: 2,
    borderColor: COLORS.gold,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 28,
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 18,
    elevation: 10,
  },
  logo: {
    width: 96,
    height: 96,
    borderRadius: 48,
  },
  titleUrdu: {
    fontFamily: FONT_URDU,
    fontSize: 52,
    lineHeight: 82,
    color: COLORS.teal,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  titleEn: {
    fontFamily: FONT_EN,
    fontWeight: '700',
    fontSize: 28,
    letterSpacing: 1.5,
    color: COLORS.goldDeep,
    textAlign: 'center',
    marginTop: 4,
  },
  divider: {
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.gold,
    marginVertical: 22,
  },
  body: {
    alignItems: 'center',
  },
  taglineUrdu: {
    fontFamily: FONT_URDU,
    fontSize: 24,
    lineHeight: 46,
    color: COLORS.ink,
    textAlign: 'center',
    writingDirection: 'rtl',
    marginBottom: 12,
  },
  taglineEn: {
    fontFamily: FONT_EN,
    fontSize: 17,
    lineHeight: 26,
    color: COLORS.inkMuted,
    textAlign: 'center',
    maxWidth: 320,
  },
  attributionWrap: {
    marginTop: 34,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(168, 126, 46, 0.45)',
    backgroundColor: 'rgba(255, 255, 255, 0.55)',
  },
  attributionLabel: {
    fontFamily: FONT_EN,
    fontSize: 11,
    letterSpacing: 2,
    color: COLORS.goldDeep,
    textAlign: 'center',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  attributionUrdu: {
    fontFamily: FONT_URDU,
    fontSize: 22,
    lineHeight: 42,
    color: COLORS.teal,
    textAlign: 'center',
    writingDirection: 'rtl',
  },
  attributionEn: {
    fontFamily: FONT_EN,
    fontWeight: '700',
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: 0.3,
    color: COLORS.ink,
    textAlign: 'center',
    marginTop: 6,
  },
});

export default SplashScreen;
