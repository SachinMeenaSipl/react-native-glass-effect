/**
 * Codegen spec for the LiquidGlass TurboModule.
 *
 * Two jobs:
 * 1. Report what the current device can render (`getCapabilities`).
 * 2. Act as a "is the native side linked?" probe. If this module is null,
 *    the library is not installed natively (e.g. Expo Go) and every component
 *    renders a safe JS fallback instead of crashing.
 */
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type NativeCapabilities = {
  /** 'android' | 'ios' */
  platform: string;
  /** Android API level or iOS major version. */
  osVersion: number;
  /** 'shader' | 'blur' | 'compat' | 'system-glass' | 'system-material' */
  bestRenderer: string;
  supportsBlur: boolean;
  supportsRefraction: boolean;
  isLowRamDevice: boolean;
  isPowerSaveMode: boolean;
  reduceTransparency: boolean;
  reduceMotion: boolean;
};

/** Counters since the last resetStats(). Android fills them all; iOS only liveGlassViews. */
export type NativeGlassStats = {
  /** Times any glass view drew itself. */
  glassDraws: number;
  /** GPU blur passes (Android 12+). */
  gpuBlurPasses: number;
  /** Of those, passes that also ran the refraction shader (Android 13+). */
  shaderPasses: number;
  /** Snapshot captures (Android 7-11, screenshots, quality="static"). */
  compatCaptures: number;
  /** Total milliseconds spent in those captures (drawing + CPU blur). */
  compatCaptureMs: number;
  /** Content changes that did NOT redraw a glass because they were far from it. */
  skippedFarChanges: number;
  /** Draws that used the solid fallback (no backdrop / reduce transparency). */
  solidDraws: number;
  /** Glass views currently attached. */
  liveGlassViews: number;
};

export interface Spec extends TurboModule {
  /** Synchronous: cheap, read once per mount. */
  getCapabilities(): NativeCapabilities;
  /** Synchronous. Performance counters for profiling in development. */
  getStats(): NativeGlassStats;
  resetStats(): void;
}

export default TurboModuleRegistry.get<Spec>('LiquidGlassModule');
