# Core concepts

Four ideas explain almost everything about this library.

## 1. Backdrop and glass

Glass shows a blurred copy of **what's behind it**. On Android (and with the iOS shader renderer) you tell the library what "behind" is:

| Piece | Role | Contains |
|---|---|---|
| `<GlassBackdrop>` | The **source** | Images, lists, maps, gradients: anything you want seen through glass |
| `<LiquidGlassView>` and the components built on it | The **lens** | Your UI: text, icons, controls |

### The one rule

::: tip The rule
Glass goes **next to** the backdrop, **on top of** it. Never inside it.
:::

✅ Correct: the glass is a sibling rendered after the backdrop.

```tsx
<View style={{ flex: 1 }}>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <FeedList />
  </GlassBackdrop>
  <LiquidGlassView style={styles.header} />
</View>
```

❌ Wrong: the glass is inside the backdrop, so it would have to blur itself.

```tsx
<GlassBackdrop style={{ flex: 1 }}>
  <FeedList />
  <LiquidGlassView style={styles.header} />
</GlassBackdrop>
```

The wrong version **doesn't crash**. The glass shows a solid colour instead, and Android logs a line starting with `LiquidGlass: A LiquidGlassView is INSIDE a GlassBackdrop`.

### "But my cards scroll with the content"

Put only the **background** (image, gradient) in the backdrop, and the scrolling list of glass cards on top of it. The [Cards over images](/recipes/cards-over-images) recipe shows the full pattern.

```tsx
<View style={{ flex: 1 }}>
  <GlassBackdrop style={StyleSheet.absoluteFill}>
    <Image source={wallpaper} style={StyleSheet.absoluteFill} />
  </GlassBackdrop>
  <ScrollView>
    {items.map((item) => (
      <LiquidGlassCard key={item.id}>…</LiquidGlassCard>
    ))}
  </ScrollView>
</View>
```

### iOS and web

iOS (with the default system renderer) and the web blur the real screen by themselves, so `<GlassBackdrop>` is a plain view there. Keep it anyway: the same code then works everywhere.

## 2. Materials

A **material** is a named look. Pick one, then override single values if you need to:

```tsx
<LiquidGlassView material="thick" blur={40} />
```

| Material | Feels like | Good for |
|---|---|---|
| `thin` | Barely frosted | Overlays on photos, floating chips |
| `regular` | Classic glass (the default) | Headers, cards, buttons |
| `thick` | Milky, very readable | Sheets, menus, text-heavy panels |
| `clear` | A lens, almost no frost | Small controls over busy media |
| `liquid` | Apple-style Liquid Glass | Used by `<LiquidGlass>` |
| `liquidClear` | Apple-style clear lens | Used by `<LiquidGlass variant="clear">` |

See [Materials](/features/materials) for every value.

## 3. Quality

`quality="auto"` (the default) picks the best effect the device can afford. It lowers the effect on old or low-RAM phones, in battery saver, and when many glass views are on screen. You can force a level per view. See [Quality and performance](/features/quality).

## 4. It never crashes

Missing backdrop, old Android, a GPU that rejects the shader, Expo Go, the web, accessibility settings: every case falls back to something sensible. See [How it works](/guide/how-it-works#never-crash).
