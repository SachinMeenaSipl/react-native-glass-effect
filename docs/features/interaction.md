# Touch and motion

Glass can react to touch, follow device tilt, and animate between looks.

<Preview id="interaction" />

## Example

<<< @/../examples/shared/scenes/InteractionScene.tsx

## `interactive`

Default `false` (`true` on `LiquidGlassButton`).

| Platform | What happens |
|---|---|
| Android | A light follows the finger, and the surface squishes on press and springs back on release |
| iOS 26+ | Apple's interactive glass |
| iOS 15–25, web | No effect |

The squish is applied to the canvas, not the view's transform, so it doesn't fight with your own animations (Reanimated, `Animated`).

## `motionLighting`

Default `false`. Android only. The rim light moves when the phone tilts, using the gyroscope.

It keeps the gyroscope running while the glass is on screen, so use it on one hero element, not on every card.

## `transitionDuration`

When glass props change (material, tint, blur…), the glass animates to the new values natively. `transitionDuration` sets how long, in ms. Default `180`. `0` changes instantly.

```tsx
<LiquidGlassView material={expanded ? 'thick' : 'thin'} transitionDuration={250} />
```

React renders once with the new props; the animation between the old and new values runs on the native side.

## `pressed`

An advanced prop that forces the pressed highlight. `LiquidGlassButton` sets it for you. Use it when you build your own pressable glass:

```tsx
const [pressed, setPressed] = useState(false);

<Pressable onPressIn={() => setPressed(true)} onPressOut={() => setPressed(false)}>
  <LiquidGlassView interactive pressed={pressed} style={styles.chip} />
</Pressable>
```

## Reduce Motion

When the system's Reduce Motion (iOS) or Remove Animations (Android) setting is on:

- No squish, no animated prop transitions, no tilt lighting.
- The press highlight still shows.

See [Accessibility](/features/accessibility).
