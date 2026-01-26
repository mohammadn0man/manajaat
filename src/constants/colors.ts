/**
 * Color constants to eliminate hard-coded colors
 */

export const COLORS = {
  // Primary colors
  PRIMARY: '#2596be',
  PRIMARY_FOREGROUND: '#FFFFFF',

  // Secondary colors
  SECONDARY: '#E6F7FF',
  SECONDARY_FOREGROUND: '#0F172A',

  // Status colors
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',

  // Neutral colors
  BACKGROUND: '#FFFFFF',
  FOREGROUND: '#0F172A',
  MUTED: '#F1F5F9',
  MUTED_FOREGROUND: '#64748B',

  // Border colors
  BORDER: '#E2E8F0',
  INPUT: '#E2E8F0',

  // Dark theme colors
  DARK_BACKGROUND: '#0A1628',
  DARK_FOREGROUND: '#F8FAFC',
  DARK_CARD: '#1E293B',
  DARK_MUTED: '#1E293B',
  DARK_MUTED_FOREGROUND: '#94A3B8',
  DARK_BORDER: '#1E293B',

  // Legacy colors (for backward compatibility)
  LEGACY_PRIMARY: '#4F46E5',
  LEGACY_GRAY: '#6b7280',
  LEGACY_LIGHT_GRAY: '#c7d2fe',
  LEGACY_BORDER: '#e5e7eb',
} as const;

// Type definitions for better type safety
export type ColorKey = keyof typeof COLORS;
