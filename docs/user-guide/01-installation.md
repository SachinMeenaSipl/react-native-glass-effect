# 1 · Installation

## Requirements

| | Minimum |
|---|---|
| React Native | 0.76 (New Architecture, the default) |
| Android | minSdk 24 (Android 7). Best on Android 13+ |
| iOS | 15.1. Real Liquid Glass needs iOS 26 + Xcode 26 |
| Expo | Dev build / prebuild. **Not Expo Go** |

## Install

```sh
npm install @sachin-meena/react-native-liquid-glass
# or
yarn add @sachin-meena/react-native-liquid-glass
```

### iOS

```sh
cd ios && pod install
```

### Android

Nothing to do. Autolinking handles it.

### Expo

```sh
npx expo install @sachin-meena/react-native-liquid-glass
npx expo prebuild
npx expo run:android   # or run:ios
```

No config plugin is needed.

## Rebuild

This library contains native code, so **rebuild the app** after installing (a Metro reload is not enough).

## Check it worked

```tsx
import { useGlassCapabilities } from '@sachin-meena/react-native-liquid-glass';

const caps = useGlassCapabilities();
console.log(caps.isNativeAvailable, caps.bestRenderer);
// true  "shader"   ← Android 13+
```

If `isNativeAvailable` is `false`, the app wasn't rebuilt (or you're in Expo Go).
