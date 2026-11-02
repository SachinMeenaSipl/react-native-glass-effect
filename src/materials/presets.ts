import type { GlassMaterial, GlassMaterialName } from './types';

/**
 * Built-in materials. Tuned so the four presets are visibly different on a
 * busy photo background in both light and dark mode.
 *
 * To change the look app-wide, don't edit these — pass overrides to
 * <GlassThemeProvider materials={{ regular: { blur: 24 } }}>.
 */

const FALLBACK = { light: '#F2F2F7', dark: '#2C2C2E' } as const;

export const thin: GlassMaterial = {
  blur: 10,
  tint: { light: '#FFFFFF', dark: '#1C1C1E' },
  tintOpacity: { light: 0.08, dark: 0.18 },
  refraction: 0.25,
  distortion: 0.05,
  illumination: 0.4,
  chromaticAberration: 0,
  edgeWidth: 12,
  borderWidth: 1,
  borderOpacity: 0.25,
  appearance: 'regular',
  fallbackColor: FALLBACK,
};

export const regular: GlassMaterial = {
  blur: 20,
  tint: { light: '#FFFFFF', dark: '#1C1C1E' },
  tintOpacity: { light: 0.14, dark: 0.28 },
  refraction: 0.35,
  distortion: 0.1,
  illumination: 0.5,
  chromaticAberration: 0,
  edgeWidth: 16,
  borderWidth: 1,
  borderOpacity: 0.3,
  appearance: 'regular',
  fallbackColor: FALLBACK,
};

export const thick: GlassMaterial = {
  blur: 36,
  tint: { light: '#FFFFFF', dark: '#1C1C1E' },
  tintOpacity: { light: 0.28, dark: 0.45 },
  refraction: 0.3,
  distortion: 0.08,
  illumination: 0.45,
  chromaticAberration: 0,
  edgeWidth: 18,
  borderWidth: 1,
  borderOpacity: 0.25,
  appearance: 'regular',
  fallbackColor: FALLBACK,
};

/** Barely-there glass: little blur, strong lensing. Needs a busy background. */
export const clear: GlassMaterial = {
  blur: 4,
  tint: { light: '#FFFFFF', dark: '#000000' },
  tintOpacity: { light: 0.04, dark: 0.08 },
  refraction: 0.5,
  distortion: 0.15,
  illumination: 0.6,
  chromaticAberration: 0.15,
  edgeWidth: 20,
  borderWidth: 1,
  borderOpacity: 0.35,
  appearance: 'clear',
  fallbackColor: FALLBACK,
};

/** Tuned against Apple's UIGlassEffect (.regular) rendered over the same scene. */
export const liquid: GlassMaterial = {
  blur: 4,
  tint: { light: '#FFFFFF', dark: '#1C1C1E' },
  tintOpacity: { light: 0.6, dark: 0.5 },
  refraction: 1,
  distortion: 0.02,
  illumination: 0.8,
  chromaticAberration: 0,
  edgeWidth: 10,
  borderWidth: 1,
  borderOpacity: 0.4,
  appearance: 'regular',
  fallbackColor: FALLBACK,
};

/** Tuned against Apple's UIGlassEffect (.clear) rendered over the same scene. */
export const liquidClear: GlassMaterial = {
  blur: 0,
  tint: { light: '#FFFFFF', dark: '#1C1C1E' },
  tintOpacity: { light: 0.2, dark: 0.25 },
  refraction: 1,
  distortion: 0.02,
  illumination: 1,
  chromaticAberration: 0,
  edgeWidth: 16,
  borderWidth: 1,
  borderOpacity: 0.4,
  appearance: 'clear',
  fallbackColor: FALLBACK,
};

export const MATERIALS: Readonly<Record<GlassMaterialName, GlassMaterial>> = {
  thin,
  regular,
  thick,
  clear,
  liquid,
  liquidClear,
};

export function isMaterialName(value: unknown): value is GlassMaterialName {
  return typeof value === 'string' && value in MATERIALS;
}
