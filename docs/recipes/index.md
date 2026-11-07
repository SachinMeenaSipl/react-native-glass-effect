# Recipes

Complete, copy-paste patterns for common screens. Each one runs as-is on Android, iOS and the web, and has a live preview.

| Recipe | What it shows |
|---|---|
| [Glass header](/recipes/header) | A floating header over a scrolling feed, with a button inside |
| [Glass tab bar](/recipes/tab-bar) | A bottom tab bar with selected state |
| [Cards over images](/recipes/cards-over-images) | Glass cards scrolling over a still wallpaper |
| [Glass in a modal](/recipes/modal) | A glass sheet inside a `Modal` |
| [Settings toggle](/recipes/settings-toggle) | An in-app setting that changes every glass at once |

## Smaller patterns

### Hero element with tilt lighting

```tsx
<LiquidGlassView
  material="clear"
  interactive
  motionLighting
  chromaticAberration={0.3}
  quality="high"
  style={styles.hero}
/>
```

### Animate between materials

```tsx
<LiquidGlassView material={expanded ? 'thick' : 'thin'} transitionDuration={250} />
```

### React Navigation tab bar

Render the [glass tab bar](/recipes/tab-bar) from the navigator's `tabBar` prop, and wrap the navigator's content in one `GlassBackdrop`:

```tsx
<Tab.Navigator tabBar={(props) => <GlassTabBar {...props} />}>
```
