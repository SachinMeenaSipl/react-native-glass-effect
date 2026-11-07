# FrostedGlass

The library's own glass, drawn by the same shader on Android and iOS, so both platforms look alike and every prop works on both. It's `LiquidGlassView` with `iosRenderer="shader"` always set.

<Preview id="frosted-glass" />

## When to use it

Use `FrostedGlass` when Android and iOS must look the same: brand surfaces, designs built from a single mockup, or anything that uses refraction or the RGB split on iOS.

The cost: on iOS it samples a `<GlassBackdrop>` and runs a Metal shader, which takes more GPU time than Apple's system glass.

## Example

<<< @/../examples/shared/scenes/FrostedGlassScene.tsx

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
