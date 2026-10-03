import { nativeModule } from '../native/nativeBridge';

export interface GlassStats {
  glassDraws: number;
  gpuBlurPasses: number;
  shaderPasses: number;
  compatCaptures: number;
  compatCaptureMs: number;
  skippedFarChanges: number;
  solidDraws: number;
  liveGlassViews: number;
}

const ZERO: GlassStats = {
  glassDraws: 0,
  gpuBlurPasses: 0,
  shaderPasses: 0,
  compatCaptures: 0,
  compatCaptureMs: 0,
  skippedFarChanges: 0,
  solidDraws: 0,
  liveGlassViews: 0,
};

/**
 * Performance counters since the last `resetGlassStats()`. For profiling in development.
 *
 * ```ts
 * resetGlassStats();
 * setTimeout(() => {
 *   const s = getGlassStats();
 *   console.log(`${s.gpuBlurPasses / 5}/s blur passes, ${s.compatCaptureMs / Math.max(1, s.compatCaptures)} ms/capture`);
 * }, 5000);
 * ```
 * Returns zeros when native code isn't available. On iOS only `liveGlassViews` is filled
 * (UIKit renders the glass; its cost isn't observable from here).
 */
export function getGlassStats(): GlassStats {
  try {
    return nativeModule ? { ...ZERO, ...nativeModule.getStats() } : { ...ZERO };
  } catch {
    return { ...ZERO };
  }
}

export function resetGlassStats(): void {
  try {
    nativeModule?.resetStats();
  } catch {
    // ignore: diagnostics must never crash the app
  }
}
