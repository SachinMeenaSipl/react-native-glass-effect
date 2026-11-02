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

## Shader mode (`iosRenderer="shader"`)

`LGShaderRenderer` is the iOS twin of `RenderNodeGlassRenderer`. Each display-link frame it captures the backdrop with `renderInContext` (half resolution when blur ≥ 8px), skips the GPU if the pixels are unchanged, blurs with `MPSImageGaussianBlur`, and runs a Metal port of `GlassShaderSource.kt` that also draws the tint and border. Keep steps 1–7 in sync with the AGSL.

`GlassBackdrop` stays a plain `View`; it carries `nativeID="LiquidGlassBackdrop:<id>"` and glass finds it by walking the window. A backdrop containing the glass is skipped. If Metal or the backdrop is missing, it stays on system glass.

Limits: `renderInContext` runs on the main thread for every glass view, so this mode costs more than system glass and has not been profiled on a real device. It does not capture video or other layers that bypass Core Animation rendering. `transitionDuration` does not animate in this mode, and `motionLighting` is not supported.

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

With the default `iosRenderer="system"`: `refraction`, `distortion`, `chromaticAberration`, `edgeWidth`, `quality`, `motionLighting`, `backdropId`. The system owns those decisions. On iOS 26+ `blur`, `intensity`, `illumination` and `lightAngle` are also ignored.

## Accessibility

`reduceTransparency` prop **or** the system setting shows the opaque `_fallbackView`. The view listens to `UIAccessibilityReduceTransparencyStatusDidChangeNotification` and updates live. Effect changes animate with `transitionDuration` unless the system Reduce Motion setting is on.

## Build requirement

iOS 26 glass needs Xcode 26 (the `UIGlassEffect` code is behind `__IPHONE_26_0` compile guards). Older Xcode builds still work and use materials.
