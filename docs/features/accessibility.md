# Accessibility

The library follows the system accessibility settings for you. Text contrast is your part.

<Preview id="accessibility" />

## Example

<<< @/../examples/shared/scenes/AccessibilityScene.tsx

## Handled for you

| Setting | Result |
|---|---|
| iOS **Reduce Transparency** | Glass becomes an opaque `fallbackColor` surface, live |
| **Reduce Motion** (iOS) / **Remove animations** (Android) | No squish, no animated transitions, no tilt lighting. The press highlight still shows |
| Screen readers | Glass is a normal view, and all `accessibility*` props work. `LiquidGlassButton` announces as a button, including when disabled |

## `reduceTransparency` and `fallbackColor`

| Value | Result |
|---|---|
| `'auto'` (default) | Follows iOS Reduce Transparency. Android has no such setting, so glass stays on |
| `true` | Always an opaque surface |
| `false` | Always glass, even if the iOS setting is on |

The opaque surface uses `fallbackColor`, which defaults to the material's (`#F2F2F7` light, `#2C2C2E` dark).

Android has no system Reduce Transparency setting. If your app has its own, pass it, as the example does:

```tsx
<LiquidGlassView reduceTransparency={settings.solidSurfaces || 'auto'} />
```

## Hooks

| Hook | Returns |
|---|---|
| `useReduceTransparency()` | The iOS Reduce Transparency setting, live. Always `false` on Android and web |
| `useReduceMotion()` | The system Reduce Motion setting, live |

## Text contrast (your part)

Glass shows whatever is behind it, so contrast changes as content scrolls.

| Technique | How |
|---|---|
| A thicker material behind text | `material="thick"`, or a higher `tintOpacity` |
| Adaptive text colour | `PlatformColor('label')` on iOS; pick by `useColorScheme()` on Android |
| A text shadow on headlines | `textShadowColor: 'rgba(0,0,0,0.25)', textShadowRadius: 4` |
| Test the worst case | White text over a white photo, and dark text over a dark one |

WCAG asks for a 4.5:1 contrast ratio for body text. `thin` and `clear` over busy photos usually fail it, so use them for icons and short labels.
