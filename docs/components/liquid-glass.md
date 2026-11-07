# LiquidGlass

Apple-style Liquid Glass on both platforms. On iOS 26+ it uses Apple's own glass. On Android it uses the library's shader, tuned to match Apple's look (close, not pixel-identical).

<Preview id="liquid-glass" />

## When to use it

| Use | When you want |
|---|---|
| `LiquidGlass` | Apple's look: native on iOS, a close match on Android |
| [`FrostedGlass`](/components/frosted-glass) | The same look on both platforms, with every prop working on iOS too |
| [`LiquidGlassView`](/components/liquid-glass-view) | Full control, any material |

## Example

<<< @/../examples/shared/scenes/LiquidGlassScene.tsx

## Props

All [`LiquidGlassView`](/components/liquid-glass-view#props) props except `material`, plus:

| Prop | Type | Default | What it does |
|---|---|---|---|
| `variant` | `'regular' \| 'clear'` | `'regular'` | Everyday glass (material `liquid`), or a see-through lens (material `liquidClear`) |

## Platform behaviour

| | What draws it | Props that apply |
|---|---|---|
| iOS 26+ (default) | Apple's `UIGlassEffect` | `tint`, `tintOpacity`, `cornerRadius`, the border, `interactive` |
| iOS 26+ with `iosRenderer="shader"` | The library's Metal renderer | All of them |
| iOS 15–25 | System materials | `tint`, `tintOpacity`, `cornerRadius`, the border |
| Android | The library's shader, tuned to Apple's look | All of them |
| Web | CSS `backdrop-filter` | Blur, tint, corners, border |

On iOS with the system renderer, Apple's glass already has its own frost, so `LiquidGlass` sets `tintOpacity` to `0` unless you pass one.

## Tips

- `variant="clear"` has almost no frost. Use it for small controls (play buttons, chips) over busy media, not behind body text.
- A large `cornerRadius` makes a circle or pill, as in the example's play button.
