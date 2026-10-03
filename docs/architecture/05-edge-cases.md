# 05 · Edge cases

Every known edge case, what the user sees, and where in the code it's handled.
**Status**: ✅ handled · ⚠️ handled with a documented limitation · ⛔ not supported (documented).

## A. Setup and installation

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| A1 | Library installed but app not rebuilt | JS fallback (tinted view), one dev warning | `nativeBridge.isNativeAvailable`, `LiquidGlassView.tsx` | ✅ |
| A2 | Expo Go | Same as A1. Works in Expo dev builds | same | ✅ |
| A3 | Jest tests in the host app | Module is null → fallback renders, no crash | same | ✅ |
| A4 | React Native Web | `nativeBridge.web.ts` → CSS `backdrop-filter` glass | `FallbackGlass.tsx` | ✅ |
| A5 | Old Architecture (bridge) app | Not supported | ADR-008 | ⛔ |
| A6 | Android minSdk < 24 host app | Gradle refuses (RN itself needs 24) | `android/gradle.properties` | ✅ |
| A7 | iOS built with Xcode < 26 | Compiles; uses materials instead of `UIGlassEffect` | `LG_HAS_GLASS_SDK` guard | ✅ |

## B. Props and values

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| B1 | Unknown `material` | Falls back to theme default, warns once | `resolveMaterial` | ✅ |
| B2 | Unknown `quality` | `auto`, warns once | `normalizeQuality` | ✅ |
| B3 | NaN / Infinity / negative numbers | Replaced by the material default or clamped | `clamp`, `GlassConfig.sanitized` | ✅ |
| B4 | `blur` > 100 | Clamped to 100 dp | `MAX_BLUR_DP` | ✅ |
| B5 | `cornerRadius` bigger than the view | Clamped to half the shortest side (pill/circle) | `GlassShape.update`, outline | ✅ |
| B6 | `style.borderRadius` as a percentage | Ignored; theme default used | `resolveCornerRadius` | ✅ |
| B7 | `cornerRadius` + `style.borderRadius` both set | Prop wins | `resolveCornerRadius` | ✅ |
| B8 | `tint` is a `PlatformColor` / `DynamicColorIOS` | Passed through untouched to native | `resolveMaterial` | ✅ |
| B9 | `tint` with its own alpha | Final alpha = colour alpha × `tintOpacity` | `SurfacePainter` | ✅ |
| B10 | `lightAngle` outside ±180 | Wrapped; animations take the shortest way | `normalizeAngle`, `GlassConfig.lerpAngle` | ✅ |
| B11 | `intensity` = 0 | No blur/refraction/light; tint and border remain | `resolveMaterial` | ✅ |
| B12 | Props change rapidly (every frame) | Transition restarts from mid-state; no jumps | `GlassConfigTransition` | ✅ |
| B13 | `backgroundColor` in glass style | Drawn **under** the glass (hidden by the blur). Use `tint` instead | docs | ⚠️ |
| B14 | Style `borderWidth` on glass | RN draws its own border as well as the glass border | docs; use `borderWidth` prop | ⚠️ |

## C. Layout and hierarchy (Android)

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| C1 | No `GlassBackdrop` on screen | Frosted solid (92% `fallbackColor`), logcat warning once | `BackdropRegistry.resolve`, `SolidGlassRenderer` | ✅ |
| C2 | Glass **inside** its backdrop | Never binds to it (would loop); uses another backdrop or solid + warning | `resolve` filter, invariant 6 | ✅ |
| C3 | Several backdrops | Largest on-screen overlap wins; `backdropId` to force one | `bestOverlap` | ✅ |
| C4 | `backdropId` doesn't exist | Solid + warning | `resolve` | ✅ |
| C5 | Glass in a `Modal` | Modal is its own window → needs its own backdrop inside the Modal | same-window filter; docs | ✅ |
| C6 | Glass extends past its backdrop | The part of the glass outside the backdrop has nothing to show (tint only) | docs: use `absoluteFill` backdrops | ⚠️ |
| C6b | Glass flush with the screen / backdrop edge (tab bar, header) | Sampling clipped to the backdrop; blur clamps at the edge; no see-through fade | `computeSampleRect`, `uOrigin` | ✅ |
| C7 | Backdrop has size 0 | Solid; no redraw loop | `RenderNodeGlassRenderer` guard | ✅ |
| C8 | Glass size 0 or hidden (`display: none`, collapsed, animating from 0) | Nothing drawn, and no per-frame redraw loop | `onPreDraw` guard (`width/height/isShown`) | ✅ |
| C9 | Glass nested inside another glass | Inner glass samples the backdrop, not the outer glass | by design | ✅ |
| C10 | Backdrop unmounts while glass is visible | Glass re-binds (another backdrop or solid) | `removeBackdrop` → `requestRebind` | ✅ |
| C11 | Navigate away and back (backdrop re-attaches) | Recording re-enabled on rebind | `ensureBinding` always refreshes flags | ✅ |
| C12 | View recycling (Fabric) | Config, animations and renderer reset | `prepareToRecycleView` → `resetForRecycle` | ✅ |
| C13 | `removeClippedSubviews` detaches glass | Detach releases the renderer; re-attach rebinds | lifecycle | ✅ |
| C14 | Backdrop has `opacity` < 1 | Glass copy uses the backdrop's own alpha | `glassNode.setAlpha` | ✅ |
| C15 | A backdrop **ancestor** fades | Not reflected in the glass sample | — | ⚠️ |
| C16 | Screen rotation / resize | New size → new shape, outline, capture | `onSizeChanged`, `geometryChanged` | ✅ |
| C17 | RTL layouts | Geometry is matrix-based, direction-agnostic | — | ✅ |

## D. Motion and content changes (Android)

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| D1 | List scrolls inside the backdrop | Same-frame update | `onDescendantInvalidated` → notify | ✅ |
| D2 | Glass moves (Animated native driver / Reanimated) | Matrix change detected in pre-draw | `onPreDraw` | ✅ |
| D3 | Backdrop moves (parallax) | Same | same | ✅ |
| D4 | Glass rotated / scaled (API 29+) | Exact alignment | `transformMatrixToGlobal` | ✅ |
| D5 | Glass rotated / scaled (API 24–28) | Translation exact; rotation/scale ignored | `ViewGeometry` | ⚠️ |
| D6 | Glass or backdrop scaled to 0 | Matrix not invertible → skip glass for that frame | `backdropToGlass` returns false | ✅ |
| D7 | Video / camera / map in a **TextureView** | Captured live on 12+; not on 7–11 | RenderNode vs snapshot | ⚠️ |
| D8 | Video / map in a **SurfaceView** | Not capturable (separate surface): shows transparent | docs: use TextureView mode | ⛔ |
| D9 | Throttled compat capture while scrolling | Trailing redraw guarantees the final frame | `redrawAfterMs` | ✅ |
| D11 | Glass cards scrolling over a still background on Android 7–11 | Snapshot shifted per frame; re-captured only past the padding: stays aligned | `BackdropSnapshot.needsRecapture` | ✅ |
| D13 | Animation inside the backdrop far from any glass (spinner, Lottie) | Only glass overlapping the changed view redraws; others skip (counted in `skippedFarChanges`) | `BackdropRegistry.notifyContentChanged` proximity filter | ✅ |
| D14 | A view moves away from under a glass | Its previous rect is remembered, so the glass refreshes (no ghost) | `lastTargetRects` | ✅ |
| D12 | Many glass views mounting at once (lists) | Battery-saver state cached (2 s, refreshed by broadcast) instead of an IPC per view | `DeviceCapabilities` | ✅ |
| D10 | Animated GIF / Lottie inside backdrop | Treated like any invalidation (live) | D1 | ✅ |

## E. Device and OS (Android)

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| E1 | API 33+ | SHADER tier | `RendererTier` | ✅ |
| E2 | API 31–32 | BLUR tier | same | ✅ |
| E3 | API 24–30 | COMPAT tier | same | ✅ |
| E4 | AGSL fails to compile (driver bug) | Whole app → BLUR, one warning | `GlassShader.createOrNull` | ✅ |
| E5 | Hardware acceleration disabled for the window | COMPAT_LIVE | `RendererFactory` | ✅ |
| E6 | Software canvas (view-shot, `View.draw(bitmapCanvas)`) | One-off compat draw | `RenderNodeGlassRenderer` | ✅ |
| E7 | HARDWARE bitmaps (Glide/Coil) on 7–11 | Capture throws → solid, retry every 3 s, one warning | `BackdropSnapshot` | ⚠️ |
| E8 | Out of memory creating a snapshot | Solid, one warning | `BackdropSnapshot` | ✅ |
| E9 | Low-RAM / Android Go | `auto` → LOW | `QualityResolver` | ✅ |
| E10 | Battery saver toggled while running | Quality re-resolved live | `SystemSettingsMonitor` | ✅ |
| E11 | Many glass views (> 6, > 12) | `auto` steps down | `QualityResolver` | ✅ |
| E12 | Emulator without GPU | Usually software GL: SHADER may be slow; use `quality="low"` in debug | docs | ⚠️ |
| E13 | Android 14+ receiver registration rules | `RECEIVER_NOT_EXPORTED` flag used | `SystemSettingsMonitor` | ✅ |
| E14 | OEM rejects receiver registration | Caught; glass works, battery saver just isn't live | same | ✅ |
| E15 | No rotation sensor | Accelerometer fallback; none → tilt offset stays 0 | `MotionLightSource` | ✅ |
| E16 | App goes to background with `motionLighting` | Sensor unregistered on pause, re-registered on resume | `LiquidGlassModule` lifecycle | ✅ |

## F. Touch and interaction

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| F1 | Pressable / Button inside interactive glass | Touches pass through; glass only observes | `dispatchTouchEvent` | ✅ |
| F2 | Glass inside a ScrollView, user starts scrolling | ScrollView intercepts → CANCEL → light fades, squish springs back | `TouchLightController`, `PressAnimator` | ✅ |
| F3 | `pointerEvents="none"` on glass | No touch light | `pointerEvents` check | ✅ |
| F4 | Multi-touch | Follows the primary pointer | `MotionEvent` x/y | ✅ |
| F5 | User transform (scale) on glass + squish | No conflict (canvas squish) | ADR-005 | ✅ |
| F6 | `interactive` turned off mid-press | Light and press state reset | `commitConfig` | ✅ |
| F7 | Disabled `LiquidGlassButton` | No native touch light / squish | Button passes `interactive={false}` | ✅ |
| F8 | iOS 26 button press | JS spring always runs; system glass reacts when the touch lands on the glass itself | `nativeAnimatesPress` (Android only), effect view touchable when interactive | ✅ |

## G. Accessibility

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| G1 | iOS Reduce Transparency on | Opaque `fallbackColor`, live toggle | `useReduceTransparency`, iOS notification | ✅ |
| G2 | App-level "reduce transparency" (Android has no system setting) | `reduceTransparency` prop | prop | ✅ |
| G3 | Reduce motion / remove animations | No squish, no transitions, no tilt; highlight only | `animationsOn`, `useReduceMotion` | ✅ |
| G4 | Text contrast on glass | Developer's responsibility; recipe provided | user guide 07 | ⚠️ |
| G5 | Screen readers | Glass is a normal View: all `accessibility*` props work; Button has `role="button"` and disabled state | `ReactViewManager` | ✅ |

## H. iOS specifics

| ID | Case | What happens | Where | Status |
|---|---|---|---|---|
| H1 | Android-only props on iOS | Ignored silently | 04-ios.md | ✅ |
| H2 | Glass layers vs React children order | Children always above glass (separate container) | `mountChildComponentView` | ✅ |
| H3 | Touch on empty area of glass | Hits the glass component (container returns nil) | `LGChildContainerView` | ✅ |
| H4 | Dark mode switch | System materials adapt; JS re-resolves tint/fallback per scheme | `useGlassTheme` | ✅ |
| H5 | Animating `opacity` on glass (or a parent) on iOS | UIKit renders blur incorrectly while alpha < 1 (Apple limitation) | docs: animate content, not the glass | ⚠️ |
