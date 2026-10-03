# 3 · Core concepts

## Concept 1: backdrop + glass

Glass shows a blurred, bent copy of **what's behind it**. On Android, a view can't see behind itself, so you tell the library what "behind" is:

| Piece | Role | Contains |
|---|---|---|
| `<GlassBackdrop>` | The **source** | Images, lists, maps, gradients: anything you want seen through glass |
| `<LiquidGlassView>` (and Button, Card) | The **lens** | Your UI: text, icons, controls |

### The one rule

> **Glass goes next to the backdrop, on top of it. Never inside it.**

✅ Correct:

```tsx
<View style={{ flex: 1 }}>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <FeedList />
  </GlassBackdrop>
  <LiquidGlassView style={styles.header} />
</View>
```

❌ Wrong: the glass is inside the backdrop, so it would have to blur itself:

```tsx
<GlassBackdrop style={{ flex: 1 }}>
  <FeedList />
  <LiquidGlassView style={styles.header} />
</GlassBackdrop>
```

The wrong version **doesn't crash**. The glass just shows a solid colour, and Android logs:
`LiquidGlass: A LiquidGlassView is INSIDE a GlassBackdrop…`

### "But my cards scroll with the content!"

Put the **background** (image/gradient) in the backdrop, and the scrolling list of glass cards on top:

```tsx
<View style={{ flex: 1 }}>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <Image source={wallpaper} style={StyleSheet.absoluteFill} />
  </GlassBackdrop>
  <ScrollView>
    {items.map((i) => <LiquidGlassCard key={i.id}>…</LiquidGlassCard>)}
  </ScrollView>
</View>
```

### iOS

iOS blurs the real screen by itself, so `GlassBackdrop` becomes a plain `View` there. Keep it anyway: the same code then works on both platforms.

## Concept 2: materials

A **material** is a named look (`thin`, `regular`, `thick`, `clear`). Pick one, then override single values if needed:

```tsx
<LiquidGlassView material="thick" blur={40} />
```

See [Materials & theming](05-materials-and-theming.md).

## Concept 3: quality

`quality="auto"` (the default) picks the best effect the phone can afford: less on old or low-RAM phones, in battery saver, or when many glass views are on screen. See [Quality & performance](06-quality-and-performance.md).

## Concept 4: it never crashes

Missing backdrop, old Android, weak GPU, Expo Go, web, screen reader settings: every case falls back to something sensible. The full list is in [the edge-case table](../architecture/05-edge-cases.md).
