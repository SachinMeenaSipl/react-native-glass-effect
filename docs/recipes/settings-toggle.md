# Settings toggle

An in-app "Appearance" setting that changes every glass at once, through the theme.

<Preview id="recipe-settings-toggle" />

## Code

<<< @/../examples/shared/scenes/RecipeSettingsToggle.tsx

## How it works

- **Stronger glass** changes the theme's `defaultMaterial` from `thin` to `thick`. Every glass without its own `material` prop follows it.
- **Solid surfaces** passes `reduceTransparency={solid || 'auto'}`. When it's off, the iOS system setting still applies (`'auto'`).
- Material changes animate natively over `transitionDuration` (180 ms by default).

## In a real app

Keep the setting in your app state (Context, Redux, Zustand…) and persist it, then pass it to one `GlassThemeProvider` at the root:

```tsx
function Root() {
  const { strongGlass } = useSettings();
  return (
    <GlassThemeProvider theme={{ defaultMaterial: strongGlass ? 'thick' : 'regular' }}>
      <App />
    </GlassThemeProvider>
  );
}
```
