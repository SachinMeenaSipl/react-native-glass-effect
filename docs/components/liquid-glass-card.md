# LiquidGlassCard

A padded glass container for grouped content. It's a [`LiquidGlassView`](/components/liquid-glass-view) with a `padding` prop.

<Preview id="liquid-glass-card" />

## Example

<<< @/../examples/shared/scenes/CardScene.tsx

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
