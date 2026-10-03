# 7 · Accessibility

## Handled for you

| Setting | Result |
|---|---|
| iOS **Reduce Transparency** | Glass becomes an opaque `fallbackColor` surface (live) |
| **Reduce motion** (iOS) / **Remove animations** (Android) | No squish, no animated transitions, no tilt lighting; press highlight still works |
| Screen readers | Glass is a normal View; all `accessibility*` props work. `LiquidGlassButton` announces as a button, including the disabled state |

## Android "reduce transparency"

Android has no system setting for this. If your app has one, pass it:

```tsx
<LiquidGlassView reduceTransparency={settings.solidSurfaces} />
```

## Text contrast (your part)

Glass shows whatever is behind it, so contrast changes as content scrolls.

| Technique | How |
|---|---|
| Use a thicker material behind text | `material="thick"` or a higher `tintOpacity` |
| Adaptive text colour | `PlatformColor('label')` on iOS; on Android pick by `useColorScheme()` |
| Text shadow for headlines | `textShadowColor: 'rgba(0,0,0,0.25)', textShadowRadius: 4` |
| Test | Worst case: white text over a white photo, and dark over dark |

WCAG asks for 4.5:1 for body text. `thin` and `clear` over busy photos usually **fail** for body text, so use them for icons and short labels.
