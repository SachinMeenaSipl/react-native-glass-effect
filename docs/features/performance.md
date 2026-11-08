---
description: "What Liquid Glass costs at runtime on Android, iOS and the web, how to measure it, and the benchmark method for React Native glass views."
---

# Performance

What glass costs, where the cost comes from, and how to measure it in your app. To choose a budget per view, see [Quality](/features/quality).

## Where the cost comes from

### Android 12+ (`shader` and `blur` renderers)

| Step | Cost |
|---|---|
| `GlassBackdrop` recording its children | Low: it records a GPU display list (a `RenderNode`), not pixels |
| Each glass view, each frame the content under it changes | One GPU blur pass, plus the refraction shader on Android 13+ |
| A glass view moving (scrolling, animating) | It redraws every frame it moves, whatever the quality |
| Content changing **far** from every glass view | Nothing: those changes are skipped (`skippedFarChanges` in [Diagnostics](/features/diagnostics)) |
| Nothing moving or changing | Nothing: glass doesn't redraw |

The work grows with the number of glass views, their size on screen and the blur radius.

### Android 7–11 (`compat` renderer)

The backdrop is captured into a bitmap and blurred on the CPU. Captures are throttled by quality: every frame at `high`, at most every 32 ms at `medium`, at most every 100 ms at lower resolution at `low`, and once at `static`. A capture that takes more than about 8 ms risks dropping frames.

### iOS

With the default system renderer, UIKit draws the glass, and its cost isn't visible to the library. Apple advises keeping overlapping blur views few. The Metal shader renderer (`iosRenderer="shader"`) also samples the backdrop and runs a shader per glass view, so it costs more than the system glass.

### Web

The browser draws `backdrop-filter`. Its cost depends on the browser, the GPU and the blurred area. Large blurred areas over animating content cost the most.

## What `quality="auto"` does for you

1. A high-end Android 13+ device gets `high`; others get `medium`.
2. A low-RAM phone, or battery saver on, drops to `low`, and updates live when battery saver toggles.
3. More than 6 glass views on screen drops one step; more than 12 drops to `low`.

## Battery

- `motionLighting` keeps the gyroscope running while the glass is on screen. Use it on one hero element.
- Glass over constantly changing content (video, Lottie, spinners) redraws every frame. Keep animations away from under glass when you can.

## Measuring in your app

### Library counters

`getGlassStats()` counts the work done since the last `resetGlassStats()`: draws, GPU blur passes, shader passes, compat captures and their time, skipped far changes, solid draws and live glass views. See [Diagnostics](/features/diagnostics). On iOS only `liveGlassViews` is filled.

### Frame timing (Android)

```sh
adb shell dumpsys gfxinfo <your.package> framestats
```

Or Android Studio → Profiler → System trace, and look at RenderThread time while scrolling. Profile on a real mid-range phone: emulators often have no real GPU.

## Benchmarks

No benchmark results are published yet. The library won't claim numbers it hasn't measured. This is the method results will be collected with, so they're comparable.

| Scenario | Setup |
|---|---|
| Single glass | 1 `LiquidGlassView`, 120 × 360 dp, over a scrolling list |
| Several glass | 5 glass views over a scrolling list |
| Heavy | 10 glass views |
| Stress | 20 glass views (the example app's Stress screen) |
| Moving glass | 6 glass cards scrolling over a still image |
| Animated look | `material` toggled every 500 ms (`transitionDuration` 300) |
| Maximum blur | 1 glass view at `blur={100}` |
| Full effect | `refraction` 1, `distortion` 0.3, `chromaticAberration` 0.3, `quality="high"` |

For each: average FPS, frame time (p50 and p95), dropped frames, CPU and memory, GPU time where measurable, with the device model, OS version and library version.

| Device | OS | Library | Results |
|---|---|---|---|
| — | — | — | Pending |

Measured something? Please [share it in an issue](https://github.com/SachinMeenaSipl/react-native-glass-effect/issues) with your device and the scenario.
