import type { ColorValue } from 'react-native';
import type { GlassQuality } from '../quality/types';

/** Built-in material names. */
export type GlassMaterialName = 'thin' | 'regular' | 'thick' | 'clear';

/** A colour that can differ between light and dark mode. */
export type SchemeColor = { light: ColorValue; dark: ColorValue };

/**
 * A material is a named bundle of look-and-feel values.
 * Components never hard-code these numbers — they ask for a material.
 *
 * Lengths are dp. Strengths are 0..1.
 */
export interface GlassMaterial {
  /** Blur radius in dp. */
  blur: number;
  /** Tint colour per colour scheme. */
  tint: SchemeColor;
  /** Tint opacity per colour scheme, 0..1. */
  tintOpacity: { light: number; dark: number };
  /** Edge lensing, 0..1 (Android 13+). */
  refraction: number;
  /** Whole-surface magnification, 0..1 (Android 13+). */
  distortion: number;
  /** Specular rim light, 0..1. */
  illumination: number;
  /** RGB split at edges, 0..1 (Android 13+, quality "high"). */
  chromaticAberration: number;
  /** Width of the refracting rim, dp. */
  edgeWidth: number;
  /** Border stroke width, dp. */
  borderWidth: number;
  /** Border stroke opacity, 0..1. */
  borderOpacity: number;
  /** iOS 26 system glass style. */
  appearance: 'regular' | 'clear';
  /** Opaque colour used when glass is turned off (accessibility, unsupported). */
  fallbackColor: SchemeColor;
}

/**
 * Props that control how a glass surface LOOKS.
 * Every value is optional and overrides the chosen material.
 */
export interface GlassAppearanceProps {
  /** Starting preset. Default: theme default ("regular"). */
  material?: GlassMaterialName;
  /**
   * One knob to make the whole effect stronger or weaker, 0..1.
   * Multiplies blur, refraction, distortion, illumination and chromatic aberration.
   * Default 1.
   */
  intensity?: number;
  /** Blur radius in dp. Overrides the material. */
  blur?: number;
  /** Tint colour. Any React Native colour, including PlatformColor. */
  tint?: ColorValue;
  /** Tint opacity 0..1. */
  tintOpacity?: number;
  /** Edge lensing 0..1. Android 13+ only; ignored elsewhere. */
  refraction?: number;
  /** Whole-surface magnification 0..1. Android 13+ only. */
  distortion?: number;
  /** Specular rim light 0..1. */
  illumination?: number;
  /** Light direction in degrees (-90 = light from the top). */
  lightAngle?: number;
  /** RGB split at the edges 0..1. Android 13+ with quality "high". */
  chromaticAberration?: number;
  /** Width of the refracting rim in dp. */
  edgeWidth?: number;
  /** Corner radius in dp. Falls back to style.borderRadius, then the theme. */
  cornerRadius?: number;
  /** Glass border width in dp (0 = no border). */
  borderWidth?: number;
  /** Glass border opacity 0..1. */
  borderOpacity?: number;
  /** Rendering budget. Default "auto". */
  quality?: GlassQuality;
  /**
   * Show an opaque surface instead of glass.
   * "auto" (default) follows the iOS "Reduce Transparency" setting.
   */
  reduceTransparency?: boolean | 'auto';
  /** Colour of that opaque surface. Default comes from the material. */
  fallbackColor?: ColorValue;
  /** Android: sample a specific <GlassBackdrop backdropId="..."> */
  backdropId?: string;
  /**
   * React to touch. Android: a light follows the finger and the surface
   * squishes and springs back. iOS 26+: system interactive glass. Default false.
   */
  interactive?: boolean;
  /** Android: the rim light follows device tilt. Uses the gyroscope. Default false. */
  motionLighting?: boolean;
  /** Native transition time (ms) when glass props change. 0 = instant. Default 180. */
  transitionDuration?: number;
  /** Clip children to the rounded shape. Default true. */
  clipContent?: boolean;
}

/** What `resolveMaterial` produces: flat values, ready for native. */
export interface ResolvedGlass {
  blurRadius: number;
  tintColor: ColorValue;
  tintOpacity: number;
  refraction: number;
  distortion: number;
  illumination: number;
  lightAngle: number;
  chromaticAberration: number;
  edgeWidth: number;
  glassBorderWidth: number;
  glassBorderOpacity: number;
  appearance: 'regular' | 'clear';
  fallbackColor: ColorValue;
}
