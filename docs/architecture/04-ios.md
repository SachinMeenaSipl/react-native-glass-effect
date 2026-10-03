# 04 · iOS

iOS already has real glass, so the iOS side is deliberately thin.

| iOS | Effect | Tint | Lighting | Interactive |
|---|---|---|---|---|
| 26+ | `UIGlassEffect` (`.regular` / `.clear` from `appearance`) | `glass.tintColor` (tint × tintOpacity) | system | `glass.interactive` |
| 15–25 | `UIBlurEffect` system material (picked from `blurRadius`) | tint view inside the effect | `CAGradientLayer` sheen along `lightAngle` | JS scale (button) |

`blurRadius` → material (iOS 15–25):

| blurRadius (dp) | Material |
|---|---|
| ≤ 6, or `appearance="clear"` | `systemUltraThinMaterial` |
| ≤ 14 | `systemThinMaterial` |
| ≤ 26 | `systemMaterial` |
| > 26 | `systemThickMaterial` |

## View structure

```
LiquidGlassViewComponentView (self)
 ├─ UIVisualEffectView  _effectView     (glass / blur, border, radius)
 │    └─ contentView: _tintView + _sheenLayer (pre-26)
 ├─ UIView              _fallbackView   (reduce transparency)
 └─ LGChildContainerView _childContainer   ← React children mount HERE
```

Children are mounted into `_childContainer` (overriding `mountChildComponentView`) because `RCTViewComponentView` checks child indexes on unmount. Putting glass layers in the same container would break those checks. The container returns `nil` from `hitTest` for empty space, so touches still resolve to the glass component view.

## Ignored on iOS (by design)

`refraction`, `distortion`, `chromaticAberration`, `edgeWidth`, `quality`, `motionLighting`, `backdropId`. The system owns those decisions. `GlassBackdrop` renders a plain `View`.

## Accessibility

`reduceTransparency` prop **or** the system setting shows the opaque `_fallbackView`. The view listens to `UIAccessibilityReduceTransparencyStatusDidChangeNotification` and updates live. Effect changes animate with `transitionDuration` unless the system Reduce Motion setting is on.

## Build requirement

iOS 26 glass needs Xcode 26 (the `UIGlassEffect` code is behind `__IPHONE_26_0` compile guards). Older Xcode builds still work and use materials.
