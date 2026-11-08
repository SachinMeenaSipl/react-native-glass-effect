---
description: "Answers to common questions about React Native Liquid Glass: Expo Go, web support, the new architecture, performance, dark mode, FlatList and animation."
---

# FAQ

## Does it work in Expo Go?

No real glass. Expo Go only runs native modules built into the Expo Go app. Components render a plain tinted view instead, so your layout still works. Use a dev build: `npx expo run:android`. See [Expo](/installation/expo#expo-go).

## Do I need a config plugin for Expo?

No. Autolinking picks the library up during `expo prebuild` and EAS builds.

## Does it work on the web?

Yes: React (Vite), Next.js (with server rendering) and Expo web. The glass uses CSS `backdrop-filter`, so blur, tint, border and corners work, but refraction and touch lighting don't. See [Web](/installation/web).

## Does it work with the old architecture?

No. React Native's New Architecture (the default since 0.76) is required.

## Why do I need `GlassBackdrop`?

On Android a view can't see what's behind it, so the library needs to know what to blur. `GlassBackdrop` marks that content. On iOS and the web it's a plain view, so keeping it costs nothing and the same code works everywhere. See [Core concepts](/guide/core-concepts).

## Why does iOS look different from Android?

By default iOS uses Apple's own glass. For the same look on both, use [`FrostedGlass`](/components/frosted-glass) or `iosRenderer="shader"`.

## Is it expensive?

Glass costs GPU time while the content under it changes, roughly in proportion to the number of glass views, their size and the blur. A few headers, buttons and cards are fine on mid-range phones. The default `quality="auto"` scales down on weak devices. See [Quality and performance](/features/quality).

## Can I animate glass?

Yes. Move, resize and transform glass views with `Animated` or Reanimated as usual. Changing glass props (material, tint, blur…) animates natively over `transitionDuration`. On iOS, avoid animating `opacity` on the glass itself.

## Can I use it in a FlatList?

Yes, as long as the backdrop is the background and not the list. See [Cards over images](/recipes/cards-over-images). Keep the number of glass items visible at once small.

## Does it support dark mode?

Yes. Every material has light and dark values, and the library follows the system scheme. Force one with `colorScheme` in the theme.

## Does it support accessibility settings?

Yes: Reduce Transparency (iOS), Reduce Motion, and screen readers. See [Accessibility](/features/accessibility).

## Is it free to use?

Yes. It's MIT licensed.
