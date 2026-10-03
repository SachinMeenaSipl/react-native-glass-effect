# AGENTS.md — guide for AI agents and new contributors

Read this first. It tells you where things are, the rules that must not break, and step-by-step recipes for the common changes.

---

## 1. What this repo is

A React Native **library** (published to npm) that renders "Liquid Glass" surfaces.

- **JS/TS layer** (`src/`): public components, materials, theme, capability detection, fallbacks.
- **Android** (`android/`): the real renderer. It captures the background live, then applies blur, a refraction shader, lighting and touch animation.
- **iOS** (`ios/`): thin wrapper over the system `UIGlassEffect` / `UIVisualEffectView`.
- **Example app** (`example/`): manual test bench for every renderer path.

New Architecture (Fabric + TurboModules) only. RN ≥ 0.76, Android minSdk 24, iOS 15.1.

---

## 2. Repo map

```
src/
├─ index.ts                      PUBLIC API. Anything not exported here is internal.
├─ specs/                        ⚠ CONTRACT with native (codegen input)
│  ├─ LiquidGlassViewNativeComponent.ts
│  ├─ GlassBackdropNativeComponent.ts   (Android only)
│  └─ NativeLiquidGlassModule.ts        (capabilities TurboModule)
├─ native/nativeBridge.ts        ONLY file that imports specs. Decides native vs fallback.
├─ components/
│  ├─ LiquidGlassView/           core component + useResolvedGlass hook + JS FallbackGlass
│  ├─ GlassBackdrop/
│  ├─ LiquidGlassButton/
│  └─ LiquidGlassCard/
├─ materials/                    presets (thin/regular/thick/clear) + resolveMaterial()
├─ theme/                        GlassThemeProvider, mergeTheme, useGlassTheme
├─ quality/                      GlassQuality type + normalizeQuality()
├─ capabilities/                 getGlassCapabilities(), useGlassCapabilities()
├─ accessibility/                useReduceTransparency(), useReduceMotion()
├─ utils/                        clamp, colour, corner radius, splitGlassProps, warnOnce
└─ __tests__/                    Jest tests (pure logic + native contract test)

android/src/main/java/com/liquidglass/
├─ LiquidGlassPackage.kt         registers module + 2 view managers
├─ view/                         LiquidGlassView (conductor) + ViewManager (@ReactProp)
├─ backdrop/                     GlassBackdropView (records RenderNode), BackdropRegistry, ViewGeometry
├─ renderer/                     GlassRenderer interface, RendererFactory, GlassFrame
│  ├─ RenderNodeGlassRenderer    Android 12+ (BLUR) / 13+ (SHADER)
│  ├─ CompatGlassRenderer        Android 7–11, software canvas, quality=static
│  ├─ SolidGlassRenderer         reduce transparency / no backdrop
│  └─ paint/                     GlassShape, SurfacePainter (tint/sheen/border), Saturation
├─ shader/                       AGSL source + GlassShader (uniforms, compile guard)
├─ compat/                       StackBlur, BackdropSnapshot
├─ interaction/                  TouchLightController, PressAnimator, MotionLightSource, LightState
├─ capability/                   RendererTier, QualityLevel, QualityResolver, DeviceCapabilities, SystemSettingsMonitor
├─ config/                       GlassConfig (all values), GlassConfigTransition (animates changes)
├─ module/                       LiquidGlassModule (TurboModule)
└─ util/                         GlassLog, unit helpers

ios/
├─ LiquidGlassViewComponentView.{h,mm}   Fabric view
└─ LiquidGlassModule.{h,mm}              TurboModule

docs/user-guide/      for app developers
docs/architecture/    for contributors (read 01-overview first)
example/              test app (see example/README.md)
tools/android-typecheck/  compile Kotlin + JVM tests without an Android SDK
tools/shader-preview/     compile + render the AGSL shader with Skia
tools/ios-typecheck/      clang type-check of ios/*.mm against real iOS SDK + RN headers
```

---

## 3. Rules that must not break (invariants)

| # | Rule | Why |
|---|---|---|
| 1 | Native props are **flat primitives**. Materials and themes are resolved in JS (`resolveMaterial`). Native never knows the word "regular". | One source of truth. Easy to add materials without native releases. |
| 2 | Native prop names must never equal a style key (`borderWidth`, `borderRadius`, `opacity`…). Use the `glass` prefix. | Fabric flattens `style` into props, so names collide. |
| 3 | The spec (`src/specs`), the Android `@ReactProp` list and the JS component must list **the same props**. `nativeContract.test.ts` enforces this. | A missing prop silently does nothing. |
| 4 | Every length crossing the bridge is **dp**. Convert to px only at draw time (`density`). | Matches RN styles. |
| 5 | Clamp everything **in JS and again in native** (`GlassConfig.sanitized`). | Bad values must never reach the GPU. |
| 6 | A glass view must **never sample a backdrop that contains it**. `BackdropRegistry.resolve` filters these out. | Would create a RenderNode cycle / infinite invalidation. |
| 7 | Nothing on Android may **crash** because of the device: shader compile failure → BLUR tier; capture failure → SOLID; missing backdrop → SOLID + one log line. | A library cannot assume a flagship phone. |
| 8 | Android API guards: `RenderNode`/`RenderEffect` ≥ 31 (`S`), `RuntimeShader` ≥ 33 (`TIRAMISU`), `transformMatrixToGlobal` ≥ 29 (`Q`). Classes referencing them are `@RequiresApi`, or store them as `Any?`. | minSdk is 24. |
| 9 | Press squish is applied to the **canvas**, never `View.scaleX/Y`. | RN styles / Reanimated own the view transform. |
| 10 | Respect accessibility: `reduceTransparency` → opaque; system "remove animations" → no squish, no transitions, no tilt lighting. | Accessibility. |
| 11 | JS never imports from `src/specs` directly; only `native/nativeBridge.ts` does. | Keeps the "is native linked?" decision in one place. |
| 12 | All Android view/registry code runs on the **main thread only**. | Shared temp objects and weak lists are not thread-safe. |

---

## 4. Commands

| Task | Command |
|---|---|
| Install | `npm install` |
| Typecheck | `npm run typecheck` |
| Unit + contract tests | `npm test` |
| Build `lib/` for publishing | `npm run prepare` (react-native-builder-bob) |
| **Compile Android Kotlin + JVM logic tests (no SDK needed)** | `npm run check:android` |
| **Type-check iOS ObjC++ against real iOS SDK + RN headers (no Xcode needed)** | `npm run check:ios` |
| **Compile + render the AGSL shader (no device needed)** | `npm run preview:shader` → `tools/shader-preview/preview.png` |
| Run example | see `example/README.md` |
| Android logs | `adb logcat -s LiquidGlass` |

`check:android` compiles against the real `android.jar` plus stubs of the RN classes (`tools/android-typecheck/stubs`). Run it after **every** Kotlin change. It takes seconds. The full Gradle/Xcode build still happens in the example app.

**Definition of done for any change:** `npm run typecheck && npm test && npm run check:android && npm run check:ios` all pass. Shader changes also need `npm run preview:shader`, and you must look at the image.

---

## 5. Recipes

### 5.1 Adding a new glass prop (e.g. `saturation`)

1. **Spec**: add it to `src/specs/LiquidGlassViewNativeComponent.ts` with `WithDefault<Float, X>`.
2. **Public type**: add it to `GlassAppearanceProps` in `src/materials/types.ts` (with a plain-English JSDoc).
3. **Prop splitting**: add the key to `GLASS_PROP_KEYS` in `src/utils/splitGlassProps.ts` (the type test fails if you forget).
4. **Material** (if it has a per-material default): add it to `GlassMaterial` and all four presets, then resolve it in `resolveMaterial.ts` and add it to `ResolvedGlass`.
5. **Hook**: pass it through in `useResolvedGlass.ts`.
6. **Component**: pass `name={glass.name}` in `LiquidGlassView.tsx`.
7. **Android**: add a field to `GlassConfig` (plus `sanitized()`, and `lerp()` if it animates), then a `@ReactProp` setter in `LiquidGlassViewManager.kt` that only writes `pending`. Use it in the renderer/painter.
8. **iOS**: read `p.name` in `applyProps:`, or document it as Android-only. Run `npm run check:ios`.
9. **Tests**: `npm test` (the contract test catches steps 1, 6 and 7 being out of sync) and `npm run check:android`. Add a `resolveMaterial` test.
10. **Docs**: add a row to `docs/user-guide/04-components.md` and, if relevant, `docs/architecture/05-edge-cases.md`.

### 5.2 Adding a new material

1. Add it to `src/materials/presets.ts` and to `MATERIALS`.
2. Add the name to the `GlassMaterialName` union.
3. Test it in `example/src/screens/MaterialsScreen.tsx`.

No native change is needed (invariant 1).

### 5.3 Adding a new composed component (e.g. `LiquidGlassTabBar`)

1. Create `src/components/LiquidGlassTabBar/{LiquidGlassTabBar.tsx, LiquidGlassTabBar.types.ts, index.ts}`.
2. Build it only from `LiquidGlassView` (plus RN primitives). Use `splitGlassProps` to forward glass props.
3. Export it from `src/components/index.ts` and `src/index.ts`.
4. Add an example screen and a docs section.

### 5.4 Changing the shader

- Source: `android/.../shader/GlassShaderSource.kt`. Keep the step comments (1–7) in sync.
- If you add a uniform, update `GlassShader.effectFor` (the `UNIFORM_COUNT` array and the `setFloatUniform` call).
- AGSL tips: do the maths in `float`, convert with `float4(content.eval(p))`, and return `half4(...)`. Colours are premultiplied.
- Iterate with `npm run preview:shader`: it compiles the AGSL with Skia and renders all materials to `tools/shader-preview/preview.png`. The uniform list it prints must match `GlassShader.effectFor` (order and count).
- Then test on a **real** API 33+ device and on an emulator; drivers differ. If compilation fails on a device, the library logs it and drops to BLUR.

### 5.5 Adding a renderer tier

1. Implement `GlassRenderer` in `renderer/`.
2. Add a `RendererKind`, then route to it in `RendererFactory.choose` and `create` (keep the decision table comment updated).
3. Document it in `docs/architecture/03-android-renderer.md`.

---

## 6. How a frame is drawn on Android (30-second version)

1. `GlassBackdropView.draw()` records its content into a `RenderNode` (a GPU display list, not pixels).
2. `LiquidGlassView.onPreDraw` checks every frame whether the glass or the backdrop moved (matrix compare), or whether the backdrop content changed (version counter), and invalidates if so.
3. `LiquidGlassView.onDraw` fills a `GlassFrame` (config, level, shape, matrix, light) and calls:
   - `renderer.draw()`, which draws the backdrop node, lined up, through blur → saturation → shader;
   - `SurfacePainter.paint()`, which draws tint, sheen (if the shader didn't light it), and the border.
4. Children draw on top, sharp.

Full detail: `docs/architecture/03-android-renderer.md`.

---

## 7. Things not to do

- Don't add a codegen `ViewManagerDelegate` to the Android managers. They extend `ReactViewManager` so that all normal View props work (see ADR-004).
- Don't read pixels back to the CPU on Android 12+.
- Don't allocate per frame in `onDraw` / renderers unless it's unavoidable (cache Shaders/RenderEffects by key).
- Don't add dependencies (Reanimated, Skia…). The library ships with zero runtime deps on purpose. (`tools/` may use dev-only tools like CanvasKit.)
- Don't use a new React Native Android class without adding its real signature to `tools/android-typecheck/stubs`.
- Don't change public names in `src/index.ts` without a major version bump.
