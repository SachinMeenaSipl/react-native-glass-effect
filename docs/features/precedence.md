---
description: "How Liquid Glass props combine: material defaults, theme overrides, explicit props, intensity, clamping, platform behaviour, fallbacks and animation."
---

# Property behaviour and precedence

How the library turns a material, a theme and your props into what's drawn. Everything on this page comes from `src/materials/resolveMaterial.ts` and `src/components/LiquidGlassView/useResolvedGlass.ts`.

## Order of precedence

For each look value, the last source that sets it wins:

1. **The built-in material preset** (`material`, or the theme's `defaultMaterial`, or `regular`).
2. **The theme's override** for that material (`GlassThemeProvider` → `materials`).
3. **The component prop** (`blur`, `tint`, `refraction`…).
4. Then **`intensity`** scales the effect strengths, and every value is **clamped** to a safe range.

```tsx
<GlassThemeProvider theme={{ materials: { thick: { blur: 40 } } }}>
  <LiquidGlassView material="thick" />            {/* blur 40: theme beats preset (36) */}
  <LiquidGlassView material="thick" blur={12} />  {/* blur 12: prop beats theme */}
</GlassThemeProvider>
```

Changing `material` while other props are set keeps your props: only the values you didn't set come from the new material.

## What `intensity` does

`intensity` (0–1, default 1) multiplies these values after they're resolved:

| Scaled by `intensity` | Not scaled |
|---|---|
| `blur`, `refraction`, `distortion`, `illumination`, `chromaticAberration` | `tint`, `tintOpacity`, `edgeWidth`, `borderWidth`, `borderOpacity`, `lightAngle`, `cornerRadius` |

So `intensity={0}` gives a tinted, bordered surface with no blur, lensing or rim light. It doesn't make the view invisible.

## Ranges and invalid values

| Value | Range | Out of range or invalid |
|---|---|---|
| `blur` | 0–100 dp | Clamped |
| `intensity`, `tintOpacity`, `refraction`, `distortion`, `illumination`, `chromaticAberration`, `borderOpacity` | 0–1 | Clamped |
| `edgeWidth` | 0–64 dp | Clamped |
| `borderWidth` | 0–8 dp | Clamped |
| `lightAngle` | any number | Wrapped into −180…180. A non-finite value becomes −60 |
| `transitionDuration` | 0–2000 ms | Clamped |
| `cornerRadius` | ≥ 0 | Negative becomes 0. Clamped natively to half the shortest side |
| `material` | the six names | Unknown name: a one-time dev warning, then the default material |
| `quality` | `auto` `high` `medium` `low` `static` | Unknown value: a one-time dev warning, then the theme default |

## Where each value comes from when you don't set it

| Prop | Default |
|---|---|
| `material` | theme `defaultMaterial` (`regular`) |
| `cornerRadius` | `style.borderRadius` if it's a number, else theme `cornerRadius` (24). Percentage strings are ignored |
| `quality` | theme `defaultQuality` (`auto`) |
| `iosRenderer` | theme `iosRenderer` (`system`) |
| `reduceTransparency` | `'auto'`: follows iOS Reduce Transparency (always off on Android and web) |
| `interactive` | `false` (`true` on `LiquidGlassButton`) |
| `motionLighting` | `false` |
| `transitionDuration` | 180 ms |
| `clipContent` | `true` |
| `lightAngle` | −60 |

## Quality

`quality` doesn't change the resolved look values. It tells the native renderer how much work to do: whether to run the refraction shader, how often to re-capture on Android 7–11, and whether to capture only once (`static`). `auto` is decided natively per device. See [Quality and performance](/features/quality).

## When a platform can't draw an effect

The prop is accepted and ignored: no error, and no warning. For example `refraction` on Android 12 or on the web. The [platform tables](/components/liquid-glass-view#platform-behaviour) list what each platform draws.

::: info
The library doesn't warn in development when you set a prop the current platform ignores. That would be a useful addition; see [Contributing](https://github.com/SachinMeenaSipl/react-native-glass-effect/blob/main/CONTRIBUTING.md).
:::

## Fallbacks

| Situation | What's drawn |
|---|---|
| `reduceTransparency` resolves to on | An opaque surface in `fallbackColor` |
| Android: no backdrop behind the glass, or the glass is inside one | The opaque fallback surface, and one log line |
| Android: the GPU rejects the shader | The `blur` renderer (no refraction) |
| Expo Go, tests, missing native code | A tinted view: the tint at least 55% opaque, the border and corner radius, no blur |
| Web | The CSS renderer: `backdrop-filter: blur(<blur>px) saturate(160%)`, the tint at `tintOpacity`, border and corners |

## Animation

When glass props change, the new values animate over `transitionDuration` ms. On Android the change is interpolated in native code (`GlassConfigTransition`), so React renders once and the frames are drawn natively. On iOS the system effect animates. On the web, changes apply immediately.

With Reduce Motion on, prop changes apply without animation.
