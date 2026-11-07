# Changelog

## Unreleased

- New: Expo support documented and verified (Expo SDK 58 dev build; Expo Go uses the plain-view fallback)
- New: web support (React, Vite, Next.js with SSR, Expo web). Web bundles resolve a web build through the `browser` and `node` export conditions, so native component specs are never bundled for the web
- New: `react-native-web` is an optional peer dependency
- Build: `npm run prepare` also writes `lib/web` (`scripts/build-web.js`)
- Docs: new documentation site (VitePress, `website/`) with a separate installation guide per setup, a page per component and feature, recipes, and live web previews plus Android screenshots for every example
- Examples: shared example scenes (`examples/shared/scenes`) used by the docs, the Vite gallery and the Expo app

## 0.2.0

- Fix (Android): glass never sampled its backdrop, so it drew a milky solid surface instead of blur and refraction
- Fix (iOS): a `cornerRadius` above half the shortest side drew a broken shape
- New: `<LiquidGlass>` Apple-style glass on both platforms, with `liquid` and `liquidClear` materials
- New: `<FrostedGlass>` the same shader on Android and iOS
- New: `iosRenderer="shader"` Metal renderer for iOS; `"system"` stays the default
- New: theme `iosRenderer` switches every glass on iOS at once, including buttons and cards
- New: `<GlassAdjuster>` live tuning panel, plus `DEFAULT_GLASS_ADJUSTMENTS` and `stepAdjustment`
- Docs: list which props have no effect on iOS 26 system glass
- Docs: demo videos for Android and iOS
- Example: full-screen Types screen; tab selector no longer overlaps content

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
