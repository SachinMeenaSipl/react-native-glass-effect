# Glass in a modal

A glass sheet inside a React Native `Modal`.

<Preview id="recipe-modal" />

In the live web preview, press **Open sheet**. The Android capture shows the sheet already open.

## Code

<<< @/../examples/shared/scenes/RecipeModal.tsx

## How it works

A `Modal` is a **separate window**. A backdrop outside the modal can't be seen from inside it, so the modal needs its **own** `GlassBackdrop`:

```tsx
<Modal transparent visible={open}>
  <View style={{ flex: 1 }}>
    <GlassBackdrop style={StyleSheet.absoluteFill}>
      {/* what the sheet should blur */}
    </GlassBackdrop>
    <LiquidGlassView material="thick" style={styles.sheet}>…</LiquidGlassView>
  </View>
</Modal>
```

Without its own backdrop, glass in a modal shows a solid colour on Android.

## What to put in the modal's backdrop

| Option | How |
|---|---|
| A copy of the screen's background | Render the same image or gradient |
| A blurred photo of the context | An `<Image>` of the item being shared |
| Plain colours | Fine for a menu or a sheet |

## Bottom sheet libraries

Libraries such as `@gorhom/bottom-sheet` render in the same window as your screen, not in a `Modal`, so the screen's own `GlassBackdrop` should work: put the glass sheet next to it, not inside it.

::: info
Bottom sheet libraries haven't been tested with this library yet.
:::
