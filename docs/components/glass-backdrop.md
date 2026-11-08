# GlassBackdrop

Wraps the content that glass should see through: images, lists, maps, gradients. Glass views are rendered **next to** it, on top of it, never inside it.

<Preview id="glass-backdrop" />

## Why it exists

On Android, a view can't see what's behind it. `GlassBackdrop` records what it draws into a GPU display list, and every glass view replays that list, lined up with its own position, through the blur. See [How it works](/guide/how-it-works).

On iOS (with the default system renderer) and on the web, the platform blurs the screen by itself, so `GlassBackdrop` is a plain `View` there. Keep it anyway: the same code then works everywhere, and the iOS shader renderer needs it.

## Import

```tsx
import { GlassBackdrop } from 'react-native-liquid-glass-native';
```

## Minimal example

A complete screen that uses only React Native and this library. Copy it into `App.tsx` to try it.

<<< @/../examples/shared/minimal/GlassBackdropMinimal.tsx

## Basic usage

```tsx
<View style={{ flex: 1 }}>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <ScrollView>{/* photos, lists, gradients… */}</ScrollView>
  </GlassBackdrop>

  <LiquidGlassView style={styles.header} />
</View>
```

## Full example: two backdrops on one screen

When a screen has more than one backdrop, name them with `backdropId`, and tell each glass which one to sample:

<<< @/../examples/shared/scenes/GlassBackdropScene.tsx

This is the screen in the preview above. It uses helpers from the repo's `examples/shared` folder (`Background`, the `ART` artwork and drawn icons); replace them with your own content.

Without `backdropId`, a glass view picks the backdrop behind it automatically. You only need names when backdrops overlap or sit next to each other.

## Props

Accepts every `<View>` prop, plus:

| Prop | Type | Default | What it does |
|---|---|---|---|
| `backdropId` | string | — | A name, so a glass view can target this backdrop with the same `backdropId` |

## Rules

| Do | Don't |
|---|---|
| Render glass as a sibling after the backdrop | Put glass inside the backdrop |
| Make the backdrop cover the glass (`StyleSheet.absoluteFill`) | Let the glass extend past the backdrop: that part shows tint only |
| Use one big backdrop per screen when you can | Wrap every list item in its own backdrop |
| Give a `Modal` its own backdrop | Expect a backdrop outside the modal to show through: a modal is a separate window |

## What content can be captured (Android)

| Content | Android 12+ | Android 7–11 |
|---|---|---|
| Views, images, text, lists | ✅ live | ✅ snapshot |
| Video or maps in a `TextureView` | ✅ live | — (shows the fallback) |
| Video or maps in a `SurfaceView` | — | — |
| Images decoded as HARDWARE bitmaps (Glide, Coil) | ✅ | — (solid fallback, retried every 3 s) |

For video and maps, use the library's texture mode (for example `useTextureView` in react-native-video). On Android 7–11, turn off hardware bitmaps for images behind glass: Glide `.disallowHardwareConfig()`, Coil `allowHardware(false)`.

## Related

- [Core concepts: the backdrop rule](/guide/core-concepts)
- [Glass in a modal](/recipes/modal)
