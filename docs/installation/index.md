# Installation

Pick the guide for your setup. Each one is complete: you can follow it from an empty project to glass on screen.

| Your app | Guide | Time |
|---|---|---|
| React Native CLI (bare) for Android and iOS | [React Native (CLI)](/installation/react-native) | ~10 min (includes a native rebuild) |
| Expo (dev build or EAS build) | [Expo](/installation/expo) | ~10 min (includes a native build) |
| Expo web | [Expo → Web](/installation/expo#expo-web) | ~3 min |
| React web app with Vite | [Web: React (Vite)](/installation/web) | ~5 min |
| Next.js (App Router, server rendering) | [Web: Next.js](/installation/nextjs) | ~5 min |

After installing, follow [Verify the install](/installation/verify) to confirm the native code is linked.

## Requirements at a glance

| | Minimum | Notes |
|---|---|---|
| React Native | 0.76 | The **New Architecture** is required. It's the default since 0.76 |
| React | 18.2 | |
| Android | minSdk 24 (Android 7) | Refraction needs Android 13+, GPU blur needs Android 12+ |
| iOS | 15.1 | Apple's Liquid Glass needs iOS 26, built with Xcode 26 |
| Expo | Dev build or EAS build | Expo Go can't load this library's native code |
| Web | `react-native-web` 0.19+ | Glass uses CSS `backdrop-filter` |

## The package

```sh
npm install react-native-liquid-glass-native
```

```sh
yarn add react-native-liquid-glass-native
```

```sh
pnpm add react-native-liquid-glass-native
```

The package contains native code for Android and iOS, plus a web build. Bundlers pick the right one automatically:

| Bundler | What it loads |
|---|---|
| Metro (React Native, Expo) | The native build, with Fabric components and a TurboModule |
| Metro for Expo web, Vite, webpack, Next.js | A web build (`lib/web`) with no native code |

## Not supported

- **The old architecture** (the bridge). Apps that turned off the New Architecture can't use this library.
- **Expo Go.** It shows a plain tinted fallback. Use a dev build. See [Expo](/installation/expo#expo-go).
