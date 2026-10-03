# 07 · Testing

## Automated (`npm test`)

| Suite | Covers |
|---|---|
| `resolveMaterial.test.ts` | presets, dark mode, precedence, intensity, clamping, unknown material, PlatformColor passthrough, angles |
| `utils.test.ts` | clamp, hex→rgba, corner radius precedence, `splitGlassProps` (+ compile-time check that every glass prop is listed) |
| `theme.test.ts` | nested theme merge, quality validation |
| `nativeContract.test.ts` | spec props == Android `@ReactProp` names == props passed by the JS component |

`npm run typecheck` also type-checks the example app.

## Native checks without a device

| Command | Covers |
|---|---|
| `npm run check:android` | Runs RN codegen on the specs; compiles all Kotlin with `-Werror` against the real `android.jar` (API 34) + RN stubs; JVM tests for StackBlur (uniformity, symmetry, energy, edges, tiny images), angle/colour interpolation, config clamping, `looksLike` |
| `npm run check:ios` | clang `-fsyntax-only -Werror` of `ios/*.mm` against iPhoneOS 16.5 SDK headers, RN 0.81 headers + pinned folly/fmt/glog/boost, and iOS codegen output; the iOS 26 branch compiled again against `UIGlassEffect` declared as Apple documents it |
| `npm run preview:shader` | Compiles the AGSL with Skia; prints uniforms (must be 11 names / 15 floats in `GlassShader` order); renders all materials + a pressed pill |

## Manual matrix (before every release)

| Device | Scroll | Materials | Play (touch, knobs, quality) | Stress (4→16) | Caps | Screenshot (view-shot) |
|---|---|---|---|---|---|---|
| Android 14/15 real device (SHADER) | | | | | | |
| Android 13 emulator (SHADER) | | | | | | |
| Android 12 emulator (BLUR) | | | | | | |
| Android 9 emulator (COMPAT) | | | | | | |
| Android 7 emulator (COMPAT) | | | | | | |
| Low-RAM / Android Go device | | | | | | |
| iOS 26 simulator | | | | | | |
| iOS 17 simulator | | | | | | |

Also check on Android: battery saver on/off while on the Stress screen; "Remove animations" on; rotate the device; open and close a Modal containing its own backdrop; navigate away and back (the backdrop must resume recording).

## Performance budget (Android, Pixel 6-class)

| Scenario | Target |
|---|---|
| 1 glass, SHADER, scrolling | 60/120 fps, no dropped frames |
| 6 glass, auto | ≥ 55 fps |
| 12 glass, auto (drops to LOW) | ≥ 50 fps |
| COMPAT (API 28 emulator), 3 glass, MEDIUM | ≥ 45 fps while scrolling |

Measure with `adb shell dumpsys gfxinfo <package> framestats` or Android Studio's profiler.
