# iOS renderers

On iOS you can choose who draws the glass: Apple, or the library.

<Preview id="ios-renderers" />

::: info
The Android capture above shows both panels looking the same, because `iosRenderer` only changes iOS. iOS screenshots will be added.
:::

## The two renderers

| | `iosRenderer="system"` (default) | `iosRenderer="shader"` |
|---|---|---|
| Who draws it | Apple: `UIGlassEffect` on iOS 26+, system materials on iOS 15–25 | The library's Metal renderer |
| Looks like | Apple's glass, lighter and paler | Android |
| Needs `<GlassBackdrop>` | No | Yes |
| Props that work | `tint`, `tintOpacity`, `cornerRadius`, border, `interactive` (iOS 26) | All of them |
| Cost | Lowest | Higher (samples the backdrop and runs a shader) |

## Example

<<< @/../examples/shared/scenes/IosRenderersScene.tsx

## Choosing

| You want | Use |
|---|---|
| The native iOS look, lowest cost | `system` (the default) |
| iOS and Android to look the same | `shader`, or `<FrostedGlass>` |
| Refraction, RGB split or tilt-style lighting on iOS | `shader` |

## Set it for one view, or for the whole app

```tsx
// One view
<LiquidGlassView iosRenderer="shader" />

// Every glass on iOS, including buttons and cards
<GlassThemeProvider theme={{ iosRenderer: 'shader' }}>
  <App />
</GlassThemeProvider>
```

`<FrostedGlass>` always uses the shader.

## If there's no backdrop

With `iosRenderer="shader"` and no `<GlassBackdrop>` behind the glass, iOS keeps drawing system glass and logs once:

```
[LiquidGlass] iosRenderer="shader" found no <GlassBackdrop>, using system glass.
```

## iOS 26 and Xcode

Apple's `UIGlassEffect` needs the app to be built with **Xcode 26**. An app built with an older Xcode runs fine on iOS 26 but gets system materials instead.
