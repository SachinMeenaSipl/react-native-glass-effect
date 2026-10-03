# 5 · Materials & theming

## Built-in materials

| Material | Blur | Tint (light / dark) | Refraction | Feels like | Good for |
|---|---|---|---|---|---|
| `thin` | 10 | 8% / 18% | 0.25 | Barely frosted | Overlays on photos, floating chips |
| `regular` | 20 | 14% / 28% | 0.35 | Classic glass | Headers, cards, buttons (default) |
| `thick` | 36 | 28% / 45% | 0.30 | Milky, very readable | Sheets, menus, text-heavy panels |
| `clear` | 4 | 4% / 8% | 0.50 | A lens, almost no frost | Small controls over busy media |

## Override one value

```tsx
<LiquidGlassView material="thick" blur={48} tint="#A0C4FF" />
```

## Change the look app-wide

```tsx
<GlassThemeProvider
  theme={{
    defaultMaterial: 'thick',
    materials: {
      thick: { blur: 40 },
      regular: { tint: { light: '#FFFFFF', dark: '#101820' } },
    },
  }}
>
  <App />
</GlassThemeProvider>
```

Order (last wins): **built-in preset → theme → component prop**, then `intensity`.

## Dark mode

Materials carry light and dark values. The library follows the system scheme; force it with `colorScheme: 'light' | 'dark'` in the theme.

## Brand colours

```tsx
// Subtle brand tint
<LiquidGlassView tint="#6D5DFC" tintOpacity={0.18} />

// Platform colours adapt to dark mode automatically
<LiquidGlassView tint={PlatformColor('systemBlue')} />   // iOS
```
