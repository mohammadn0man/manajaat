import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  LayoutChangeEvent,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Dua } from '../types/dua';
import { useTheme } from '../contexts/ThemeProvider';
import { useApp } from '../contexts/AppContext';
import DuaCard from './DuaCard';
import { storageService } from '../services/storageService';
import { analyticsService } from '../services/analyticsService';
import { dateKeyForToday } from '../utils/dateUtils';
import { fontFamilies } from '../config/fonts';
import { getTranslation, isLanguageRTL } from '../utils/translationUtils';

interface DuaScrollViewProps {
  duas: Dua[];
  /**
   * `session` — home “today’s read” flow: restore scroll position, progress callbacks, I’m done.
   * `browse` — calendar day list: same stacked layout, no progress or completion UI.
   */
  variant?: 'session' | 'browse';
  onComplete?: () => void;
  onProgressChange?: (index: number, total: number) => void;
  onDuaPress?: (dua: Dua) => void;
}

const DuaScrollView: React.FC<DuaScrollViewProps> = ({
  duas,
  variant = 'session',
  onComplete,
  onProgressChange,
  onDuaPress,
}) => {
  const { styles, colors } = useTheme();
  const { isRTL, isFavorite, toggleFavorite, language, getFontSizeValue } =
    useApp();
  const insets = useSafeAreaInsets();
  const isSession = variant === 'session';

  const scrollViewRef = useRef<ScrollView>(null);
  const cardLayouts = useRef<number[]>([]);
  const [sessionStartTime] = useState<number>(Date.now());
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);
  const currentVisibleIndexRef = useRef(0);
  const savedTargetIndex = useRef(0);
  const hasScrolledToSaved = useRef(false);

  useEffect(() => {
    if (!isSession) return;

    const loadProgress = async () => {
      const savedProgress = await storageService.getTodayProgress();
      const index = Math.min(savedProgress, duas.length - 1);
      savedTargetIndex.current = index;
      currentVisibleIndexRef.current = index;
      setCurrentVisibleIndex(index);
      onProgressChange?.(index, duas.length);

      if (duas.length > 0) {
        analyticsService.logDuaView(duas[index].id, index, duas.length);
      }

      tryScrollToSaved();
    };
    loadProgress();
  }, [duas, isSession, onProgressChange]);

  const tryScrollToSaved = useCallback(() => {
    if (!isSession) return;
    if (hasScrolledToSaved.current) return;
    const target = savedTargetIndex.current;
    if (target <= 0) return;

    const allMeasured =
      cardLayouts.current.filter((h) => h > 0).length >= duas.length;
    if (!allMeasured) return;

    let targetY = 0;
    for (let i = 0; i < target; i++) {
      targetY += cardLayouts.current[i] || 0;
    }
    if (targetY > 0) {
      hasScrolledToSaved.current = true;
      setTimeout(() => {
        scrollViewRef.current?.scrollTo({ y: targetY, animated: false });
      }, 50);
    }
  }, [duas.length, isSession]);

  const handleCardLayout = useCallback(
    (index: number, event: LayoutChangeEvent) => {
      if (!isSession) return;
      cardLayouts.current[index] = event.nativeEvent.layout.height;
      if (cardLayouts.current.filter((h) => h > 0).length >= duas.length) {
        tryScrollToSaved();
      }
    },
    [duas.length, isSession, tryScrollToSaved]
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (!isSession || !onProgressChange) return;
      const scrollY = event.nativeEvent.contentOffset.y;
      let accumulated = 0;
      let visibleIndex = 0;

      for (let i = 0; i < cardLayouts.current.length; i++) {
        const cardHeight = cardLayouts.current[i] || 0;
        if (scrollY < accumulated + cardHeight * 0.5) {
          visibleIndex = i;
          break;
        }
        accumulated += cardHeight;
        visibleIndex = i;
      }

      if (visibleIndex !== currentVisibleIndexRef.current) {
        currentVisibleIndexRef.current = visibleIndex;
        setCurrentVisibleIndex(visibleIndex);
        onProgressChange(visibleIndex, duas.length);
        storageService.setTodayProgress(visibleIndex);
      }
    },
    [duas.length, isSession, onProgressChange]
  );

  const handleComplete = async () => {
    if (!onComplete) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const totalDuration = (Date.now() - sessionStartTime) / 1000;
    analyticsService.logSessionCompleted(
      dateKeyForToday(),
      duas.length,
      totalDuration
    );

    await storageService.setTodayCompleted();
    await storageService.clearTodayProgress();

    onComplete();
  };

  const renderDuaItem = (dua: Dua, index: number) => {
    const translation = getTranslation(dua, language);
    const isTranslationRTL = isLanguageRTL(language);

    return (
      <View
        key={dua.id}
        onLayout={isSession ? (e) => handleCardLayout(index, e) : undefined}
        style={{
          paddingHorizontal: 16,
          paddingTop: index === 0 ? 20 : 0,
          paddingBottom: 12,
        }}
      >
        {index > 0 && (
          <View
            style={{
              height: 1,
              backgroundColor: colors.border,
              marginBottom: 24,
              marginHorizontal: 8,
              opacity: 0.5,
            }}
          />
        )}

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingHorizontal: 8,
            marginBottom: 12,
          }}
        >
          <Text
            style={[
              styles.caption,
              {
                color: colors.accent,
                fontWeight: '600',
              },
            ]}
          >
            {index + 1} / {duas.length}
          </Text>
        </View>

        <DuaCard
          dua={dua}
          onPress={onDuaPress}
          compact={false}
          showActions={true}
          onFavoritePress={() => toggleFavorite(dua.id)}
          isFavorite={isFavorite(dua.id)}
          index={index}
        />

        {translation && (
          <View style={{ marginTop: 24, paddingHorizontal: 8 }}>
            <Text
              style={[
                styles.body,
                {
                  color: colors.foreground,
                  fontFamily: isTranslationRTL
                    ? fontFamilies.urdu
                    : fontFamilies.latin,
                  fontSize: Math.round(getFontSizeValue() * 0.95),
                  lineHeight: isTranslationRTL
                    ? Math.round(getFontSizeValue() * 0.95 * 1.8)
                    : Math.round(getFontSizeValue() * 0.95 * 1.65),
                  textAlign: isTranslationRTL ? 'right' : 'left',
                  paddingTop: isTranslationRTL
                    ? Math.max(8, Math.round(getFontSizeValue() * 0.25))
                    : Math.round(getFontSizeValue() * 0.2),
                  paddingBottom: isTranslationRTL
                    ? Math.max(8, Math.round(getFontSizeValue() * 0.25))
                    : Math.round(getFontSizeValue() * 0.2),
                },
              ]}
            >
              {translation}
            </Text>
          </View>
        )}

        {dua.reference && (
          <View style={{ marginTop: 16, paddingHorizontal: 8 }}>
            <Text
              style={[
                styles.caption,
                {
                  color: colors.accent,
                  fontSize: Math.round(getFontSizeValue() * 0.7),
                  fontStyle: 'italic',
                  textAlign: isRTL ? 'right' : 'left',
                },
              ]}
            >
              {dua.reference}
            </Text>
          </View>
        )}
      </View>
    );
  };

  const bottomPadding = isSession
    ? 120 + Math.max(insets.bottom, 20)
    : 32 + Math.max(insets.bottom, 20);

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1 }}
        contentContainerStyle={{
          flexGrow: 1,
          paddingBottom: bottomPadding,
        }}
        showsVerticalScrollIndicator={false}
        bounces={true}
        scrollEventThrottle={isSession ? 100 : undefined}
        onScroll={isSession ? handleScroll : undefined}
      >
        {duas.map((dua, index) => renderDuaItem(dua, index))}

        {isSession && (
          <View
            style={{
              paddingHorizontal: 24,
              paddingTop: 32,
              paddingBottom: 16,
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              style={{
                borderRadius: 999,
                backgroundColor: '#10B981',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 16,
                paddingHorizontal: 48,
                width: '100%',
                maxWidth: 400,
              }}
              onPress={handleComplete}
              accessibilityRole="button"
              accessibilityLabel="I am done"
              accessibilityHint="Complete today's session"
            >
              <Text
                style={[
                  styles.body,
                  {
                    color: '#FFFFFF',
                    fontWeight: '600',
                  },
                ]}
              >
                I'm done
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default DuaScrollView;
