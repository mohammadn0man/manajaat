/**
 * UI constants and magic numbers
 * Centralized location for all UI-related constants to avoid magic numbers
 */

export const UI_CONSTANTS = {
  // Animation constants
  ANIMATION_DURATION: 250,
  SPRING_TENSION: 100,
  SPRING_FRICTION: 8,

  // Gesture constants
  SWIPE_THRESHOLD: 50,
  GESTURE_MIN_DISTANCE: 10,

  // Icon sizes
  ICON_SIZES: {
    small: 16,
    medium: 20,
    large: 24,
    xlarge: 32,
    xxlarge: 64,
  },

  // Layout constants
  STATUS_BAR_HEIGHT: 48,
  BORDER_RADIUS: {
    small: 4,
    medium: 8,
    large: 12,
    xlarge: 16,
    round: 50,
  },

  // Spacing constants
  SPACING: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Padding constants
  PADDING: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },

  // Progress bar constants
  PROGRESS_BAR_HEIGHT: 4,

  // Modal constants
  MODAL_BACKDROP_OPACITY: 0.5,
  MODAL_MAX_WIDTH: 400,

  // Button constants
  BUTTON_HEIGHT: {
    small: 32,
    medium: 40,
    large: 48,
  },

  // Card constants
  CARD_ELEVATION: 2,
  CARD_BORDER_WIDTH: 1,

  // Success/Error colors
  SUCCESS_COLOR: '#10B981',
  ERROR_COLOR: '#EF4444',
  WARNING_COLOR: '#F59E0B',
  INFO_COLOR: '#3B82F6',

  // Font size multipliers
  FONT_SIZE_MULTIPLIERS: {
    h1: 1.6,
    h2: 1.4,
    h3: 1.2,
    h4: 1.0,
    body: 0.8,
    caption: 0.7,
    small: 0.6,
  },

  // Line height multipliers
  LINE_HEIGHT_MULTIPLIERS: {
    arabic: 2.2,
    arabicLarge: 3.0,
  },

  // Screen dimensions (will be updated at runtime)
  SCREEN: {
    width: 0, // Will be set by useWindowDimensions
    height: 0, // Will be set by useWindowDimensions
  },
} as const;

// Type definitions for better type safety
export type IconSize = keyof typeof UI_CONSTANTS.ICON_SIZES;
export type BorderRadius = keyof typeof UI_CONSTANTS.BORDER_RADIUS;
export type Spacing = keyof typeof UI_CONSTANTS.SPACING;
export type Padding = keyof typeof UI_CONSTANTS.PADDING;
export type ButtonHeight = keyof typeof UI_CONSTANTS.BUTTON_HEIGHT;
export type FontSizeMultiplier =
  keyof typeof UI_CONSTANTS.FONT_SIZE_MULTIPLIERS;
