# FrostedGlass

The library's own glass, drawn by the same shader on Android and iOS, so both platforms look alike and every prop works on both. It's `LiquidGlassView` with `iosRenderer="shader"` always set.

<Preview id="frosted-glass" />

## When to use it

Use `FrostedGlass` when Android and iOS must look the same: brand surfaces, designs built from a single mockup, or anything that uses refraction or the RGB split on iOS.

The cost: on iOS it samples a `<GlassBackdrop>` and runs a Metal shader, which takes more GPU time than Apple's system glass.

## Import

```tsx
import { FrostedGlass } from 'react-native-liquid-glass-native';
```

## Minimal example

A complete screen that uses only React Native and this library. Copy it into `App.tsx` to try it.

<<< @/../examples/shared/minimal/FrostedGlassMinimal.tsx

## Full example

<<< @/../examples/shared/scenes/FrostedGlassScene.tsx

This is the screen in the preview above. It uses helpers from the repo's `examples/shared` folder (`Background`, the `ART` artwork and drawn icons); replace them with your own content.

## Props

All [`LiquidGlassView`](/components/liquid-glass-view#props) props except `iosRenderer`.

## Requirements

`FrostedGlass` needs a `<GlassBackdrop>` behind it **on iOS too**, because the shader samples it like Android does. Without one:

- **iOS** keeps drawing Apple's system glass and logs `[LiquidGlass] iosRenderer="shader" found no <GlassBackdrop>, using system glass.`
- **Android** draws the opaque fallback surface and logs a line to `adb logcat -s LiquidGlass`.

## Platform behaviour

| | Renderer |
|---|---|
| Android | The library's shader (blur and refraction depend on the Android version) |
| iOS | The library's Metal renderer |
| Web | CSS `backdrop-filter` |

## Related

- [iOS renderers](/features/ios-renderers): system glass versus the shader
- [GlassAdjuster](/components/glass-adjuster): tune a `FrostedGlass` live
