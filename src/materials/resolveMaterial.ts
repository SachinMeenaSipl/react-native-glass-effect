import { clamp, clamp01 } from '../utils/clamp';
import { warnOnce } from '../utils/warnOnce';
import { MATERIALS, isMaterialName } from './presets';
import type {
  GlassAppearanceProps,
  GlassMaterial,
  GlassMaterialName,
  ResolvedGlass,
} from './types';

/** Upper bound for blur. Bigger radii cost a lot and look the same. */
export const MAX_BLUR_DP = 100;
export const MAX_EDGE_WIDTH_DP = 64;
export const MAX_BORDER_WIDTH_DP = 8;

export interface ResolveMaterialInput {
  props: GlassAppearanceProps;
  colorScheme: 'light' | 'dark';
  defaultMaterial: GlassMaterialName;
  /** Theme overrides per material (partial). */
  materialOverrides?: Partial<Record<GlassMaterialName, Partial<GlassMaterial>>>;
}

/**
 * Turn "material + overrides + theme + colour scheme" into flat native props.
 *
 * Order of precedence (last wins):
 *   built-in preset → theme override → component prop
 * then `intensity` scales the effect strengths, and everything is clamped.
 *
 * Pure function: no React, no native. Covered by unit tests.
 */
export function resolveMaterial(input: ResolveMaterialInput): ResolvedGlass {
  const { props, colorScheme, defaultMaterial, materialOverrides } = input;

  let name: GlassMaterialName = defaultMaterial;
  if (props.material !== undefined) {
    if (isMaterialName(props.material)) {
      name = props.material;
    } else {
      warnOnce(
        `Unknown material "${String(props.material)}". Using "${defaultMaterial}". ` +
          `Valid values: ${Object.keys(MATERIALS).join(', ')}.`
      );
    }
  }

  const base: GlassMaterial = { ...MATERIALS[name], ...(materialOverrides?.[name] ?? {}) };
  const intensity = clamp01(props.intensity, 1);

  const blur = clamp(props.blur ?? base.blur, 0, MAX_BLUR_DP, base.blur);
  const refraction = clamp01(props.refraction ?? base.refraction, base.refraction);
  const distortion = clamp01(props.distortion ?? base.distortion, base.distortion);
  const illumination = clamp01(props.illumination ?? base.illumination, base.illumination);
  const chroma = clamp01(
    props.chromaticAberration ?? base.chromaticAberration,
    base.chromaticAberration
  );

  return {
    blurRadius: blur * intensity,
    tintColor: props.tint ?? base.tint[colorScheme],
    tintOpacity: clamp01(props.tintOpacity ?? base.tintOpacity[colorScheme], 0.12),
    refraction: refraction * intensity,
    distortion: distortion * intensity,
    illumination: illumination * intensity,
    lightAngle: normalizeAngle(props.lightAngle ?? -60),
    chromaticAberration: chroma * intensity,
    edgeWidth: clamp(props.edgeWidth ?? base.edgeWidth, 0, MAX_EDGE_WIDTH_DP, base.edgeWidth),
    glassBorderWidth: clamp(
      props.borderWidth ?? base.borderWidth,
      0,
      MAX_BORDER_WIDTH_DP,
      base.borderWidth
    ),
    glassBorderOpacity: clamp01(props.borderOpacity ?? base.borderOpacity, base.borderOpacity),
    appearance: base.appearance,
    fallbackColor: props.fallbackColor ?? base.fallbackColor[colorScheme],
  };
}

/** Wrap any angle into [-180, 180). Non-finite → -60 (light from top-right). */
export function normalizeAngle(deg: number): number {
  if (!Number.isFinite(deg)) return -60;
  const wrapped = ((((deg + 180) % 360) + 360) % 360) - 180;
  return wrapped;
}
