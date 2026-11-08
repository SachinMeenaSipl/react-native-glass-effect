# GlassThemeProvider

Sets app-wide glass defaults once, instead of on every component. It's optional: without it, the library uses the default theme.

<Preview id="glass-theme-provider" />

## Import

```tsx
import { GlassThemeProvider } from 'react-native-liquid-glass-native';
```

## Minimal example

A complete screen that uses only React Native and this library. Copy it into `App.tsx` to try it.

<<< @/../examples/shared/minimal/GlassThemeProviderMinimal.tsx

## Full example

<<< @/../examples/shared/scenes/ThemeScene.tsx

This is the screen in the preview above. It uses helpers from the repo's `examples/shared` folder (`Background`, the `ART` artwork and drawn icons); replace them with your own content.

## Props

| Prop | Type | What it does |
|---|---|---|
| `theme` | `GlassThemeOverrides` | The values to change. Everything is optional |
| `children` | node | Your app or a part of it |

## Theme values

| Key | Type | Default | What it does |
|---|---|---|---|
| `defaultMaterial` | material name | `'regular'` | Used when a component has no `material` prop |
| `defaultQuality` | `'auto' \| 'high' \| 'medium' \| 'low' \| 'static'` | `'auto'` | Used when a component has no `quality` prop |
| `cornerRadius` | dp | `24` | Used when a component has neither `cornerRadius` nor `style.borderRadius` |
| `colorScheme` | `'auto' \| 'light' \| 'dark'` | `'auto'` | Follow the system, or force light or dark values |
| `iosRenderer` | `'system' \| 'shader'` | `'system'` | iOS renderer for every glass without its own `iosRenderer`, buttons and cards included |
| `materials` | per-material partial values | `{}` | Overrides merged on top of the built-in presets |

## Order of precedence

Last wins:

1. The built-in material preset
2. The theme's `materials` override for that material
3. The component's props
4. `intensity` scales the strengths, and everything is clamped

## Nesting

Providers can be nested. The inner one is merged on top of the outer one, for its subtree only. The example's clear pill uses this.

## Reading the theme

```tsx
import { useGlassTheme } from 'react-native-liquid-glass-native';

const { defaultMaterial, resolvedScheme } = useGlassTheme();
// resolvedScheme: the scheme in effect, 'light' or 'dark'
```

## Related

- [Theming](/features/theming): more patterns, such as dark mode and brand colours
- [Settings toggle](/recipes/settings-toggle): change the theme from an in-app setting
