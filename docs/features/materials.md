# Materials

A material is a named look: a set of values for blur, tint, refraction, light and border, with light and dark variants. Every glass starts from one.

<Preview id="materials" />

## Example

<<< @/../examples/shared/scenes/MaterialsScene.tsx

## The six materials

| Material | Feels like | Good for |
|---|---|---|
| `thin` | Barely frosted | Overlays on photos, floating chips |
| `regular` | Classic glass (the default) | Headers, cards, buttons |
| `thick` | Milky, very readable | Sheets, menus, text-heavy panels |
| `clear` | A lens, almost no frost | Small controls over busy media |
| `liquid` | Apple-style Liquid Glass | Used by `<LiquidGlass>` |
| `liquidClear` | Apple-style clear lens | Used by `<LiquidGlass variant="clear">` |

## Every value

| Value | `thin` | `regular` | `thick` | `clear` | `liquid` | `liquidClear` |
|---|---|---|---|---|---|---|
| `blur` (dp) | 10 | 20 | 36 | 4 | 4 | 0 |
| `tint` light / dark | `#FFFFFF` / `#1C1C1E` | `#FFFFFF` / `#1C1C1E` | `#FFFFFF` / `#1C1C1E` | `#FFFFFF` / `#000000` | `#FFFFFF` / `#1C1C1E` | `#FFFFFF` / `#1C1C1E` |
| `tintOpacity` light / dark | 0.08 / 0.18 | 0.14 / 0.28 | 0.28 / 0.45 | 0.04 / 0.08 | 0.60 / 0.50 | 0.20 / 0.25 |
| `refraction` | 0.25 | 0.35 | 0.30 | 0.50 | 1.00 | 1.00 |
| `distortion` | 0.05 | 0.10 | 0.08 | 0.15 | 0.02 | 0.02 |
| `illumination` | 0.40 | 0.50 | 0.45 | 0.60 | 0.80 | 1.00 |
| `chromaticAberration` | 0 | 0 | 0 | 0.15 | 0 | 0 |
| `edgeWidth` (dp) | 12 | 16 | 18 | 20 | 10 | 16 |
| `borderWidth` (dp) | 1 | 1 | 1 | 1 | 1 | 1 |
| `borderOpacity` | 0.25 | 0.30 | 0.25 | 0.35 | 0.40 | 0.40 |
| `appearance` (iOS 26) | regular | regular | regular | clear | regular | clear |
| `fallbackColor` light / dark | `#F2F2F7` / `#2C2C2E` | same | same | same | same | same |

The values are exported as `MATERIALS`:

```tsx
import { MATERIALS } from 'react-native-liquid-glass-native';

MATERIALS.thick.blur; // 36
```

## Override one value

Any prop on a component overrides the material for that component only:

```tsx
<LiquidGlassView material="thick" blur={48} tint="#A0C4FF" />
```

## Change a material app-wide

Override the preset in the theme. Every component using that material picks it up:

```tsx
<GlassThemeProvider
  theme={{
    materials: {
      thick: { blur: 40 },
      regular: { tint: { light: '#FFFFFF', dark: '#101820' } },
    },
  }}
>
  <App />
</GlassThemeProvider>
```

See [Theming](/features/theming).

## Light and dark

Each material has a light and a dark tint, tint opacity and fallback colour. The library follows the system colour scheme. Force one with `colorScheme: 'light' | 'dark'` in the theme.

## Choosing a material

| Your content behind the glass | Text on the glass | Pick |
|---|---|---|
| Busy photo or video | Long text | `thick` |
| Busy photo or video | A short label or icon | `thin` or `clear` |
| Calm colours or gradients | Anything | `regular` |
| You want Apple's look | Anything | `liquid` (or `<LiquidGlass>`) |

`thin` and `clear` over busy photos usually fail contrast for body text. See [Accessibility](/features/accessibility).
