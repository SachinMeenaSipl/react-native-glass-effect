---
description: "Fix common Liquid Glass problems in React Native, Expo and web apps: flat glass on Android, Expo Go fallback, web build errors and performance issues."
---

# Troubleshooting

Find your symptom by area. Each row says what causes it, how to fix it, and how to check the fix.

First step on Android: `adb logcat -s LiquidGlass`. Most setup problems print a one-line explanation there.

## Installation and builds

| Symptom | Cause | Fix | How to check |
|---|---|---|---|
| Warning "Native code not found, rendering a plain fallback" | The app wasn't rebuilt after installing, or it's running in Expo Go | Rebuild: `npx react-native run-android` / `run-ios` (after `pod install`), or `npx expo run:android` / `run:ios` | `useGlassCapabilities().isNativeAvailable` is `true` |
| `isNativeAvailable` is `false` on a phone | Same as above, or the New Architecture is off | Rebuild; turn on the New Architecture (`newArchEnabled=true` in `android/gradle.properties`) | See [Verify the install](/installation/verify) |
| `pod install` fails: the deployment target is too low | The library needs iOS 15.1 | Set `platform :ios, '15.1'` (or higher) in `ios/Podfile`, then `pod install` | `pod install` completes |
| Metro: "Unable to resolve module react-native-liquid-glass-native" | The package isn't installed in this app, or Metro's cache is stale | `npm install react-native-liquid-glass-native`, then `npx react-native start --reset-cache` (or `npx expo start --clear`) | The bundle builds |
| "Invalid hook call" when the library is linked from a local folder | A second copy of React is loaded from the library's own `node_modules` | Resolve `react`, `react-native` and the library from your app. See [Expo → local folder](/installation/expo#using-the-library-from-a-monorepo-or-a-local-folder) | The warning is gone |
| Windows, Android build: `ninja: error: mkdir(...): No such file or directory` | A file path longer than 260 characters (a project in a deep folder such as OneDrive) | Enable Windows long paths, or set a short CMake `buildStagingDirectory`. See [Expo → Windows](/installation/expo#windows-android-build-fails-with-ninja-no-such-file-or-directory) | The Gradle build passes |

## Android

| Symptom | Cause | Fix | How to check |
|---|---|---|---|
| Glass is a flat, solid colour | No `GlassBackdrop` behind it, or the glass is **inside** one | Wrap the background in `<GlassBackdrop>` and render glass next to it. See [Core concepts](/guide/core-concepts) | logcat no longer prints the backdrop warning; `getGlassStats().solidDraws` is 0 |
| Solid colour only inside a Modal | A Modal is a separate window | Add a `GlassBackdrop` inside the Modal. See [Glass in a modal](/recipes/modal) | The glass in the modal blurs |
| Part of the glass looks empty, tint only | The glass extends past its backdrop | Make the backdrop cover the glass (`StyleSheet.absoluteFill`) | The whole glass blurs |
| No blur on Android 11 and older, only a solid colour | Images loaded as HARDWARE bitmaps can't be captured in software | Glide: `.disallowHardwareConfig()`; Coil: `allowHardware(false)`, for images behind glass | `getGlassStats().compatCaptures` increases when the image changes |
| Video or map behind glass shows black or transparent | It renders into a `SurfaceView` | Use texture mode (for example `useTextureView` in react-native-video) | The video shows through the glass |
| Looks flat on Android 12 | No refraction below Android 13, by design | Raise `illumination` or `borderOpacity` for more definition | `bestRenderer` is `blur` |
| The shader never shows on one device model | The GPU driver rejected the shader; the glass fell back to blur | Nothing to do: it's automatic. Please report the device model | `getGlassStats().shaderPasses` stays 0 |
| Glass doesn't follow a rotated parent (Android 7–9) | Rotation and scale alignment need Android 10+ | Avoid rotating glass on old Android | — |
| logcat: "Could not find generated setter for class …LiquidGlassViewManager" | Known log message on React Native 0.88 | None needed: the glass renders and props apply. See [Known issues](/reference/changelog#known-issues) | — |
| A full-screen `<Image>` in the backdrop looks zoomed or doesn't fill the screen | An image positioned only with `absoluteFill` can draw at its natural size on Android | Give it an explicit size: `width: '100%', height: '100%'` | The image fills the backdrop |

## iOS

| Symptom | Cause | Fix | How to check |
|---|---|---|---|
| No Liquid Glass on iOS 26, only a blur material | The app was built with Xcode older than 26 | Build with Xcode 26 | `bestRenderer` is `system-glass` |
| Glass looks different from Android | iOS uses Apple's glass by default | Use `FrostedGlass` or `iosRenderer="shader"`. See [iOS renderers](/features/ios-renderers) | Both platforms look alike |
| `iosRenderer="shader"` looks like plain system glass | No `GlassBackdrop` behind the glass | Add a backdrop. Xcode's console prints a "found no GlassBackdrop" message | The shader glass appears |
| Blur looks wrong while fading glass in or out | UIKit can't draw blur correctly at `opacity` below 1 | Fade the content inside the glass, or scale the glass instead | — |
| `blur`, `intensity` or `lightAngle` have no effect on iOS 26 | Apple draws the system glass and decides these | Expected. Use `iosRenderer="shader"` for full control | — |

## Expo

| Symptom | Cause | Fix | How to check |
|---|---|---|---|
| A plain tinted box, no blur, in Expo Go | Expo Go can't load third-party native code | Use a dev build: `npx expo run:android` / `run:ios`, or EAS Build | `isNativeAvailable` is `true` in the dev build |
| Changes in `android/` disappear | `npx expo prebuild --clean` regenerates the native folders | Make native changes with a config plugin, or re-apply them after prebuild | — |

## Web

| Symptom | Cause | Fix | How to check |
|---|---|---|---|
| Build fails: `Could not load react-native/Libraries/...` | `react-native` isn't aliased to `react-native-web` | Add the alias. See [Web](/installation/web) or [Next.js](/installation/nextjs) | The build passes |
| `global is not defined` in the browser (Vite) | A dependency expects Node's `global` | Add `define: { global: 'globalThis' }` to `vite.config.js` | No console error |
| The page is blank, or content collapses to the top | The root element has no height | Vite: a full-height flex root. Next.js: `height: '100vh'` on `<body>` | Screens fill the window |
| Next.js: "You're importing a component that needs useState" | A glass component is used from a server component file | Add `'use client'` to the file that uses glass | The build passes |
| No blur, only tint | The browser doesn't support `backdrop-filter`, or an ancestor (with `opacity` below 1, `filter`, `mask` or `will-change`) limits what the glass can blur | Expected in old browsers. Otherwise move those styles off the glass's ancestors | The blur appears |
| Refraction or touch light don't show | They have no CSS equivalent | Expected on the web | — |

## Performance

| Symptom | Cause | Fix | How to check |
|---|---|---|---|
| Stutters while an animation plays **under** a glass | Glass over changing content redraws every frame | Move the animation, use a smaller blur, or `quality="low"` | `getGlassStats().gpuBlurPasses` drops while idle |
| Stutters while scrolling on older phones | Too many glass views, or the compat tier | `quality="low"` or `"static"`, fewer or smaller glass views | `adb shell dumpsys gfxinfo <package> framestats` |
| Squish and transitions don't animate | Reduce Motion / Remove animations is on | Expected (accessibility) | — |

More: [Performance](/features/performance).

## Still stuck?

[Open an issue](https://github.com/SachinMeenaSipl/react-native-glass-effect/issues) with: your React Native or Expo version, the device and OS version (or browser), the `useGlassCapabilities()` output, and the `LiquidGlass` logcat lines on Android.
