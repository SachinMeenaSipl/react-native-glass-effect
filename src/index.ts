/**
 * react-native-liquid-glass — public API.
 *
 * Anything not exported here is internal and may change without notice.
 */

// Components
export {
  LiquidGlassView,
  GlassBackdrop,
  LiquidGlassButton,
  LiquidGlassCard,
} from './components';
export type {
  LiquidGlassViewProps,
  GlassBackdropProps,
  LiquidGlassButtonProps,
  GlassButtonSize,
  LiquidGlassCardProps,
} from './components';

// Materials
export { MATERIALS, resolveMaterial } from './materials';
export type {
  GlassMaterial,
  GlassMaterialName,
  GlassAppearanceProps,
  ResolvedGlass,
  SchemeColor,
} from './materials';

// Theme
export { GlassThemeProvider, useGlassTheme, defaultTheme } from './theme';
export type { GlassTheme, GlassThemeOverrides, GlassThemeProviderProps } from './theme';

// Quality
export type { GlassQuality } from './quality';

// Capabilities
export { getGlassCapabilities, useGlassCapabilities } from './capabilities';
export type { GlassCapabilities, GlassRenderer } from './capabilities';

// Diagnostics
export { getGlassStats, resetGlassStats } from './diagnostics';
export type { GlassStats } from './diagnostics';

// Accessibility
export { useReduceTransparency, useReduceMotion } from './accessibility';
