# Cards over images

Glass cards that scroll over a still wallpaper. This is the pattern for "my glass scrolls with the content".

<Preview id="recipe-cards-over-image" />

## Code

<<< @/../examples/shared/scenes/RecipeCardsOverImage.tsx

## How it works

- **Only the background goes in the backdrop.** Here it's coloured shapes. In a real app, an `<Image>` with `StyleSheet.absoluteFill`.
- **The scrolling list sits on top**, outside the backdrop. Each card is glass, so each one blurs the part of the wallpaper under it as it scrolls.

This is the answer to the most common question: "my cards scroll with the content, so where does the backdrop go?" The cards aren't the backdrop; the wallpaper is.

## With a real image

```tsx
<GlassBackdrop style={StyleSheet.absoluteFill}>
  <Image source={require('./wallpaper.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover" />
</GlassBackdrop>
```

On Android 7–11, images loaded as HARDWARE bitmaps can't be captured. With Glide use `.disallowHardwareConfig()`, with Coil `allowHardware(false)`, for images behind glass.

## Performance

Moving glass re-blurs what's under it every frame on Android 12+, whatever the quality. Keep the number of cards visible at once small (roughly under 10 on mid-range phones), and keep the default `quality="auto"`. See [Quality and performance](/features/quality).
