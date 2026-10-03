# 10 · Troubleshooting

First step on Android: `adb logcat -s LiquidGlass`. Most problems print a one-line explanation there.

| Symptom | Cause | Fix |
|---|---|---|
| Glass is a flat, solid colour (Android) | No `GlassBackdrop`, or the glass is **inside** it | Wrap the background in `<GlassBackdrop>` and render glass next to it. See [Core concepts](03-core-concepts.md) |
| Solid colour only inside a Modal | Modal = separate window | Add a `GlassBackdrop` inside the Modal |
| Warning "Native code not found" | App not rebuilt, or Expo Go | Rebuild (`run-android` / `pod install` + `run-ios`); use an Expo dev build |
| No blur on Android 11 and older, only a solid colour | Images loaded as HARDWARE bitmaps can't be captured in software | Glide: `.disallowHardwareConfig()`; Coil: `allowHardware(false)` for images behind glass; or accept the solid fallback |
| Video / map behind glass shows black or transparent | It renders into a `SurfaceView` | Use TextureView mode (e.g. react-native-video `useTextureView`, map libraries' texture options) |
| Part of the glass looks empty / tint-only | The glass extends past its backdrop | Make the backdrop cover the glass (`StyleSheet.absoluteFill`) |
| iOS: blur looks wrong while fading glass in/out | UIKit can't render blur correctly at alpha < 1 | Fade the content inside the glass, or scale the glass instead |
| Stutters while an animation plays **under** a glass | Glass over changing content re-blurs every frame | Expected; move the animation, or use a smaller blur. Check `getGlassStats().gpuBlurPasses` |
| Stutters while scrolling on older phones | Too many glass views / compat tier | `quality="low"` or `"static"`, fewer or smaller glass views |
| Looks flat on Android 12 | No refraction below Android 13 (by design) | Expected. Raise `illumination` / `borderOpacity` for more definition |
| `backgroundColor` on glass has no effect | It's drawn under the blur | Use `tint` + `tintOpacity` |
| Double border | Style `borderWidth` + glass border | Use the `borderWidth` **prop**, not the style |
| Glass doesn't follow a rotated parent (Android 7–9) | Rotation/scale alignment needs Android 10+ | Avoid rotating glass on old Android |
| Shader never shows on one device model | GPU driver rejected the shader; app fell back to blur | Nothing to do; it's automatic. Report the device model |
| Squish/transitions don't animate | System "Remove animations" / Reduce Motion is on | Expected (accessibility) |
| Glass looks different on iOS vs Android | iOS uses Apple's glass | Tune per platform, see [Platform support](08-platform-support.md) |

Still stuck? Open an issue with: RN version, device + Android/iOS version, `useGlassCapabilities()` output, and the `LiquidGlass` logcat lines.
