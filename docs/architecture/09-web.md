# 09 · Web

How the library runs in a browser: which build is loaded, how glass is drawn, and what server rendering needs.

## Which build the browser gets

`package.json` exports three entry points for the same public API:

| Export condition | File | Used by |
|---|---|---|
| `source` | `src/index.ts` | Tools that compile the TypeScript source, such as the docs' example type-check |
| `browser`, `node` | `lib/web/index.js` | Vite, webpack, Next.js (client and server), Expo web |
| `default` | `lib/module/index.js` | Metro for Android and iOS |

Metro versions that don't read `exports` use the `react-native` field instead, which points to `src/index.ts`.

`lib/web` is written by `scripts/build-web.js` during `npm run prepare`. It's a copy of `lib/module` with one file swapped: `native/nativeBridge.js` is replaced by `native/nativeBridge.web.js`. The native bridge is the only module that imports the codegen specs (`codegenNativeComponent`, `TurboModuleRegistry`), so after the swap no native code is reachable from the web entry.

Metro for Expo web gets the same web bridge, through the `browser` condition or the `.web.js` file extension.

## The web bridge

`nativeBridge.web.ts` exports the same names as the native bridge, with native turned off:

```ts
export const isNativeAvailable = false;
export const nativeModule = null;
export const NativeGlassView = null;
export const NativeBackdrop = null;
```

A unit test (`src/__tests__/webBridge.test.ts`) keeps the two bridges' exports in sync.

## The CSS renderer

With no native view, `LiquidGlassView` renders `FallbackGlass`, a react-native-web `View`. On the web it applies:

| Glass value | CSS |
|---|---|
| `blur` (after `intensity`) | `backdrop-filter: blur(<blur>px) saturate(160%)` (and the `-webkit-` prefix) |
| `tint`, `tintOpacity` | `background-color` with that opacity |
| `borderWidth`, `borderOpacity` | a white border at that opacity |
| `cornerRadius` | `border-radius` |
| `clipContent` | `overflow: hidden` |
| `reduceTransparency` on | an opaque `fallbackColor` background instead of the blur |

Refraction, distortion, chromatic aberration, edge width, the rim light, touch light and tilt lighting have no CSS equivalent, so they're ignored. `GlassBackdrop` is a plain `View`: the browser blurs whatever is painted behind the glass.

`useGlassCapabilities()` reports `platform: "web"` and `bestRenderer: "fallback"` (the docs call this the **CSS renderer**).

## Server rendering

- Nothing reads `window`, `document` or `navigator` when the package is imported, so Next.js can prerender pages that use it.
- On the server, Next.js resolves the `node` condition, which also points to `lib/web`, so the server never touches native code either.
- Components that use hooks must be in a `'use client'` file, like any client component.

Verified with Next.js 16 (App Router, Turbopack): `next build` prerenders the page and the browser hydrates it.

## Browser behaviour to know about

- `backdrop-filter` blurs what's painted behind the element. If an ancestor of the glass creates its own backdrop root (for example with `opacity` below 1, `filter`, `mask` or `will-change`), the glass only blurs content inside that ancestor.
- In a browser without `backdrop-filter`, the glass keeps its tint and border without the blur.

## Tests

- `src/__tests__/webBridge.test.ts` checks the web bridge (see above).
- `npm run typecheck` type-checks every documented example against the library source.
- During the 0.3.0 work, every example scene and copy-paste example was run in a Chromium browser with no page errors. These browser checks aren't part of CI yet.
