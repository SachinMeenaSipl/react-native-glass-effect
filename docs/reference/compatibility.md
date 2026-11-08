---
description: "React Native Liquid Glass compatibility: minimum React Native, Android, iOS, Expo and web versions, and exactly which setups have been tested."
---

# Compatibility

The single source of truth for versions and test status. Every value here comes from the package configuration or a recorded test run.

**Implemented** means the code exists. **Tested** means someone ran it on that setup and checked the result. Untested setups may well work, but they haven't been verified.

## Requirements

| | Minimum | Where it's defined |
|---|---|---|
| React Native | 0.76 | `peerDependencies` in `package.json` |
| React | 18.2 | `peerDependencies` |
| React Native architecture | New Architecture (Fabric + TurboModules) | Codegen specs in `src/specs` |
| Android | minSdk 24 (Android 7) | `android/gradle.properties` default; your app's value is used if set |
| Android compile / target SDK | 35 by default | `android/gradle.properties`; your app's values are used if set |
| iOS | 15.1 | `react-native-liquid-glass.podspec` |
| Apple Liquid Glass (`UIGlassEffect`) | iOS 26, built with Xcode 26 | `__IPHONE_26_0` compile guards in `ios/` |
| Web | `react-native-web` 0.19+ | optional `peerDependencies` |

## Platforms and frameworks

| Setup | Implemented | Tested | Notes |
|---|---|---|---|
| Android 13+ (`shader`) | ✅ | ✅ Android 16 emulator (API 36), Expo SDK 58, React Native 0.88 | Every example on this site renders natively; taps work |
| Android 12 (`blur`) | ✅ | ❔ not tested for 0.3.0 | |
| Android 7–11 (`compat`) | ✅ | ❔ not tested for 0.3.0 | |
| iOS 26+ (`system-glass`) | ✅ | ❔ not tested for 0.3.0 | The 0.2.0 demo recording shows iOS with `iosRenderer="shader"` |
| iOS 15–25 (`system-material`) | ✅ | ❔ not tested for 0.3.0 | |
| iOS shader renderer (`iosRenderer="shader"`) | ✅ | ◐ shown in the 0.2.0 recording | Not re-tested for 0.3.0 |
| Expo dev build (Android) | ✅ | ✅ Expo SDK 58: local `expo run` builds and a cloud release build | |
| Expo dev build (iOS) | ✅ | ❔ | Needs a Mac |
| EAS Build | ✅ (standard autolinking) | ❔ | |
| Expo Go | ✅ plain fallback | ❔ | Expo Go can't load this library's native code. See [Expo](/installation/expo#expo-go) |
| Expo web | ✅ CSS renderer | ✅ Expo SDK 58: dev server and production export | |
| React + Vite | ✅ CSS renderer | ✅ Vite 8, React 19, react-native-web 0.21 | |
| Next.js App Router | ✅ CSS renderer | ✅ Next.js 16 (Turbopack): build, static prerender, hydration | |
| Other web bundlers (webpack, Rspack, Parcel) | ✅ (`browser` export condition) | ❔ | |
| React Native old architecture (bridge) | ⛔ | — | Not supported |

## Browsers

| Browser | Tested | Notes |
|---|---|---|
| Chromium-based (Chrome, Edge) | ✅ Microsoft Edge (Chromium) | Every example and docs page checked |
| Safari | ❔ | Supports `backdrop-filter` |
| Firefox | ❔ | Supports `backdrop-filter` in current versions |
| A browser without `backdrop-filter` | ❔ | Glass keeps its tint and border without blur |

## Checks that run on the code

| Check | What it covers |
|---|---|
| `npm run typecheck` | The library, the React Native example and every documented example (`examples/shared`) |
| `npm test` | Material resolution, theme merging, utilities, the JS ↔ native prop contract, the web bridge |
| `npm run check:android` | Compiles the Kotlin code and runs JVM tests without an Android SDK |
| `npm run check:ios` | Type-checks the Objective-C++ code against the iOS SDK headers (needs clang) |

## Help us fill the gaps

If you run the library on an untested setup, please [open an issue](https://github.com/SachinMeenaSipl/react-native-glass-effect/issues) with your versions and the `useGlassCapabilities()` output, working or not.
