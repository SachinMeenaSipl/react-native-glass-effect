/**
 * Codegen spec for the native <LiquidGlassView>.
 *
 * THIS FILE IS THE CONTRACT BETWEEN JS AND NATIVE.
 * - Android: generates `LiquidGlassViewManagerInterface` / `LiquidGlassViewManagerDelegate`.
 * - iOS: generates C++ props used by `LiquidGlassViewComponentView.mm`.
 *
 * Rules (see AGENTS.md → "Adding a prop"):
 * - Props here are FLAT and PRIMITIVE. Materials/themes are resolved in JS
 *   (`src/materials/resolveMaterial.ts`) before they reach native.
 * - All lengths are in dp (density-independent pixels), exactly like RN styles.
 * - All 0..1 values are clamped in JS AND native.
 * - Never name a prop like a style key (`borderWidth`, `borderRadius`...). Fabric
 *   flattens style into props, so names would collide. Use the `glass` prefix.
 */
import type { ColorValue, HostComponent, ViewProps } from 'react-native';
import type {
  Float,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';

export interface NativeLiquidGlassViewProps extends ViewProps {
  /** Blur radius in dp. 0 disables blur. */
  blurRadius?: WithDefault<Float, 20>;
  /** Colour laid over the blurred backdrop. */
  tintColor?: ColorValue;
  /** Opacity of the tint layer, 0..1. */
  tintOpacity?: WithDefault<Float, 0.12>;
  /** Edge lensing strength, 0..1. Android API 33+ only. */
  refraction?: WithDefault<Float, 0.35>;
  /** Whole-surface magnification, 0..1. Android API 33+ only. */
  distortion?: WithDefault<Float, 0.1>;
  /** Specular rim light strength, 0..1. */
  illumination?: WithDefault<Float, 0.5>;
  /** Light direction in degrees. 0 = from the right, 90 = from the bottom, -90 = from the top. */
  lightAngle?: WithDefault<Float, -60>;
  /** RGB split at the edges, 0..1. Android API 33+, quality "high" only. */
  chromaticAberration?: WithDefault<Float, 0>;
  /** Width of the refracting rim in dp. */
  edgeWidth?: WithDefault<Float, 16>;
  /** Corner radius in dp. Clamped to half the shortest side. */
  cornerRadius?: WithDefault<Float, 24>;
  /** Border stroke width in dp. */
  glassBorderWidth?: WithDefault<Float, 1>;
  /** Border stroke opacity (white), 0..1. */
  glassBorderOpacity?: WithDefault<Float, 0.3>;
  /** iOS 26+: which system glass style to use. */
  appearance?: WithDefault<'regular' | 'clear', 'regular'>;
  /** Rendering budget. See docs/user-guide/06-quality-and-performance.md */
  quality?: WithDefault<'auto' | 'high' | 'medium' | 'low' | 'static', 'auto'>;
  /** When true, draw an opaque `fallbackColor` instead of glass. */
  reduceTransparency?: WithDefault<boolean, false>;
  /** Opaque colour used when glass is off (reduce transparency / no backdrop). */
  fallbackColor?: ColorValue;
  /** Pin this glass to a specific <GlassBackdrop backdropId="...">. Empty = automatic. */
  backdropId?: WithDefault<string, ''>;
  /** Boosts the highlight while pressed. Set by LiquidGlassButton. */
  pressed?: WithDefault<boolean, false>;
  /**
   * Touch response. Android: light follows the finger + press squish/spring.
   * iOS 26+: system interactive glass.
   */
  interactive?: WithDefault<boolean, false>;
  /** Android: specular light follows device tilt (gyroscope). Off by default (battery). */
  motionLighting?: WithDefault<boolean, false>;
  /** Duration in ms for animating between prop values natively. 0 = snap. */
  transitionDuration?: WithDefault<Float, 180>;
  /** Clip children to the rounded shape. */
  clipContent?: WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeLiquidGlassViewProps>(
  'LiquidGlassView'
) as HostComponent<NativeLiquidGlassViewProps>;
