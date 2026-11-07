# Appearance props

These props control how a glass surface looks. They work on every glass component and override the [material](/features/materials).

<Preview id="appearance" />

## Example

<<< @/../examples/shared/scenes/AppearanceScene.tsx

## `intensity`

One knob, `0`–`1`, default `1`. It multiplies blur, refraction, distortion, illumination and chromatic aberration together. Use it to fade the effect in and out, or to tone down a material without touching each value.

```tsx
<LiquidGlassView intensity={0.5} />
```

## `blur`

Blur radius in dp, `0`–`100` (larger values are clamped to 100). Larger radii cost more GPU time.

On iOS with the system renderer, `blur` picks the nearest system material on iOS 15–25 and has no effect on iOS 26 (Apple's glass sets its own blur).

## `tint` and `tintOpacity`

A colour laid over the blur, and how strong it is (`0`–`1`). Any React Native colour works, including `PlatformColor`.

```tsx
<LiquidGlassView tint="#6D5DFC" tintOpacity={0.18} />
<LiquidGlassView tint={PlatformColor('systemBlue')} /> {/* iOS */}
```

::: warning
Use `tint`, not `backgroundColor`. A background colour is drawn under the blur, so you won't see it.
:::

## `refraction`, `distortion`, `edgeWidth`

| Prop | Range | What it does |
|---|---|---|
| `refraction` | `0`–`1` | How strongly the rim bends the content behind it, like the edge of a thick lens |
| `distortion` | `0`–`1` | A slight magnifying-lens effect over the whole surface |
| `edgeWidth` | `0`–`64` dp | How wide the refracting rim is |

Android 13+, and iOS with `iosRenderer="shader"`.

## `illumination` and `lightAngle`

| Prop | Range | What it does |
|---|---|---|
| `illumination` | `0`–`1` | Strength of the specular rim highlight |
| `lightAngle` | degrees, default `-60` | Where the light comes from: `-90` top, `0` right, `90` bottom, `180` left |

## `chromaticAberration`

A rainbow split at the rim, `0`–`1`. Android 13+ with `quality="high"`, and the iOS shader renderer.

## `cornerRadius`

Corner radius in dp. If you don't set it, the library uses `style.borderRadius`, then the theme's `cornerRadius` (`24`). It's clamped to half the shortest side, so any large value (such as `999`) makes a pill or a circle.

## `borderWidth` and `borderOpacity`

The glass border, `0`–`8` dp, default `1`. It's brighter on the lit side. `borderWidth={0}` removes it.

::: warning
Use the `borderWidth` **prop**, not `style.borderWidth`. A style border is drawn by React Native on top of the glass border, so you'd get two.
:::

## Animating changes

When any of these props change, the glass animates to the new values natively over `transitionDuration` ms (default `180`). See [Touch and motion](/features/interaction).

## Match your own UI to the glass

`resolveMaterial` returns the exact values a glass would render with, for example to colour a custom view to match:

```tsx
import { resolveMaterial, useGlassTheme } from 'react-native-liquid-glass-native';

const { resolvedScheme, defaultMaterial, materials } = useGlassTheme();
const values = resolveMaterial({
  props: { material: 'thick' },
  colorScheme: resolvedScheme,
  defaultMaterial,
  materialOverrides: materials,
});
// values.tintColor, values.tintOpacity, values.blurRadius, values.fallbackColor…
```
