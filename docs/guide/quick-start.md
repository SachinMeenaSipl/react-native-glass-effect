# Quick start

This page puts glass on screen in five minutes. It assumes you've installed the library: if not, start with [Installation](/installation/).

<Preview id="quick-start" />

## Step 1: a background to blur

Glass needs something behind it. In the examples on this site, that's `Background`: a scrollable list of coloured bands. Use your own content in a real app: an image, a list, a map.

<<< @/../examples/shared/Background.tsx

## Step 2: the screen

<<< @/../examples/shared/scenes/QuickStart.tsx

What's happening:

1. **`<GlassBackdrop>`** wraps everything the glass should see through. Here it fills the screen with `StyleSheet.absoluteFill`.
2. **`<LiquidGlassView>`** is rendered **next to** the backdrop, on top of it. It blurs and bends whatever scrolls underneath.
3. **`<LiquidGlassButton>`** is a glass pill with press feedback.

## Step 3: run it

::: code-group

```sh [React Native]
npx react-native run-android   # or run-ios
```

```sh [Expo]
npx expo run:android   # or run:ios
```

```sh [Web (Vite)]
npm run dev
```

:::

Scroll the bands: the header and button blur them live.

## Step 4: check the renderer

Add this anywhere to see which renderer your device picked:

```tsx
import { useGlassCapabilities } from 'react-native-liquid-glass-native';

const caps = useGlassCapabilities();
console.log(caps.bestRenderer, caps.isNativeAvailable);
// Android 13+: "shader" true · Web: "fallback" false
```

If `isNativeAvailable` is `false` on a phone, the app wasn't rebuilt after installing. See [Verify the install](/installation/verify).

## Next

- [Core concepts](/guide/core-concepts): the backdrop rule. Three minutes that save hours.
- [Components](/components/liquid-glass-view): every component, with complete examples.
- [Recipes](/recipes/): headers, tab bars, cards over images, modals.
