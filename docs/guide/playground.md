---
description: "Try React Native Liquid Glass in your browser: pick a material, adjust blur, tint, refraction, light and corners, and see the glass change live."
---

# Playground

Pick a material to load its values, then adjust any value with − and +. The glass at the top updates as you go. **Reset** returns to the picked material.

<Preview id="playground" initial="web" :height="760" />

## What you're seeing

The playground runs the real library in your browser through react-native-web, so it uses the [CSS renderer](/reference/glossary#renderers):

| Control | In the browser | On Android 13+ |
|---|---|---|
| Blur, Tint, Corners, Border | ✅ | ✅ |
| Intensity | ✅ (scales the blur) | ✅ |
| Refraction, Distortion, RGB split, Rim width | — | ✅ |
| Light, Light angle | — | ✅ |

To see every control take effect, run the [Expo example app](https://github.com/SachinMeenaSipl/react-native-glass-effect/tree/main/examples/liquid-glass-expo) on an Android phone and open **Playground**.

## Use the values in your app

The controls edit one object. Spread it onto any glass, together with the material you picked:

```tsx
<LiquidGlassView material="regular" blur={20} tintOpacity={0.14} refraction={0.35} cornerRadius={24} />
```

To build the same panel into your own app, see [GlassAdjuster](/components/glass-adjuster). The playground's source is `examples/shared/scenes/PlaygroundScene.tsx`.
