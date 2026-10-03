# 02 · JS layer

## Files and their single job

| File | Job |
|---|---|
| `specs/*.ts` | Codegen contract. Flat props only. |
| `native/nativeBridge.ts` | Only importer of specs. Exposes `NativeGlassView`, `NativeBackdrop`, `nativeModule`, `isNativeAvailable`. |
| `native/nativeBridge.web.ts` | Web: everything null, so fallbacks are used. |
| `materials/presets.ts` | The four built-in materials. |
| `materials/resolveMaterial.ts` | preset → theme override → prop → intensity → clamp. Pure. |
| `theme/*` | Provider (nestable), `mergeTheme`, `useGlassTheme` (adds the resolved colour scheme). |
| `quality/normalizeQuality.ts` | Validates the string. "auto" is decided natively. |
| `components/LiquidGlassView/useResolvedGlass.ts` | Joins theme + material + props + accessibility into final values. |
| `components/LiquidGlassView/FallbackGlass.tsx` | Pure JS glass (web: CSS `backdrop-filter`; native-missing: tinted view). |
| `utils/splitGlassProps.ts` | Separates "how glass looks" props from everything else (used by Button/Card). |

## How "is native linked?" is decided

`TurboModuleRegistry.get('LiquidGlassModule')` returns `null` when native code isn't compiled in (Expo Go, Jest, or an app that wasn't rebuilt). That single check switches every component to its JS fallback and logs one dev warning. Rendering a native component that isn't registered would crash, so this check happens first.

## Precedence (last wins)

| Step | Source | Example |
|---|---|---|
| 1 | Built-in preset | `regular.blur = 20` |
| 2 | Theme override | `<GlassThemeProvider theme={{ materials: { regular: { blur: 24 } } }}>` |
| 3 | Component prop | `<LiquidGlassView blur={12}>` |
| 4 | `intensity` multiplier | `intensity={0.5}` → blur, refraction, distortion, illumination, RGB split × 0.5 |
| 5 | Clamp | blur 0–100 dp, strengths 0–1, border 0–8 dp, edge 0–64 dp |

`tintOpacity` is **not** scaled by intensity. Intensity controls the effect, not the colour.

## Corner radius

`cornerRadius` prop → `style.borderRadius` (numbers only) → theme default (24). Native clamps it to half the shortest side, so `cornerRadius={999}` gives a pill.

## Composed components

`LiquidGlassButton` and `LiquidGlassCard` never re-implement glass. They render `LiquidGlassView` and forward glass props via `splitGlassProps`. This is the "Material separate from Component" rule.

### Button press feedback: who animates?

| Platform | Squish | Highlight |
|---|---|---|
| Android (native linked) | native (canvas scale + spring) | native |
| iOS 26+ | JS `Animated` spring (0.96) + system response when the touch lands on the glass | system |
| iOS 15–25, fallback | JS `Animated` spring (0.96) | sheen boost via `pressed` |
| Reduce motion on | none | yes |
