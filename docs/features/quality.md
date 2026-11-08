# Quality

Glass costs GPU time. The `quality` prop sets a budget per view, and the default `auto` picks one for each device. For where the cost comes from and how to measure it, see [Performance](/features/performance).

<Preview id="quality" />

## Example

<<< @/../examples/shared/scenes/QualityScene.tsx

## Modes

| `quality` | Android 13+ | Android 12 | Android 7–11 | iOS | Web |
|---|---|---|---|---|---|
| `auto` (default) | chosen per device | chosen per device | chosen per device | system | CSS |
| `high` | blur + refraction + RGB split | blur | re-capture every frame | system | CSS |
| `medium` | blur + refraction | blur | re-capture at most every 32 ms | system | CSS |
| `low` | blur only | blur | re-capture at most every 100 ms, lower resolution | system | CSS |
| `static` | captured once; ignores content changes (still follows movement) | same | same | system | CSS |

## What `auto` does

1. A high-end Android 13+ device gets `high`; others get `medium`.
2. A low-RAM phone, or battery saver on, drops to `low`. This updates live when battery saver toggles.
3. More than 6 glass views on screen drops one step; more than 12 drops to `low`.

## Set it app-wide

```tsx
<GlassThemeProvider theme={{ defaultQuality: 'medium' }}>
```

## Tips

| Do | Why |
|---|---|
| Keep glass views few and small | Cost is roughly the number of glass views × their area × blur |
| Use `quality="static"` for glass that doesn't move over a background that doesn't change | Near-zero cost after the first frame |
| Keep big animations (video, full-screen Lottie) away from under glass | Glass over a changing area re-blurs every frame. Changes far from any glass are skipped automatically |
| Prefer one big backdrop (`absoluteFill`) over many small ones | Simpler matching, fewer recordings |
| Use `LiquidGlassCard` on list items only when needed | 20 glass cards on screen is a lot for mid-range phones |
| Turn on `motionLighting` only for a hero element | It keeps the gyroscope running |
| Profile on a real mid-range phone | Emulators often have no real GPU |

## Measuring

Use [Diagnostics](/features/diagnostics) to count the work glass does per second, and Android's frame stats for timing:

```sh
adb shell dumpsys gfxinfo <your.package> framestats
```

Or Android Studio → Profiler → System trace. Look at RenderThread time while scrolling.
