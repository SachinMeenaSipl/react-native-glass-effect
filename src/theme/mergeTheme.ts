import type { GlassMaterialName } from '../materials/types';
import type { GlassTheme, GlassThemeOverrides } from './types';

/**
 * Merge a child theme onto a parent theme. Nested providers stack:
 * material overrides are merged per material, per field.
 */
export function mergeTheme(parent: GlassTheme, child?: GlassThemeOverrides): GlassTheme {
  if (!child) return parent;
  const materials = { ...parent.materials };
  for (const key of Object.keys(child.materials ?? {}) as GlassMaterialName[]) {
    materials[key] = { ...(parent.materials[key] ?? {}), ...(child.materials?.[key] ?? {}) };
  }
  return {
    defaultMaterial: child.defaultMaterial ?? parent.defaultMaterial,
    defaultQuality: child.defaultQuality ?? parent.defaultQuality,
    cornerRadius: child.cornerRadius ?? parent.cornerRadius,
    colorScheme: child.colorScheme ?? parent.colorScheme,
    materials,
  };
}
