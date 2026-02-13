// Global styles system for consistent theming across the app
import { fontFamilies } from '../config/fonts';

// Global spacing system
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
} as const;

// Global border radius system
export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 20,
  full: 9999,
} as const;

// Global shadow system (soft shadows with design-system color)
export const shadows = {
  sm: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  md: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#2C3E50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
  },
} as const;

// Global typography system
export const typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600' as const,
    lineHeight: 36,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '500' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  arabic: {
    fontSize: 20,
    fontWeight: 'bold' as const,
    fontFamily: fontFamilies.arabicBold,
    lineHeight: 28,
    textAlign: 'right' as const,
  },
  arabicLarge: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    fontFamily: fontFamilies.arabicBold,
    lineHeight: 32,
    textAlign: 'right' as const,
  },
} as const;

// Global layout system
export const layout = {
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: spacing['2xl'],
    paddingTop: spacing['2xl'],
  },
  contentCompact: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
  },
  row: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
  },
  rowBetween: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'space-between' as const,
  },
  rowCenter: {
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  column: {
    flexDirection: 'column' as const,
  },
  columnCenter: {
    flexDirection: 'column' as const,
    alignItems: 'center' as const,
  },
} as const;

// Global component styles (cardPadding: 20 per design system)
export const components = {
  card: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardCompact: {
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  button: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonSmall: {
    borderRadius: borderRadius.sm,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  input: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderWidth: 1,
  },
  listItem: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderBottomWidth: 1,
  },
  section: {
    marginBottom: spacing['3xl'],
  },
  sectionHeader: {
    marginBottom: spacing.lg,
  },
} as const;

// Global spacing utilities
export const spacingUtils = {
  mt: (size: keyof typeof spacing) => ({ marginTop: spacing[size] }),
  mb: (size: keyof typeof spacing) => ({ marginBottom: spacing[size] }),
  ml: (size: keyof typeof spacing) => ({ marginLeft: spacing[size] }),
  mr: (size: keyof typeof spacing) => ({ marginRight: spacing[size] }),
  mx: (size: keyof typeof spacing) => ({ marginHorizontal: spacing[size] }),
  my: (size: keyof typeof spacing) => ({ marginVertical: spacing[size] }),
  pt: (size: keyof typeof spacing) => ({ paddingTop: spacing[size] }),
  pb: (size: keyof typeof spacing) => ({ paddingBottom: spacing[size] }),
  pl: (size: keyof typeof spacing) => ({ paddingLeft: spacing[size] }),
  pr: (size: keyof typeof spacing) => ({ paddingRight: spacing[size] }),
  px: (size: keyof typeof spacing) => ({ paddingHorizontal: spacing[size] }),
  py: (size: keyof typeof spacing) => ({ paddingVertical: spacing[size] }),
} as const;

// Export all styles as a single object for easy access
export const globalStyles = {
  spacing,
  borderRadius,
  shadows,
  typography,
  layout,
  components,
  spacingUtils,
} as const;
