---
description: "Complete API reference for react-native-liquid-glass-native: every component, hook, function, constant and TypeScript type the package exports."
---

# API reference

Everything the package exports. Anything not listed here is internal and may change without notice.

```ts
import { … } from 'react-native-liquid-glass-native';
```

## Components

| Export | Page |
|---|---|
| `LiquidGlassView` | [LiquidGlassView](/components/liquid-glass-view) |
| `GlassBackdrop` | [GlassBackdrop](/components/glass-backdrop) |
| `LiquidGlass` | [LiquidGlass](/components/liquid-glass) |
| `FrostedGlass` | [FrostedGlass](/components/frosted-glass) |
| `LiquidGlassButton` | [LiquidGlassButton](/components/liquid-glass-button) |
| `LiquidGlassCard` | [LiquidGlassCard](/components/liquid-glass-card) |
| `GlassAdjuster` | [GlassAdjuster](/components/glass-adjuster) |
| `GlassThemeProvider` | [GlassThemeProvider](/components/glass-theme-provider) |

`LiquidGlassView`, `GlassBackdrop`, `LiquidGlass`, `FrostedGlass` and `LiquidGlassCard` forward a ref to the underlying `View`.

## Hooks

| Hook | Returns |
|---|---|
| `useGlassCapabilities()` | [`GlassCapabilities`](#glasscapabilities). Re-reads when the app returns to the foreground |
| `useGlassTheme()` | The current [`GlassTheme`](#glasstheme) plus `resolvedScheme: 'light' \| 'dark'` |
| `useReduceTransparency()` | `boolean`. The iOS Reduce Transparency setting, live. `false` on Android and web |
| `useReduceMotion()` | `boolean`. The system Reduce Motion setting, live |

## Functions

| Function | What it does |
|---|---|
| `getGlassCapabilities()` | Same as the hook, synchronously. Never throws |
| `getGlassStats()` | Performance counters since the last reset. See [Diagnostics](/features/diagnostics) |
| `resetGlassStats()` | Reset the counters |
| `resolveMaterial(input)` | The exact values a glass would render with. See [Appearance](/features/appearance#match-your-own-ui-to-the-glass) |
| `stepAdjustment(value, key, direction)` | One − / + step of a `GlassAdjustments` value. See [GlassAdjuster](/components/glass-adjuster#helpers) |

## Constants

| Constant | What it is |
|---|---|
| `MATERIALS` | The six built-in material presets. See [Materials](/features/materials) |
| `defaultTheme` | The theme used without a provider |
| `DEFAULT_GLASS_ADJUSTMENTS` | Starting values for `GlassAdjuster` (the `regular` material) |
| `ADJUSTMENT_RANGES` | `{ label, min, max, step }` for each adjustable value |

## Types

### Props

| Type | For |
|---|---|
| `LiquidGlassViewProps` | `LiquidGlassView`: `ViewProps` + `GlassAppearanceProps` + `pressed` |
| `GlassBackdropProps` | `GlassBackdrop`: `ViewProps` + `backdropId` |
| `LiquidGlassProps` | `LiquidGlass` |
| `FrostedGlassProps` | `FrostedGlass` |
| `LiquidGlassButtonProps` | `LiquidGlassButton` |
| `GlassButtonSize` | `'small' \| 'medium' \| 'large'` |
| `LiquidGlassCardProps` | `LiquidGlassCard` |
| `GlassAdjusterProps` | `GlassAdjuster` |
| `GlassThemeProviderProps` | `GlassThemeProvider` |
| `GlassAppearanceProps` | Every look and behaviour prop shared by the glass components |

### Materials

| Type | Definition |
|---|---|
| `GlassMaterialName` | `'thin' \| 'regular' \| 'thick' \| 'clear' \| 'liquid' \| 'liquidClear'` |
| `GlassMaterial` | The values of one material (blur, tint, tintOpacity, refraction…) |
| `SchemeColor` | `{ light: ColorValue; dark: ColorValue }` |
| `ResolvedGlass` | What `resolveMaterial` returns: flat values ready for native |

### GlassTheme

```ts
interface GlassTheme {
  defaultMaterial: GlassMaterialName;
  defaultQuality: GlassQuality;
  cornerRadius: number;
  colorScheme: 'auto' | 'light' | 'dark';
  iosRenderer: 'system' | 'shader';
  materials: Partial<Record<GlassMaterialName, Partial<GlassMaterial>>>;
}

type GlassThemeOverrides = Partial<GlassTheme>;
```

### GlassCapabilities

```ts
interface GlassCapabilities {
  platform: 'android' | 'ios' | 'web' | 'unknown';
  osVersion: number;
  bestRenderer: GlassRenderer;
  supportsBlur: boolean;
  supportsRefraction: boolean;
  isLowRamDevice: boolean;
  isPowerSaveMode: boolean;
  reduceTransparency: boolean;
  reduceMotion: boolean;
  isNativeAvailable: boolean;
}

type GlassRenderer = 'shader' | 'blur' | 'compat' | 'system-glass' | 'system-material' | 'fallback';
```

### Others

| Type | Definition |
|---|---|
| `GlassQuality` | `'auto' \| 'high' \| 'medium' \| 'low' \| 'static'` |
| `GlassStats` | The counters from `getGlassStats()` |
| `GlassAdjustments` | The values `GlassAdjuster` edits |
| `GlassAdjustmentKey` | One key of `GlassAdjustments` |
