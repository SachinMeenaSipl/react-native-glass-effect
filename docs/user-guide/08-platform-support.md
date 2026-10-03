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
| Needs `<GlassBackdrop>` | yes | yes | yes | no | no | no | no |
| Video/maps in TextureView | ✅ | ✅ | — | ✅ | ✅ | — | — |
| Video/maps in SurfaceView | — | — | — | n/a | n/a | — | — |

"—" means the prop is accepted and ignored, never an error.

## Why things look slightly different

iOS uses Apple's own glass; Android uses this library's renderer. They share the same design language (blur, tint, rim light, rounded shape, border), but they are **not pixel-identical**. Tune per platform if you need to:

```tsx
<LiquidGlassView blur={Platform.OS === 'android' ? 24 : 20} />
```
