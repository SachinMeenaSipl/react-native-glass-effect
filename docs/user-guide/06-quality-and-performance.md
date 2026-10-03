# 6 · Quality & performance

## Modes

| `quality` | Android 13+ | Android 12 | Android 7–11 | iOS |
|---|---|---|---|---|
| `auto` (default) | chosen per device | chosen per device | chosen per device | system |
| `high` | blur + refraction + RGB split | blur | re-capture every frame | system |
| `medium` | blur + refraction | blur | re-capture ≤ every 32 ms | system |
| `low` | blur only | blur | re-capture ≤ every 100 ms, lower res | system |
| `static` | captured once; ignores content changes (still follows movement) | same | same | system |

## What `auto` does

1. High-end Android 13+ → `high`; otherwise `medium`.
2. Low-RAM phone or battery saver → `low` (updates live when battery saver toggles).
3. More than 6 glass views on screen → one step down; more than 12 → `low`.

## Tips

| Do | Why |
|---|---|
| Keep glass views few and small | Cost ≈ number of glass views × their area × blur |
| Use `quality="static"` for glass that **doesn't move** over a background that **doesn't change** (a fixed header over a still image) | Near-zero cost after the first frame. Moving glass still updates (it has to) |
| Keep big animations (video, full-screen Lottie) away from under glass | Glass over a changing area must re-blur every frame. (Changes far from a glass are skipped automatically) |
| Prefer one big backdrop (`absoluteFill`) over many small ones | Simpler matching, fewer recordings |
| Use `LiquidGlassCard` on list items only when needed | 20 glass cards on screen is a lot for mid-range phones |
| Turn off `motionLighting` unless it's a hero element | It keeps the gyroscope on |
| Profile on a real mid-range phone, not only the emulator | Emulators often have no real GPU |

## Measuring

Built-in counters (dev builds):

```ts
import { getGlassStats, resetGlassStats } from '@sachin-meena/react-native-liquid-glass';

resetGlassStats();
setTimeout(() => console.log(getGlassStats()), 1000); // work done in 1 second
```

| Counter | Healthy while idle | Meaning if high |
|---|---|---|
| `gpuBlurPasses` | 0 | Glass is re-blurring every frame: something under it keeps changing |
| `compatCaptures` / `compatCaptureMs` | 0 | Android 7–11 is re-capturing; > 8 ms per capture will drop frames |
| `skippedFarChanges` | any | Good: changes that were far from all glass and cost nothing |
| `solidDraws` | 0 | Glass has no backdrop (setup problem) or reduce transparency is on |

The example app's **Stress** screen shows these per second.

Frame timing:

```sh
adb shell dumpsys gfxinfo <your.package> framestats
```

Or use Android Studio → Profiler → "System trace". Look at RenderThread time while scrolling.
