# Theming

Use [`GlassThemeProvider`](/components/glass-theme-provider) to set glass defaults for your whole app, or for part of it.

<Preview id="glass-theme-provider" />

## Set defaults once

```tsx
import { GlassThemeProvider } from 'react-native-liquid-glass-native';

export default function Root() {
  return (
    <GlassThemeProvider
      theme={{
        defaultMaterial: 'thick',
        defaultQuality: 'auto',
        cornerRadius: 20,
        colorScheme: 'auto',
        iosRenderer: 'system',
      }}
    >
      <App />
    </GlassThemeProvider>
  );
}
```

## Customise materials

`materials` overrides values of the built-in presets. Only the values you pass change:

```tsx
<GlassThemeProvider
  theme={{
    materials: {
      regular: { blur: 24, tintOpacity: { light: 0.2, dark: 0.3 } },
      thick: { tint: { light: '#E8F0FF', dark: '#0F1A33' } },
    },
  }}
>
```

Colours and tint opacities take a `{ light, dark }` pair.

## Precedence

Last wins:

1. Built-in preset
2. Theme `materials` override
3. Component prop
4. `intensity`, then clamping

So a component can always override the theme for itself.

## Dark mode

The theme follows the system colour scheme (`colorScheme: 'auto'`). Force a scheme for part of your app:

```tsx
<GlassThemeProvider theme={{ colorScheme: 'dark' }}>
  <MediaPlayer />
</GlassThemeProvider>
```

## Brand colours

```tsx
<GlassThemeProvider
  theme={{
    materials: {
      regular: { tint: { light: '#6D5DFC', dark: '#2A2260' }, tintOpacity: { light: 0.16, dark: 0.3 } },
    },
  }}
>
```

## Nesting

Inner providers merge on top of outer ones for their subtree. Use this for a section that needs a different look:

```tsx
<GlassThemeProvider theme={{ defaultMaterial: 'regular' }}>
  <App>
    <GlassThemeProvider theme={{ defaultMaterial: 'clear', cornerRadius: 999 }}>
      <PlayerControls />
    </GlassThemeProvider>
  </App>
</GlassThemeProvider>
```

## Make all iOS glass match Android

```tsx
<GlassThemeProvider theme={{ iosRenderer: 'shader' }}>
```

Every glass on iOS, including buttons and cards, then uses the library's Metal renderer. Each one needs a `GlassBackdrop` behind it. See [iOS renderers](/features/ios-renderers).

## Change the theme at runtime

The theme is a normal prop, so state works. See the [Settings toggle](/recipes/settings-toggle) recipe.
