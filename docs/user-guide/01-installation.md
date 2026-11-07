# 1 · Installation

## Requirements

| | Minimum |
|---|---|
| React Native | 0.76 (New Architecture, the default) |
| Android | minSdk 24 (Android 7). Best on Android 13+ |
| iOS | 15.1. Real Liquid Glass needs iOS 26 + Xcode 26 |
| Expo | Dev build or EAS build. Expo Go shows a plain fallback |
| Web | `react-native-web` 0.19+ (React, Vite, Next.js, Expo web) |

## Install

```sh
npm install react-native-liquid-glass-native
# or
yarn add react-native-liquid-glass-native
```

### iOS

```sh
cd ios && pod install
```

### Android

Nothing to do. Autolinking handles it.

### Expo

```sh
npx expo install react-native-liquid-glass-native
npx expo run:android   # or run:ios
```

`expo run` runs `prebuild` for you. No config plugin is needed. Expo Go can't load third-party native code, so use a dev build to see real glass.

### Web

```sh
npm install react-native-liquid-glass-native react-native-web react-dom
```

Alias `react-native` to `react-native-web` in your bundler. Full setup for Vite, Next.js and Expo web: [Expo and web](11-expo-and-web.md).

## Rebuild

This library contains native code, so **rebuild the app** after installing (a Metro reload is not enough).

## Check it worked

```tsx
import { useGlassCapabilities } from 'react-native-liquid-glass-native';

const caps = useGlassCapabilities();
console.log(caps.isNativeAvailable, caps.bestRenderer);
// true  "shader"   ← Android 13+
```

If `isNativeAvailable` is `false`, the app wasn't rebuilt, you're in Expo Go, or you're on the web (where `bestRenderer` is `"fallback"` and the blur comes from CSS).
