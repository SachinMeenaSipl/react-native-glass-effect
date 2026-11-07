# Troubleshooting

First step on Android: `adb logcat -s LiquidGlass`. Most problems print a one-line explanation there.

## Setup

| Symptom | Cause | Fix |
|---|---|---|
| Warning "Native code not found" | The app wasn't rebuilt, or it's Expo Go | Rebuild (`run-android`, or `pod install` + `run-ios`). In Expo, use a dev build |
| `isNativeAvailable` is `false` on a phone | Same as above | See [Verify the install](/installation/verify) |
| Expo Go shows a plain tinted box, no blur | Expo Go can't load third-party native code | Use a dev build: `npx expo run:android` / `run:ios`, or EAS Build |
| Windows, Android build: `ninja: error: mkdir(...): No such file or directory` | A path longer than 260 characters (project in a deep folder such as OneDrive) | Enable Windows long paths, or set a short CMake `buildStagingDirectory`. See [Expo](/installation/expo#windows-android-build-fails-with-ninja-no-such-file-or-directory) |

## Web

| Symptom | Cause | Fix |
|---|---|---|
| Build fails: `Could not load react-native/Libraries/...` | `react-native` isn't aliased to `react-native-web` | Add the alias. See [Web](/installation/web) or [Next.js](/installation/nextjs) |
| `global is not defined` in the browser (Vite) | A dependency expects Node's `global` | Add `define: { global: 'globalThis' }` to `vite.config.js` |
| `Invalid hook call` | Two copies of React (common with linked packages) | Vite: `resolve.dedupe: ['react', 'react-dom', 'react-native-web']` |
| The page is blank, or content collapses to the top | The root element has no height | Vite: a full-height flex root. Next.js: `height: '100vh'` on `<body>` |
| No blur, only tint | The browser doesn't support `backdrop-filter` | Expected; the glass keeps its tint and border |

## Looks

| Symptom | Cause | Fix |
|---|---|---|
| Glass is a flat, solid colour (Android) | No `GlassBackdrop`, or the glass is **inside** it | Wrap the background in `<GlassBackdrop>` and render glass next to it. See [Core concepts](/guide/core-concepts) |
| Solid colour only inside a Modal | A Modal is a separate window | Add a `GlassBackdrop` inside the Modal. See [Glass in a modal](/recipes/modal) |
| Part of the glass looks empty, tint only | The glass extends past its backdrop | Make the backdrop cover the glass (`StyleSheet.absoluteFill`) |
| `backgroundColor` on glass has no effect | It's drawn under the blur | Use `tint` + `tintOpacity` |
| Double border | Style `borderWidth` + glass border | Use the `borderWidth` **prop**, not the style |
| Button label is hard to read | The default label is dark in light mode | Set `textStyle={{ color: '#fff' }}` |
| Looks flat on Android 12 | No refraction below Android 13 (by design) | Expected. Raise `illumination` or `borderOpacity` for more definition |
| Glass looks different on iOS and Android | iOS uses Apple's glass by default | Use `FrostedGlass` or `iosRenderer="shader"`. See [Platform support](/reference/platform-support) |
| iOS: blur looks wrong while fading glass in or out | UIKit can't draw blur correctly at alpha below 1 | Fade the content inside the glass, or scale the glass instead |
| Shader never shows on one device model | The GPU driver rejected the shader; the glass fell back to blur | Nothing to do: it's automatic. Report the device model |

## Content capture (Android)

| Symptom | Cause | Fix |
|---|---|---|
| No blur on Android 11 and older, only a solid colour | Images loaded as HARDWARE bitmaps can't be captured in software | Glide: `.disallowHardwareConfig()`; Coil: `allowHardware(false)` for images behind glass |
| Video or map behind glass shows black or transparent | It renders into a `SurfaceView` | Use texture mode (for example react-native-video `useTextureView`) |
| Glass doesn't follow a rotated parent (Android 7–9) | Rotation and scale alignment need Android 10+ | Avoid rotating glass on old Android |

## Performance

| Symptom | Cause | Fix |
|---|---|---|
| Stutters while an animation plays **under** a glass | Glass over changing content re-blurs every frame | Move the animation, or use a smaller blur. Check `getGlassStats().gpuBlurPasses` |
| Stutters while scrolling on older phones | Too many glass views, or the compat tier | `quality="low"` or `"static"`, fewer or smaller glass views |
| Squish and transitions don't animate | Reduce Motion / Remove animations is on | Expected (accessibility) |

## Still stuck?

[Open an issue](https://github.com/SachinMeenaSipl/react-native-glass-effect/issues) with: your React Native or Expo version, the device and OS version (or browser), the `useGlassCapabilities()` output, and the `LiquidGlass` logcat lines on Android.
