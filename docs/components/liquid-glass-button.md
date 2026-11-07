# LiquidGlassButton

A pill-shaped glass button with press feedback. It accepts every glass prop, every `Pressable` prop (`onPress`, `onLongPress`, `disabled`, `hitSlop`…), and the props below.

<Preview id="liquid-glass-button" />

## Example

<<< @/../examples/shared/scenes/ButtonScene.tsx

## Props

| Prop | Type | Default | What it does |
|---|---|---|---|
| `title` | string | — | The label. Ignored when `children` is given |
| `children` | node | — | Custom content, such as an icon and text |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Height 36, 48 or 56 dp, with matching padding and font size |
| `style` | ViewStyle | — | Outer style: margin, width, position |
| `contentStyle` | ViewStyle | — | Style of the inner row that holds the content |
| `textStyle` | TextStyle | — | Style of the `title` text |
| `disabled` | boolean | `false` | Dims the button, turns off press feedback, announces it as disabled |

Plus every [`LiquidGlassView`](/components/liquid-glass-view#props) prop. Two defaults differ:

| Prop | Default on a button |
|---|---|
| `interactive` | `true` |
| `cornerRadius` | half the height (a pill) |

## Label colour

The title is near-black (`#111111`) in light mode and white in dark mode, following the [theme's colour scheme](/components/glass-theme-provider). On dark or busy backgrounds, set it yourself:

```tsx
<LiquidGlassButton title="New" textStyle={{ color: '#fff' }} onPress={create} />
```

## Press feedback

| Platform | What happens |
|---|---|
| Android | Native: a light follows the finger, and the glass squishes and springs back |
| iOS 26+ | A small JS scale spring, plus Apple's glass response when the touch lands on the glass itself |
| iOS 15–25, web | A small JS scale spring |
| Reduce Motion on | Highlight only, no movement |
| `disabled` | No feedback at all |

## Accessibility

The button announces as a button (`accessibilityRole="button"`), including its disabled state. Pass `accessibilityLabel` and `accessibilityHint` like on any `Pressable`.

## Related

- [Touch and motion](/features/interaction)
- [Glass header](/recipes/header): a small button inside a glass header
