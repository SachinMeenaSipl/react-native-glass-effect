# Diagnostics

Performance counters for development. They show how much work glass is doing, so you can find what makes it expensive.

<Preview id="diagnostics" />

## Example

<<< @/../examples/shared/scenes/DiagnosticsScene.tsx

The example reads the counters every second and resets them, so each value is "per second". Scroll the background and watch them change.

## API

| Function | What it does |
|---|---|
| `getGlassStats()` | Counters since the last reset |
| `resetGlassStats()` | Set them back to zero |

Both are safe to call anywhere. They return zeros when native code isn't available (web, Expo Go, tests), and never throw.

## Counters

| Counter | Meaning | Healthy while nothing moves |
|---|---|---|
| `glassDraws` | Times any glass view drew itself | 0 |
| `gpuBlurPasses` | GPU blur passes (Android 12+) | 0 |
| `shaderPasses` | Blur passes that also ran the refraction shader (Android 13+) | 0 |
| `compatCaptures` | Snapshot captures (Android 7–11, `quality="static"`) | 0 |
| `compatCaptureMs` | Total ms spent in those captures | 0 |
| `skippedFarChanges` | Content changes that didn't redraw any glass because they were far from it | any (higher is good) |
| `solidDraws` | Draws that used the opaque fallback | 0 |
| `liveGlassViews` | Glass views on screen now | — |

On iOS only `liveGlassViews` is filled: UIKit draws the glass, so its cost isn't visible to the library.

## Reading the numbers

| You see | It means | Try |
|---|---|---|
| `gpuBlurPasses` keeps climbing while nothing moves | Something under a glass keeps changing (a spinner, a video, an animation) | Move the animation away from the glass, or use `quality="static"` over still content |
| `compatCaptureMs / compatCaptures` above 8 ms | Android 7–11 captures are slow enough to drop frames | `quality="low"`, smaller glass, fewer glass views |
| `solidDraws` above 0 | A glass has no backdrop, or Reduce Transparency is on | Check the backdrop rule in [Core concepts](/guide/core-concepts) |
