# 06 · Decisions (ADRs)

Short records of choices that look odd without context.

### ADR-001 · Android is the primary renderer
iOS has system glass; Android has nothing. The value of this library is the Android renderer, so that's where the complexity lives. iOS maps props onto system effects.

### ADR-002 · Explicit `<GlassBackdrop>` instead of automatic screen capture
A view cannot read what's behind it. Options were (a) capture the whole window, (b) an explicit source view.
(a) needs pixel readback (`PixelCopy`), is async, lags a frame, and captures the glass itself.
(b) gives live, same-frame, GPU-only sampling via RenderNodes, and is what mature Android blur libraries converge on.
Cost: one wrapper component and one rule ("glass goes outside the backdrop"). We accept it and make the failure mode safe (solid fallback + clear log).

### ADR-003 · Materials are resolved in JS
Native receives flat numbers. New materials, theme overrides and dark-mode variants need no native release, and both platforms stay consistent.

### ADR-004 · View managers extend `ReactViewManager` (no codegen delegate)
A codegen delegate only sets the spec's props plus base props. Glass must support every `<View>` prop (`pointerEvents`, `overflow`, `hitSlop`, …), which `ReactViewManager` implements with `@ReactProp`. With no delegate, RN uses its reflection setter, so both sets work. The codegen spec still produces the Fabric C++ props. `nativeContract.test.ts` keeps the names in sync.

### ADR-005 · Press squish on the canvas, not the View transform
RN styles, `Animated` and Reanimated all write `View.scaleX/Y/translation`. Writing them from native would fight user animations. Scaling the canvas in `draw()` is invisible to them.

### ADR-006 · Three tiers, not "Android 12+ only"
AGSL needs API 33; `RenderEffect` blur needs 31. Most of the installed base in several markets is still ≤ 30. A throttled snapshot renderer keeps the design language everywhere, and `quality` lets apps opt down.

### ADR-007 · Zero runtime dependencies
No Reanimated or Skia peer deps. Animations are native (Android) or `Animated` (JS button). This keeps install friction minimal.

### ADR-008 · New Architecture only
Fabric view managers + TurboModules. The old bridge is not supported (RN ≥ 0.76 defaults to the New Architecture).
