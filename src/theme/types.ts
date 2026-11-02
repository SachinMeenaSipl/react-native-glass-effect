import type { GlassMaterial, GlassMaterialName } from '../materials/types';
import type { GlassQuality } from '../quality/types';

export interface GlassTheme {
  /** Material used when a component doesn't pass `material`. */
  defaultMaterial: GlassMaterialName;
  /** Quality used when a component doesn't pass `quality`. */
  defaultQuality: GlassQuality;
  /** Corner radius (dp) used when neither `cornerRadius` nor `style.borderRadius` is set. */
  cornerRadius: number;
  /** Force a colour scheme, or follow the system. */
  colorScheme: 'auto' | 'light' | 'dark';
  /**
   * iOS renderer for every glass that doesn't set `iosRenderer`. 'system' is Apple's glass.
   * 'shader' makes all glass, including buttons and cards, look like Android.
   */
  iosRenderer: 'system' | 'shader';
  /** Per-material overrides, merged on top of the built-in presets. */
  materials: Partial<Record<GlassMaterialName, Partial<GlassMaterial>>>;
}

/** What you pass to <GlassThemeProvider theme={...}>. Everything optional. */
export type GlassThemeOverrides = Partial<GlassTheme>;
