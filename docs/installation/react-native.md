---
description: "Step-by-step install of Liquid Glass in a bare React Native app for Android and iOS, with the New Architecture, pod install and a first glass view."
---

# Install: React Native (CLI)

For bare React Native apps created with the React Native CLI (`npx @react-native-community/cli init`), running on Android and iOS.

## Before you start

| Check | How |
|---|---|
| React Native 0.76 or newer | `npx react-native --version` |
| New Architecture on | Android: `newArchEnabled=true` in `android/gradle.properties`. iOS: on by default since 0.76 |
| Android minSdk 24 or higher | `minSdkVersion` in `android/build.gradle` |
| iOS deployment target 15.1 or higher | `platform :ios` in `ios/Podfile` |

## Step 1: install the package

```sh
npm install react-native-liquid-glass-native
```

## Step 2: iOS pods

```sh
cd ios && pod install && cd ..
```

Autolinking adds the native module. There's nothing to edit in `AppDelegate`.

## Step 3: Android

Nothing to do. Autolinking adds the module during the Gradle build.

## Step 4: rebuild the app

This library has native code, so a Metro reload isn't enough. Build again:

```sh
npx react-native run-android
npx react-native run-ios
```

## Step 5: first glass

Replace your `App.tsx` with:

```tsx
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView>
          {['#ff6b6b', '#feca57', '#48dbfb', '#5f27cd', '#1dd1a1'].map((color) => (
            <View key={color} style={{ height: 160, margin: 16, borderRadius: 24, backgroundColor: color }} />
          ))}
        </ScrollView>
      </GlassBackdrop>

      <LiquidGlassView style={styles.header}>
        <Text style={styles.title}>Hello, glass</Text>
      </LiquidGlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { position: 'absolute', top: 60, left: 16, right: 16, padding: 16 },
  title: { fontSize: 20, fontWeight: '700' },
});
```

Scroll: the header blurs the colours live. Then [verify the install](/installation/verify).

## What each Android version gets

| Android | Renderer | Effect |
|---|---|---|
| 13+ (API 33) | `shader` | GPU blur, refraction, rim light, optional RGB split |
| 12 (API 31–32) | `blur` | GPU blur, rim light |
| 7–11 (API 24–30) | `compat` | Snapshot blur (CPU), rim light |

## What each iOS version gets

| iOS | Renderer | Effect |
|---|---|---|
| 26+ | `system-glass` | Apple's `UIGlassEffect` |
| 15–25 | `system-material` | System blur materials |
| any, with `iosRenderer="shader"` | the library's Metal renderer | Matches Android. Needs a `<GlassBackdrop>` |

Apple's Liquid Glass on iOS 26 needs the app to be **built with Xcode 26**. Built with an older Xcode, iOS 26 devices get system materials instead.

## Known limitations

- **The old architecture isn't supported.** The New Architecture must be on.
- **Android 12** has no refraction. **Android 7–11** blurs a snapshot, and can't capture video or maps in a `TextureView`, or images decoded as HARDWARE bitmaps.
- **Content in a `SurfaceView`** (some video and map views) can't be captured on any Android version.
- **iOS 26 system glass** ignores `blur`, `intensity`, `illumination` and `lightAngle`: Apple decides them. Use `iosRenderer="shader"` for full control.
- **Apple's Liquid Glass** needs the app to be built with Xcode 26.

Full list: [Platform support](/reference/platform-support) and [Compatibility](/reference/compatibility).

## Troubleshooting

| Symptom | Fix |
|---|---|
| Warning "Native code not found" | The app wasn't rebuilt. Run `pod install` and rebuild both platforms |
| Glass is a flat solid colour on Android | The glass has no `GlassBackdrop` behind it, or it's inside one. See [Core concepts](/guide/core-concepts) |
| Build error about the New Architecture | Turn it on: `newArchEnabled=true` in `android/gradle.properties` |

More in [Troubleshooting](/reference/troubleshooting).
