---
description: "React Native Liquid Glass draws real, live glass in React Native, Expo and web apps: background blur, edge refraction, rim lighting and touch response."
---

# Introduction

**react-native-liquid-glass-native** draws "Liquid Glass" surfaces in React Native, Expo and web apps. The glass is real: it blurs, bends and lights whatever is behind it, live, while that content scrolls or animates.

<Preview id="quick-start" />

## What you get

- **Live background blur.** Content behind the glass is blurred every frame it changes: lists, images, maps, video.
- **Edge refraction.** On Android 13+ and with the iOS shader renderer, the rim of the glass bends the content behind it like a thick lens.
- **Lighting.** A specular rim light with a direction you control, an optional light that follows the finger, and an optional light that follows device tilt.
- **Touch response.** Glass can squish and spring back when pressed.
- **Materials.** Six named looks (`thin`, `regular`, `thick`, `clear`, `liquid`, `liquidClear`) with light and dark variants. Override any value, per component or app-wide.
- **Safe everywhere.** Old phones, weak GPUs, battery saver, Expo Go, the web and accessibility settings all fall back to something sensible. The library never crashes because of the device.

## Platforms

| Platform | Renderer | What it looks like |
|---|---|---|
| Android 13+ | `shader` | GPU blur + refraction shader + rim light |
| Android 12 | `blur` | GPU blur + rim light |
| Android 7–11 | `compat` | Snapshot blur + rim light |
| iOS 26+ | `system-glass` | Apple's own `UIGlassEffect` (or the library's Metal shader) |
| iOS 15–25 | `system-material` | System materials (or the library's Metal shader) |
| Web | `fallback` | CSS `backdrop-filter` blur |
| Expo Go | `fallback` | Plain tinted view (no native code in Expo Go) |

Details: [Platform support](/reference/platform-support).

## Components at a glance

| Component | Use it for |
|---|---|
| [`LiquidGlassView`](/components/liquid-glass-view) | Any glass surface. Every other component is built from it |
| [`GlassBackdrop`](/components/glass-backdrop) | Wraps the content that glass should see through |
| [`LiquidGlass`](/components/liquid-glass) | Apple-style Liquid Glass on Android and iOS |
| [`FrostedGlass`](/components/frosted-glass) | The library's own glass, drawn the same way on Android and iOS |
| [`LiquidGlassButton`](/components/liquid-glass-button) | A pill-shaped glass button with press feedback |
| [`LiquidGlassCard`](/components/liquid-glass-card) | A padded glass container |
| [`GlassAdjuster`](/components/glass-adjuster) | A ready-made panel to tune glass live |
| [`GlassThemeProvider`](/components/glass-theme-provider) | App-wide defaults |

## Requirements

| | Minimum |
|---|---|
| React Native | 0.76 with the New Architecture (the default since 0.76) |
| React | 18.2 |
| Android | minSdk 24 (Android 7). Best on Android 13+ |
| iOS | 15.1. Apple's Liquid Glass needs iOS 26 and Xcode 26 |
| Expo | A dev build or EAS build (not Expo Go) |
| Web | `react-native-web` 0.19+ |

## Where to go next

1. [How it works](/guide/how-it-works): the two-minute mental model.
2. [Installation](/installation/): pick your setup.
3. [Quick start](/guide/quick-start): glass on screen in five minutes.
4. [Core concepts](/guide/core-concepts): the backdrop rule. Read it before building real screens.
