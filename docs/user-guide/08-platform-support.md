# 8 · Platform support

| Feature | Android 13+ | Android 12 | Android 7–11 | iOS 26+ | iOS 15–25 | Web | Expo Go |
|---|---|---|---|---|---|---|---|
| Live background blur | ✅ GPU | ✅ GPU | ✅ snapshot (throttled) | ✅ system | ✅ system | ✅ CSS | — |
| Edge refraction / lens | ✅ | — | — | ✅ system | — | — | — |
| RGB split at edges | ✅ (`high`) | — | — | — | — | — | — |
| Rim lighting | ✅ shader | ✅ approx. | ✅ approx. | ✅ system | ✅ sheen | — | — |
| Touch-follow light | ✅ | ✅ | ✅ | ✅ system (`interactive`) | — | — | — |
| Press squish | ✅ native | ✅ native | ✅ native | ✅ system | ✅ JS | ✅ JS | ✅ JS |
| Tilt lighting | ✅ | ✅ | ✅ | — | — | — | — |
| Animated prop changes | ✅ | ✅ | ✅ | ✅ effect | ✅ effect | — | — |
| Needs `<GlassBackdrop>` | yes | yes | yes | no (yes with `iosRenderer="shader"`) | no (yes with `iosRenderer="shader"`) | no | no |
| Video/maps in TextureView | ✅ | ✅ | — | ✅ | ✅ | — | — |
| Video/maps in SurfaceView | — | — | — | n/a | n/a | — | — |

"—" means the prop is accepted and ignored, never an error.

**Expo dev builds** use the Android and iOS columns. **Web** covers React (Vite), Next.js (including server-side rendering) and Expo web. Setup: [Expo and web](11-expo-and-web.md).

## See both platforms

Recordings of the example app with `iosRenderer: 'shader'` in the theme: [Android](../videos/glass-demo-android.mp4) · [iOS](../videos/glass-demo-ios.mp4).

## Why things look slightly different

By default iOS uses Apple's own glass and Android uses this library's renderer, so they look clearly different: Apple's glass is lighter and paler. For a matching look, use `<FrostedGlass>` (the same shader on both) or `<LiquidGlass>` (Android tuned to match Apple's glass). Or tune per platform:

```tsx
<LiquidGlassView blur={Platform.OS === 'android' ? 24 : 20} />
```
