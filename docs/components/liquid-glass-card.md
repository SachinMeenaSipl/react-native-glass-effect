# LiquidGlassCard

A padded glass container for grouped content. It's a [`LiquidGlassView`](/components/liquid-glass-view) with a `padding` prop.

<Preview id="liquid-glass-card" />

## Import

```tsx
import { LiquidGlassCard } from 'react-native-liquid-glass-native';
```

## Minimal example

A complete screen that uses only React Native and this library. Copy it into `App.tsx` to try it.

<<< @/../examples/shared/minimal/LiquidGlassCardMinimal.tsx

## Full example

<<< @/../examples/shared/scenes/CardScene.tsx

This is the screen in the preview above. It uses helpers from the repo's `examples/shared` folder (`Background`, the `ART` artwork and drawn icons); replace them with your own content.

## Props

All [`LiquidGlassView`](/components/liquid-glass-view#props) props, plus:

| Prop | Type | Default | What it does |
|---|---|---|---|
| `padding` | dp | `16` | Inner padding. A `padding` in `style` overrides it |

The default material is `regular`, from the theme.

## Cards in a scrolling list

Glass cards that scroll over a fixed background are a common pattern. Put only the background in the `GlassBackdrop`, and the scrolling cards on top. See [Cards over images](/recipes/cards-over-images).

## Performance

Each card is a glass view, and each glass view costs GPU time while the content under it moves. On mid-range phones, keep the number of cards on screen at once small (roughly under 10). See [Quality and performance](/features/quality).
