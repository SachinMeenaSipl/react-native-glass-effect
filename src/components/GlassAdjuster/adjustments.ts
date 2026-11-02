import { clamp } from '../../utils/clamp';

/** The values <GlassAdjuster> edits. Spread them onto any glass component. */
export interface GlassAdjustments {
  intensity: number;
  blur: number;
  tintOpacity: number;
  refraction: number;
  distortion: number;
  illumination: number;
  chromaticAberration: number;
  edgeWidth: number;
  borderOpacity: number;
  cornerRadius: number;
  lightAngle: number;
}

export type GlassAdjustmentKey = keyof GlassAdjustments;

/** Matches the `regular` material. */
export const DEFAULT_GLASS_ADJUSTMENTS: Readonly<GlassAdjustments> = {
  intensity: 1,
  blur: 20,
  tintOpacity: 0.14,
  refraction: 0.35,
  distortion: 0.1,
  illumination: 0.5,
  chromaticAberration: 0,
  edgeWidth: 16,
  borderOpacity: 0.3,
  cornerRadius: 24,
  lightAngle: -60,
};

export const ADJUSTMENT_RANGES: Readonly<
  Record<GlassAdjustmentKey, { label: string; min: number; max: number; step: number }>
> = {
  intensity: { label: 'Intensity', min: 0, max: 1, step: 0.05 },
  blur: { label: 'Blur', min: 0, max: 100, step: 2 },
  tintOpacity: { label: 'Tint', min: 0, max: 1, step: 0.05 },
  refraction: { label: 'Refraction', min: 0, max: 1, step: 0.05 },
  distortion: { label: 'Distortion', min: 0, max: 1, step: 0.05 },
  illumination: { label: 'Light', min: 0, max: 1, step: 0.05 },
  chromaticAberration: { label: 'RGB split', min: 0, max: 1, step: 0.05 },
  edgeWidth: { label: 'Rim width', min: 0, max: 40, step: 2 },
  borderOpacity: { label: 'Border', min: 0, max: 1, step: 0.05 },
  cornerRadius: { label: 'Corners', min: 0, max: 60, step: 4 },
  lightAngle: { label: 'Light angle', min: -180, max: 180, step: 15 },
};

/** One +/- press. Stays in range and avoids float noise such as 0.30000000000000004. */
export function stepAdjustment(
  value: GlassAdjustments,
  key: GlassAdjustmentKey,
  direction: 1 | -1
): GlassAdjustments {
  const { min, max, step } = ADJUSTMENT_RANGES[key];
  const next = clamp(value[key] + direction * step, min, max, value[key]);
  return { ...value, [key]: Number(next.toFixed(2)) };
}
