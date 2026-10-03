import type { GlassAppearanceProps } from '../materials/types';

/**
 * Every prop that describes how glass LOOKS (as opposed to layout/behaviour).
 * Used by composed components (Button, Card) to forward glass props to the
 * inner LiquidGlassView and everything else to the outer wrapper.
 *
 * Keep this list in sync with `GlassAppearanceProps` — a unit test enforces it.
 */
export const GLASS_PROP_KEYS = [
  'material',
  'intensity',
  'blur',
  'tint',
  'tintOpacity',
  'refraction',
  'distortion',
  'illumination',
  'lightAngle',
  'chromaticAberration',
  'edgeWidth',
  'cornerRadius',
  'borderWidth',
  'borderOpacity',
  'quality',
  'reduceTransparency',
  'fallbackColor',
  'backdropId',
  'interactive',
  'motionLighting',
  'transitionDuration',
  'clipContent',
] as const satisfies ReadonlyArray<keyof GlassAppearanceProps>;

export function splitGlassProps<T extends GlassAppearanceProps>(
  props: T
): { glass: GlassAppearanceProps; rest: Omit<T, keyof GlassAppearanceProps> } {
  const glass: Record<string, unknown> = {};
  const rest: Record<string, unknown> = {};
  const keys = new Set<string>(GLASS_PROP_KEYS);
  for (const key of Object.keys(props)) {
    const value = (props as Record<string, unknown>)[key];
    if (keys.has(key)) glass[key] = value;
    else rest[key] = value;
  }
  return {
    glass: glass as GlassAppearanceProps,
    rest: rest as Omit<T, keyof GlassAppearanceProps>,
  };
}
