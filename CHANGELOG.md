# Changelog

## 0.1.0 — first public version

- `LiquidGlassView`, `GlassBackdrop`, `LiquidGlassButton`, `LiquidGlassCard`
- Materials: thin, regular, thick, clear; `GlassThemeProvider`
- Android: live RenderNode backdrop capture; GPU blur (12+); AGSL refraction, rim light, RGB split (13+); snapshot fallback (7–11)
- Android: touch-follow light, press squish with spring, tilt lighting, animated prop transitions
- Android: `quality="auto"` (device class, RAM, battery saver, number of glass views)
- iOS: `UIGlassEffect` on 26+, system materials on 15–25
- Capabilities TurboModule + `useGlassCapabilities()`
- Safe JS fallbacks for Expo Go, web and tests
- Shader: glossy rim line hugging the edge (tuned with the Skia preview)
- Fix (Android): zero-size / hidden glass no longer triggers a redraw every frame
- Fix (Android): glass flush with the screen edge no longer fades to see-through (sampling clipped to the backdrop, blur clamps)
- Fix (Android 7–11): moving glass stays aligned (snapshot shifted per frame instead of throttled re-capture); press squish exact
- Fix: disabled `LiquidGlassButton` no longer squishes/glows; iOS 26 button always has press feedback
- Perf (Android): battery-saver state cached; RenderEffect chain reused when unchanged
- Perf (Android): proximity filter, so only glass overlapping the changed view redraws (far-away spinners/Lottie are free)
- Diagnostics: `getGlassStats()` / `resetGlassStats()`; live stats overlay on the example Stress screen
- Tooling: `check:ios` (clang type-check against real iOS SDK + RN headers, iOS 26 branch included)
- Tooling: `check:android` (compile Kotlin + JVM tests without an SDK), `preview:shader` (Skia render of the AGSL)
