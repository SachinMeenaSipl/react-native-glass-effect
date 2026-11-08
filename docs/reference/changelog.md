---
description: "Release history of react-native-liquid-glass-native, how to upgrade between versions, and known issues."
---

<!--@include: ../../CHANGELOG.md-->

## Upgrading

### From 0.2 to the next release

No breaking changes. The public API (`src/index.ts`) is unchanged.

- Web apps can now use the package directly. Add `react-native-web` and alias `react-native` to it. See [Web](/installation/web).
- Expo dev builds need no config plugin. See [Expo](/installation/expo).

### From 0.1 to 0.2

No breaking changes. 0.2 adds `LiquidGlass`, `FrostedGlass`, `GlassAdjuster`, the `liquid` and `liquidClear` materials, and the `iosRenderer` prop and theme setting.

The library follows semantic versioning. While it's below 1.0, a minor version may include breaking changes; they'll always be listed here with migration steps.

## Known issues

| Issue | Where | Status |
|---|---|---|
| Fabric logs "Could not find generated setter" for `LiquidGlassViewManager` and `GlassBackdropManager` at startup | Android (seen on Expo SDK 58, React Native 0.88) | Under investigation. Glass renders and props apply |
| No development warning when a prop is ignored on the current platform (for example `refraction` on the web) | All | Possible improvement |
| Native Android builds can fail on Windows when the project path is long | Windows | Workaround in [Troubleshooting](/reference/troubleshooting#installation-and-builds) |
| Blur is drawn incorrectly while glass fades (`opacity` below 1) | iOS | UIKit limitation. Fade the content instead |
| Content in a `SurfaceView` (some video and map views) can't be captured | Android | Use texture mode |
| Expo Go shows a plain fallback | Expo Go | By design: use a dev build |
