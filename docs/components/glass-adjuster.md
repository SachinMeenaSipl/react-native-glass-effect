# GlassAdjuster

A ready-made panel of − / + controls for tuning glass live. It edits one plain object, which you spread onto any glass component. Useful while designing, in a settings screen, or in a debug menu.

<Preview id="glass-adjuster" />

## Example

<<< @/../examples/shared/scenes/GlassAdjusterScene.tsx

Tap − or + and the glass above updates. The panel itself is a thick `FrostedGlass`.

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| `value` | `GlassAdjustments` | — (required) | The current values |
| `onChange` | `(value: GlassAdjustments) => void` | — (required) | Called with the full new object on every change |
| `controls` | `GlassAdjustmentKey[]` | all | Which rows to show, in this order |
| `defaults` | `GlassAdjustments` | `DEFAULT_GLASS_ADJUSTMENTS` | What the Reset button restores |
| `style` | ViewStyle | — | Outer style |

## The values

`DEFAULT_GLASS_ADJUSTMENTS` matches the `regular` material. Each control steps within a range:

| Key | Label | Default | Min | Max | Step |
|---|---|---|---|---|---|
| `intensity` | Intensity | 1 | 0 | 1 | 0.05 |
| `blur` | Blur | 20 | 0 | 100 | 2 |
| `tintOpacity` | Tint | 0.14 | 0 | 1 | 0.05 |
| `refraction` | Refraction | 0.35 | 0 | 1 | 0.05 |
| `distortion` | Distortion | 0.1 | 0 | 1 | 0.05 |
| `illumination` | Light | 0.5 | 0 | 1 | 0.05 |
| `chromaticAberration` | RGB split | 0 | 0 | 1 | 0.05 |
| `edgeWidth` | Rim width | 16 | 0 | 40 | 2 |
| `borderOpacity` | Border | 0.3 | 0 | 1 | 0.05 |
| `cornerRadius` | Corners | 24 | 0 | 60 | 4 |
| `lightAngle` | Light angle | -60 | -180 | 180 | 15 |

## Helpers

| Export | What it is |
|---|---|
| `DEFAULT_GLASS_ADJUSTMENTS` | The defaults above |
| `ADJUSTMENT_RANGES` | `{ label, min, max, step }` for each key. Use it to build your own controls, such as sliders |
| `stepAdjustment(value, key, direction)` | Returns a new object with one key stepped up (`1`) or down (`-1`), kept in range and rounded |

```tsx
import { ADJUSTMENT_RANGES, stepAdjustment } from 'react-native-liquid-glass-native';

const next = stepAdjustment(look, 'blur', 1); // blur 20 → 22
const { min, max } = ADJUSTMENT_RANGES.blur;  // 0, 100
```
