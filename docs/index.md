---
layout: home

hero:
  name: Liquid Glass Native
  text: Real glass for React Native, Expo and the web
  tagline: Live background blur, edge refraction, rim lighting and touch response. One API on Android, iOS and the browser.
  image:
    src: /previews/android/interaction.jpg
    alt: Glass tiles on Android, bending the artwork behind them
  actions:
    - theme: brand
      text: Get started
      link: /installation/
    - theme: alt
      text: Live web demo
      link: https://sachinmeenasipl.github.io/react-native-glass-effect/demo/
      target: _blank
    - theme: alt
      text: View on GitHub
      link: https://github.com/SachinMeenaSipl/react-native-glass-effect

features:
  - title: Android, first-class
    details: GPU blur and an AGSL refraction shader on Android 13+, GPU blur on Android 12, and an automatic snapshot fallback on Android 7–11.
  - title: iOS, native by default
    details: Apple's own UIGlassEffect on iOS 26+ and system materials on iOS 15–25. Switch to the library's Metal renderer to match Android.
  - title: Expo
    details: Works in Expo dev builds and EAS builds with no config plugin. Expo Go shows a safe fallback instead of crashing.
  - title: Web
    details: React, Vite, Next.js (with server-side rendering) and Expo web get glass through CSS backdrop-filter.
  - title: One API
    details: Write <LiquidGlassView> once. The library picks the best renderer for each device and falls back safely.
  - title: Built for real apps
    details: Quality tiers for low-end phones, accessibility settings, theming, diagnostics, and a live tuning panel.
---

## Install

::: code-group

```sh [React Native]
npm install react-native-liquid-glass-native
cd ios && pod install
```

```sh [Expo]
npx expo install react-native-liquid-glass-native
npx expo run:android   # or: npx expo run:ios
```

```sh [Web]
npm install react-native-liquid-glass-native react-native-web react-dom
```

:::

Then rebuild the app. React Native needs the New Architecture (the default since 0.76). On the web, alias `react-native` to `react-native-web` in your bundler: see [Expo and web](/installation/web).

## Quick start

Put what the glass should blur inside a `<GlassBackdrop>`, and render the glass **next to it, on top**:

```tsx
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { GlassBackdrop, LiquidGlassView } from 'react-native-liquid-glass-native';

export default function Screen() {
  return (
    <View style={{ flex: 1 }}>
      <GlassBackdrop style={StyleSheet.absoluteFill}>
        <ScrollView>{/* photos, lists, gradients… */}</ScrollView>
      </GlassBackdrop>

      <LiquidGlassView
        material="regular"
        style={{ position: 'absolute', top: 60, left: 16, right: 16, padding: 16 }}
      >
        <Text>Hello, glass</Text>
      </LiquidGlassView>
    </View>
  );
}
```

Next: [Core concepts](/guide/core-concepts) explains why the backdrop rule matters.

## Components

| Component | Use it for |
|---|---|
| `LiquidGlass` | Apple-style Liquid Glass on Android and iOS |
| `FrostedGlass` | The library's own glass, drawn the same way on Android and iOS |
| `LiquidGlassView` | Any glass surface. Everything else is built from it |
| `GlassBackdrop` | Wraps the content that glass should see through |
| `LiquidGlassButton` | Pill button with press feedback |
| `LiquidGlassCard` | Padded glass container |
| `GlassAdjuster` | Ready-made panel to tune glass live |
| `GlassThemeProvider` | App-wide defaults: material, quality, radius, overrides |

Every prop is in [Components & props](/components/liquid-glass-view).

## What you get on each platform

| Platform | Renderer | Blur | Refraction |
|---|---|---|---|
| Android 13+ | `shader` | ✅ live, GPU | ✅ |
| Android 12 | `blur` | ✅ live, GPU | — |
| Android 7–11 | `compat` | ✅ snapshot | — |
| iOS 26+ | `system-glass` | ✅ system | ✅ system |
| iOS 15–25 | `system-material` | ✅ system | — |
| Web (React, Vite, Next.js, Expo web) | `fallback` | ✅ CSS `backdrop-filter` | — |
| Expo Go | `fallback` | plain tinted view | — |

Expo dev builds use the Android and iOS renderers. Details: [Platform support](/reference/platform-support).
