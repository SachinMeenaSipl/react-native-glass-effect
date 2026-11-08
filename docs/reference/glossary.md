---
description: "Terms used across the React Native Liquid Glass docs: glass view, backdrop, material, renderer names, quality, and the support status labels."
---

# Glossary

The docs use these terms consistently. When a page says "renderer", it means one of the renderers below.

## Core terms

| Term | Meaning |
|---|---|
| **Glass view** | Any component that draws glass: `LiquidGlassView` and everything built on it (`LiquidGlass`, `FrostedGlass`, `LiquidGlassButton`, `LiquidGlassCard`, `GlassAdjuster`'s panel) |
| **Backdrop** | A `<GlassBackdrop>`: the content glass views blur and bend. Glass goes next to it, never inside it |
| **Material** | A named set of look values: `thin`, `regular`, `thick`, `clear`, `liquid`, `liquidClear`. See [Materials](/features/materials) |
| **Theme** | App-wide defaults set with `GlassThemeProvider` |
| **Quality** | The rendering budget of a glass view: `auto`, `high`, `medium`, `low`, `static` |
| **Native code** | The Android (Kotlin) and iOS (Objective-C++) parts of the library. Not available in Expo Go, tests or the web |
| **Web build** | `lib/web`: the library without native code, chosen automatically by web bundlers |

## Renderers

A **renderer** is the code path that draws a glass view. `useGlassCapabilities().bestRenderer` reports which one a device uses.

| Renderer | Where | How it draws |
|---|---|---|
| `shader` | Android 13+ | GPU blur, then an AGSL refraction shader, then tint, rim light and border |
| `blur` | Android 12 | GPU blur, then tint, rim light and border |
| `compat` | Android 7–11 | A snapshot of the backdrop, blurred on the CPU |
| `system-glass` | iOS 26+ | Apple's `UIGlassEffect` |
| `system-material` | iOS 15–25 | Apple's `UIVisualEffectView` blur materials |
| **iOS shader renderer** | iOS, with `iosRenderer="shader"` | The library's Metal renderer, matching Android. Reported as `system-glass` / `system-material` by `bestRenderer` |
| **CSS renderer** | Web | CSS `backdrop-filter: blur() saturate()` with tint, border and corners. Reported as `fallback` by `bestRenderer` |
| **Plain fallback** | Expo Go, tests, missing native code | A tinted view with no blur. Also reported as `fallback` |

## Support status labels

Tables across the docs use these labels:

| Label | Meaning |
|---|---|
| ✅ | Supported: the prop or feature works as described |
| ◐ | Approximated: a similar effect drawn a different way (for example the rim light on Android 12) |
| ⚙️ | System-controlled: the platform draws it; the prop has little or no effect |
| — | Ignored: the prop is accepted and has no effect. It never throws |
| ⛔ | Not supported |
| ❔ | Not yet tested on this platform |

For versions and what has actually been tested, see [Compatibility](/reference/compatibility).
