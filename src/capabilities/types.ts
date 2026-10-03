/**
 * Which renderer a glass view will use at best on this device.
 *
 * - `shader`          Android 13+: blur + refraction + lighting (AGSL)
 * - `blur`            Android 12: real-time blur + lighting, no refraction
 * - `compat`          Android 7–11 or no GPU drawing: snapshot + CPU blur
 * - `system-glass`    iOS 26+: UIGlassEffect
 * - `system-material` iOS 15–25: UIVisualEffectView materials
 * - `fallback`        Native code not linked (Expo Go, web, Jest): plain View
 */
export type GlassRenderer =
  | 'shader'
  | 'blur'
  | 'compat'
  | 'system-glass'
  | 'system-material'
  | 'fallback';

export interface GlassCapabilities {
  platform: 'android' | 'ios' | 'web' | 'unknown';
  osVersion: number;
  bestRenderer: GlassRenderer;
  supportsBlur: boolean;
  supportsRefraction: boolean;
  isLowRamDevice: boolean;
  isPowerSaveMode: boolean;
  reduceTransparency: boolean;
  reduceMotion: boolean;
  /** False when native code is missing and components render JS fallbacks. */
  isNativeAvailable: boolean;
}
