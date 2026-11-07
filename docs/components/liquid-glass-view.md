# LiquidGlassView

The core glass surface. Every other glass component is built from it. It accepts **every `<View>` prop** (style, children, layout events, accessibility…) plus the glass props below.

<Preview id="liquid-glass-view" />

## Example

<<< @/../examples/shared/scenes/LiquidGlassViewScene.tsx

`Background` is the colourful scrolling content used by every example. See the [Quick start](/guide/quick-start#step-1-a-background-to-blur).

## Props

### Look

| Prop | Type | Default | What it does |
|---|---|---|---|
| `material` | `'thin' \| 'regular' \| 'thick' \| 'clear' \| 'liquid' \| 'liquidClear'` | theme (`'regular'`) | The starting look. See [Materials](/features/materials) |
| `intensity` | `0`–`1` | `1` | One knob that scales blur, refraction, distortion, light and RGB split together |
| `blur` | dp, `0`–`100` | material | Blur radius |
| `tint` | colour | material | Colour laid over the blur. `PlatformColor` works |
| `tintOpacity` | `0`–`1` | material | Strength of the tint |
| `refraction` | `0`–`1` | material | How strongly the rim bends the content behind it |
| `distortion` | `0`–`1` | material | A slight magnifying-lens effect over the whole surface |
| `illumination` | `0`–`1` | material | Strength of the rim highlight |
| `lightAngle` | degrees | `-60` | Where the light comes from. `-90` top, `0` right, `90` bottom |
| `chromaticAberration` | `0`–`1` | material | A rainbow split at the rim. Needs `quality="high"` |
| `edgeWidth` | dp, `0`–`64` | material | How wide the refracting rim is |
| `cornerRadius` | dp | `style.borderRadius`, then theme (`24`) | Shape. Clamped to half the shortest side, so a large value makes a pill |
| `borderWidth` | dp, `0`–`8` | `1` | The glass border. Brighter on the lit side |
| `borderOpacity` | `0`–`1` | material | Border strength |

### Behaviour

| Prop | Type | Default | What it does |
|---|---|---|---|
| `quality` | `'auto' \| 'high' \| 'medium' \| 'low' \| 'static'` | theme (`'auto'`) | Performance budget. See [Quality](/features/quality) |
| `interactive` | boolean | `false` | Android: a light follows the finger and the surface squishes. iOS 26+: Apple's interactive glass |
| `motionLighting` | boolean | `false` | Android: the rim light follows device tilt (uses the gyroscope) |
| `transitionDuration` | ms | `180` | How long prop changes animate natively. `0` = instant |
| `clipContent` | boolean | `true` | Clip children to the rounded shape |
| `reduceTransparency` | `boolean \| 'auto'` | `'auto'` | Draw an opaque surface instead of glass. `'auto'` follows iOS Reduce Transparency |
| `fallbackColor` | colour | material | The opaque colour used when glass is off |
| `backdropId` | string | — | Sample a specific `<GlassBackdrop backdropId>`. See [GlassBackdrop](/components/glass-backdrop) |
| `iosRenderer` | `'system' \| 'shader'` | theme (`'system'`) | iOS only. See [iOS renderers](/features/ios-renderers) |
| `pressed` | boolean | `false` | Advanced: force the pressed highlight. `LiquidGlassButton` sets it for you |

## Platform behaviour

| Prop | Android 13+ | Android 12 | Android 7–11 | iOS 26+ (system) | iOS 15–25 (system) | Web |
|---|---|---|---|---|---|---|
| `blur` | ✅ | ✅ | ✅ | — | nearest system material | ✅ |
| `tint`, `tintOpacity` | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `refraction`, `distortion` | ✅ | — | — | system | — | — |
| `illumination`, `lightAngle` | ✅ | ✅ | ✅ | system | ✅ sheen | — |
| `chromaticAberration` | ✅ (`high`) | — | — | — | — | — |
| `cornerRadius`, border | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| `interactive` | ✅ | ✅ | ✅ | ✅ system | — | — |
| `motionLighting` | ✅ | ✅ | ✅ | — | — | — |

"—" means the prop is accepted and ignored. It never throws.

With the default `iosRenderer="system"` on iOS 26+, Apple draws the glass, so `blur`, `intensity`, `illumination` and `lightAngle` have no effect, and `thin`, `regular` and `thick` differ only by tint. Use `iosRenderer="shader"` for full control on iOS.

## Common mistakes

::: warning Don't use backgroundColor
`backgroundColor` on a glass view is drawn **under** the blur, so you won't see it. Use `tint` and `tintOpacity`.
:::

::: warning Don't use style borderWidth
A `borderWidth` in `style` draws React Native's own border on top of the glass border, so you get two. Use the `borderWidth` **prop**.
:::

- **The glass is a flat colour on Android.** It has no `GlassBackdrop` behind it, or it's inside one. See [Core concepts](/guide/core-concepts).
- **Animating `opacity` on iOS.** UIKit can't draw blur correctly while a view's alpha is below 1. Fade the content inside the glass instead, or scale the glass.

## Related

- [Appearance props](/features/appearance): every look prop, with examples
- [Materials](/features/materials)
- [Touch and motion](/features/interaction)
