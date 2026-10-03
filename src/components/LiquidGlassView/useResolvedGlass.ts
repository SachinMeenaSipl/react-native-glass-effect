import { useMemo } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import { useReduceTransparency } from '../../accessibility/useReduceTransparency';
import { resolveMaterial } from '../../materials/resolveMaterial';
import type { GlassAppearanceProps, ResolvedGlass } from '../../materials/types';
import { normalizeQuality } from '../../quality/normalizeQuality';
import type { GlassQuality } from '../../quality/types';
import { useGlassTheme } from '../../theme/useGlassTheme';
import { clamp } from '../../utils/clamp';
import { resolveCornerRadius } from '../../utils/cornerRadius';

export interface ResolvedGlassProps extends ResolvedGlass {
  cornerRadius: number;
  quality: GlassQuality;
  reduceTransparency: boolean;
  backdropId: string;
  interactive: boolean;
  motionLighting: boolean;
  transitionDuration: number;
  clipContent: boolean;
}

/**
 * All the "what should this glass look like" logic for one component, in one hook.
 * Components stay tiny; this hook is where theme + material + props + a11y meet.
 */
export function useResolvedGlass(
  props: GlassAppearanceProps,
  style: StyleProp<ViewStyle>
): ResolvedGlassProps {
  const theme = useGlassTheme();
  const systemReduceTransparency = useReduceTransparency();
  const flatStyle = StyleSheet.flatten(style) ?? {};
  const styleRadius = flatStyle.borderRadius;

  const {
    material, intensity, blur, tint, tintOpacity, refraction, distortion,
    illumination, lightAngle, chromaticAberration, edgeWidth, borderWidth,
    borderOpacity, fallbackColor, cornerRadius, quality, reduceTransparency,
    backdropId, interactive, motionLighting, transitionDuration, clipContent,
  } = props;

  const resolved = useMemo(
    () =>
      resolveMaterial({
        props: {
          material, intensity, blur, tint, tintOpacity, refraction, distortion,
          illumination, lightAngle, chromaticAberration, edgeWidth, borderWidth,
          borderOpacity, fallbackColor,
        },
        colorScheme: theme.resolvedScheme,
        defaultMaterial: theme.defaultMaterial,
        materialOverrides: theme.materials,
      }),
    [
      material, intensity, blur, tint, tintOpacity, refraction, distortion,
      illumination, lightAngle, chromaticAberration, edgeWidth, borderWidth,
      borderOpacity, fallbackColor, theme.resolvedScheme, theme.defaultMaterial,
      theme.materials,
    ]
  );

  return {
    ...resolved,
    cornerRadius: resolveCornerRadius(cornerRadius, styleRadius, theme.cornerRadius),
    quality: normalizeQuality(quality, theme.defaultQuality),
    reduceTransparency:
      reduceTransparency === undefined || reduceTransparency === 'auto'
        ? systemReduceTransparency
        : reduceTransparency,
    backdropId: backdropId ?? '',
    interactive: interactive ?? false,
    motionLighting: motionLighting ?? false,
    transitionDuration: clamp(transitionDuration, 0, 2000, 180),
    clipContent: clipContent ?? true,
  };
}
