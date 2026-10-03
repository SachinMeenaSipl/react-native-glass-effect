# 4 · Components & props

## `<LiquidGlassView>`

Accepts **all `<View>` props** (style, children, onLayout, pointerEvents, accessibility…) plus:

| Prop | Type | Default | What it does | Android | iOS |
|---|---|---|---|---|---|
| `material` | `'thin' \| 'regular' \| 'thick' \| 'clear'` | theme (`'regular'`) | Starting look | ✅ | ✅ |
| `intensity` | 0–1 | `1` | One knob that scales blur, refraction, distortion, light and RGB split | ✅ | ✅ (blur, light) |
| `blur` | dp, 0–100 | material | Blur radius | ✅ | picks nearest system material |
| `tint` | colour | material | Colour over the blur. `PlatformColor` works | ✅ | ✅ |
| `tintOpacity` | 0–1 | material | Strength of the tint | ✅ | ✅ |
| `refraction` | 0–1 | material | Bent-light edge (the "thick glass rim") | 13+ | — |
| `distortion` | 0–1 | material | Slight magnifying-lens effect | 13+ | — |
| `illumination` | 0–1 | material | Rim highlight strength | ✅ | ✅ (sheen) / system on 26 |
| `lightAngle` | degrees | `-60` | Where light comes from. `-90` = top, `0` = right, `90` = bottom | ✅ | ✅ |
| `chromaticAberration` | 0–1 | material | Rainbow split at the rim (quality `high`) | 13+ | — |
| `edgeWidth` | dp | material | How wide the refracting rim is | ✅ | — |
| `cornerRadius` | dp | `style.borderRadius` → theme (24) | Shape. Large values make a pill | ✅ | ✅ |
| `borderWidth` | dp, 0–8 | `1` | Glass border (lighter on the lit side) | ✅ | ✅ |
| `borderOpacity` | 0–1 | material | Border strength | ✅ | ✅ |
| `quality` | `'auto' \| 'high' \| 'medium' \| 'low' \| 'static'` | `'auto'` | Performance budget | ✅ | system decides |
| `reduceTransparency` | `boolean \| 'auto'` | `'auto'` | Opaque surface instead of glass. `auto` follows the iOS setting | ✅ | ✅ |
| `fallbackColor` | colour | material | Colour used when glass is off | ✅ | ✅ |
| `interactive` | boolean | `false` | Light follows the finger + squish on press | ✅ | 26+ system |
| `motionLighting` | boolean | `false` | Highlight moves when the phone tilts (uses the gyroscope) | ✅ | — |
| `transitionDuration` | ms | `180` | How long prop changes animate. `0` = instant | ✅ | ✅ (effect) |
| `backdropId` | string | — | Sample a specific `<GlassBackdrop backdropId>` | ✅ | — |
| `clipContent` | boolean | `true` | Clip children to the rounded shape | ✅ | ✅ |
| `pressed` | boolean | `false` | Advanced: force the pressed highlight | ✅ | ✅ |

> Don't set `backgroundColor` on glass; use `tint`. A background colour is drawn **under** the blur and won't be visible.

## `<GlassBackdrop>`

All `<View>` props, plus:

| Prop | Type | What it does |
|---|---|---|
| `backdropId` | string | Name it when a screen has several backdrops |

## `<LiquidGlassButton>`

All glass props above, all `Pressable` props (`onPress`, `onLongPress`, `disabled`, `hitSlop`…), plus:

| Prop | Type | Default | What it does |
|---|---|---|---|
| `title` | string | — | Label (ignored if `children` given) |
| `children` | node | — | Custom content, e.g. icon + text |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | 36 / 48 / 56 dp tall |
| `style` | ViewStyle | — | Outer style (margin, width, position) |
| `contentStyle` | ViewStyle | — | Inner row style |
| `textStyle` | TextStyle | — | Title style |

Defaults that differ from `LiquidGlassView`: `interactive = true`, and `cornerRadius = height / 2` (pill).

## `<LiquidGlassCard>`

`LiquidGlassView` + `padding` (dp, default 16).

## `<GlassThemeProvider>`

```tsx
<GlassThemeProvider theme={{
  defaultMaterial: 'regular',  // used when no material prop
  defaultQuality: 'auto',
  cornerRadius: 24,
  colorScheme: 'auto',         // 'light' | 'dark' to force
  materials: { regular: { blur: 24, tintOpacity: { light: 0.2, dark: 0.3 } } },
}}>
```

Providers can be nested; the inner one wins.

## Hooks and functions

| API | Returns |
|---|---|
| `useGlassCapabilities()` | `{ bestRenderer, supportsRefraction, isPowerSaveMode, isLowRamDevice, reduceTransparency, reduceMotion, isNativeAvailable, platform, osVersion }`. Refreshes when the app returns to the foreground |
| `getGlassCapabilities()` | Same, synchronously (non-hook) |
| `useGlassTheme()` | Current theme + `resolvedScheme` |
| `useReduceTransparency()` | iOS setting (Android: `false`) |
| `useReduceMotion()` | System reduce-motion setting |
| `resolveMaterial(input)` | The exact values a glass would render with (useful for matching custom UI) |
| `MATERIALS` | The built-in presets |
| `getGlassStats()` / `resetGlassStats()` | Performance counters for development: draws, GPU blur passes, shader passes, snapshot captures + ms, far changes skipped, solid draws, live views (Android: all; iOS: live views only) |
