# 11 · Expo and web

This library runs in three places:

| Where | How | What you get |
|---|---|---|
| **Expo dev build / EAS build** | Native code, autolinked | Full native glass, same as bare React Native |
| **Expo Go** | No native code (Expo Go can't load third-party native modules) | Plain-view fallback. Layout works, glass doesn't |
| **Web** (React, Vite, Next.js, Expo web) | Pure JS + CSS `backdrop-filter` | Blurred glass in the browser, server-side rendering supported |

## Expo

### Dev build (recommended)

```sh
npx expo install react-native-liquid-glass-native
npx expo prebuild
npx expo run:android   # or: npx expo run:ios
```

No config plugin is needed. Autolinking picks up the native module during `prebuild`.

Requirements: an Expo SDK on React Native 0.76+ with the New Architecture. Tested on Expo SDK 58 (React Native 0.88).

### Expo Go

Expo Go only runs native modules that ship inside Expo's own app, so this library can't render real glass there. Components still render at the right size, using a plain tinted view, and `useGlassCapabilities().isNativeAvailable` is `false`. Build a dev build to see real glass.

### Expo web

```sh
npx expo install react-dom react-native-web @expo/metro-runtime
npx expo start --web
```

Expo's Metro bundler picks the web bridge automatically.

## Web

The web build uses real CSS `backdrop-filter` for the blur. Refraction, chromatic aberration and motion lighting have no web equivalent. Those props do nothing on web.

Web apps need `react-native-web` to render the components. The library lists it as an optional peer dependency.

```sh
npm install react-native-liquid-glass-native react-native-web react-dom
```

### Vite (React)

`vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Some dependencies expect Node's global object in the browser.
  define: { global: 'globalThis' },
  resolve: {
    alias: { 'react-native': 'react-native-web' },
    dedupe: ['react', 'react-dom', 'react-native-web'],
  },
});
```

`define` fixes a `global is not defined` error at runtime. `dedupe` keeps one copy of React even when the library is linked from a folder with its own React.

### Next.js (App Router)

`next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {
    resolveAlias: { 'react-native': 'react-native-web' },
  },
  webpack(config) {
    config.resolve.alias = { ...config.resolve.alias, 'react-native$': 'react-native-web' };
    return config;
  },
};

export default nextConfig;
```

Components that use glass hooks or event handlers need `'use client'` at the top of their file:

```tsx
'use client';

import { LiquidGlassView } from 'react-native-liquid-glass-native';
// ...
```

The library itself is server-safe: it reads no `window` or `document` at import time, so the page prerenders. Verified with Next.js 16.4 (`next build` with static prerender, then hydration in the browser).

### How the library picks the web build

`package.json` has an `exports` condition for `browser` and `node` that points to `lib/web/`. That build is identical to `lib/module/` except the native bridge is replaced by a web bridge. Bundlers choose it automatically, so no extra configuration is needed beyond the alias above.

## Tested with

| Setup | Versions | What was checked |
|---|---|---|
| Expo dev build, Android | Expo SDK 58, React Native 0.88, Android emulator | Native shader glass renders, button responds to taps |
| Expo web | Expo SDK 58, react-native-web 0.21 | Dev server and production export render, button works, no console errors |
| Vite | Vite 8, React 19 | Production build renders, button works, no console errors |
| Next.js | Next.js 16 (App Router) | `next build` prerenders the page, it hydrates in the browser, button works |

Not yet tested: Expo on iOS, EAS Build. Working examples for each setup are in [`examples/`](../../examples).

## What to check

```tsx
import { useGlassCapabilities } from 'react-native-liquid-glass-native';

const caps = useGlassCapabilities();
console.log(caps.platform, caps.bestRenderer, caps.isNativeAvailable);
// Expo dev build (Android 13+):  "android"  "shader"    true
// Expo Go:                       "android"  "fallback"  false
// Web:                           "web"      "fallback"  false
```

## Limits by platform

| Feature | Expo dev build | Expo Go | Web |
|---|---|---|---|
| Live blur | ✅ native | — | ✅ CSS `backdrop-filter` |
| Refraction, chromatic aberration | ✅ Android 13+ | — | — |
| `GlassBackdrop` | ✅ | plain view | plain view |
| Server-side rendering | n/a | n/a | ✅ Next.js |
