# 08 · Predicted runtime behaviour (code trace)

What the code will do at runtime, traced by reading it step by step. Use it to know what to expect on a device, and to spot the difference when a device disagrees.

**Confidence**: 🟢 follows directly from code we compiled/tested · 🟡 depends on Android/iOS framework behaviour we could not run · 🔴 unverified guess.

---

## Android

### A1 · Screen mounts (`GlassBackdrop` + one `LiquidGlassView` on top)

| # | What happens | Code | Conf. |
|---|---|---|---|
| 1 | Fabric creates both views and applies props. Glass `commitConfig()` snaps (first commit, not attached) | `LiquidGlassViewManager.onAfterUpdateTransaction` | 🟢 |
| 2 | Backdrop attaches → registered. Glass attaches → registered, pre-draw listener added, `needsRebind = true` | `onAttachedToWindow` | 🟢 |
| 3 | First frame, pre-draw: glass resolves the backdrop (same window, not an ancestor), enables recording on it (backdrop invalidates), picks a renderer (API 33+ → SHADER, compiles the AGSL once) | `ensureBinding`, `ensureRenderer` | 🟢 |
| 4 | Same frame, draw: the backdrop records its children into `contentNode` and draws it; then the glass draws the same node through blur → saturation → shader, then tint + border; children draw sharp on top | `GlassBackdropView.draw`, `RenderNodeGlassRenderer.draw` | 🟡 |
| 5 | If the glass is earlier in z-order than the backdrop, frame 1 shows the solid fallback and frame 2 shows glass | `hasRecordedContent()` branch | 🟢 |

**Expected on screen:** glass visible from the first or second frame. No flicker afterwards.

### A2 · User scrolls a list inside the backdrop

| # | What happens | Code | Conf. |
|---|---|---|---|
| 1 | ScrollView invalidates → Android calls `onDescendantInvalidated` up the tree → backdrop bumps `contentVersion` and tells its glass views to invalidate | `GlassBackdropView.onDescendantInvalidated`, `BackdropRegistry.notifyContentChanged` | 🟡 |
| 2 | Same frame: the child re-records its own display list; `contentNode` references it, so the glass re-renders with the new content | RenderNode references | 🟡 |
| 3 | Cost per frame: 1 blur + shader pass per glass over its sample area | — | 🟢 |

**Expected:** blur follows the list with no lag. GPU busy while scrolling, idle when stopped.

### A3 · Glass moves (Animated / Reanimated / scrolls itself)

| # | What happens | Code | Conf. |
|---|---|---|---|
| 1 | Native-driver animations change view properties without `invalidate` | — | 🟢 |
| 2 | Pre-draw compares the backdrop→glass matrix with last frame → changed → invalidate | `onPreDraw` | 🟢 |
| 3 | Draw re-records `glassNode` with the new matrix | `RenderNodeGlassRenderer` | 🟢 |
| 4 | Android 7–11: the snapshot is **shifted** by the delta (no re-capture) until the move exceeds half the padding | `BackdropSnapshot.draw / needsRecapture` | 🟢 |

**Expected:** blur stays locked to the world behind the glass while it moves, on every tier.

### A4 · Glass touching the screen edge (tab bar)

| # | What happens | Conf. |
|---|---|---|
| 1 | Sample area = glass + padding ∩ backdrop bounds, so nothing outside the screen is sampled | 🟢 |
| 2 | Blur uses `TileMode.CLAMP` at the node edge, so edge pixels repeat | 🟡 (framework semantics; the Skia preview with CLAMP emulation confirms the maths) |

**Expected:** evenly frosted to the edge, no see-through strip.

### A5 · Press on interactive glass / `LiquidGlassButton`

| # | What happens | Code | Conf. |
|---|---|---|---|
| 1 | DOWN passes through `dispatchTouchEvent` (observed, not consumed). Touch glow fades in over 120 ms; press amount animates 0→1 over 110 ms | `TouchLightController`, `PressAnimator` | 🟢 |
| 2 | Canvas scales to 0.965 around the centre; the backdrop sample is counter-scaled so the world doesn't move | `LiquidGlassView.draw`, renderers | 🟢 |
| 3 | JS `onPressIn` arrives a moment later → `pressed=true`, already pressed, no-op | `commitConfig` | 🟢 |
| 4 | UP: glass stays pressed until JS sends `pressed=false`, then springs back with overshoot (420 ms) | `PressAnimator` | 🟢 |
| 5 | A ScrollView steals the gesture → CANCEL → light fades, spring back | — | 🟡 |
| 6 | Disabled button: no native feedback | Button passes `interactive={false}` | 🟢 |

**Expected:** release begins one JS round-trip after the finger lifts (usually under one frame, longer if JS is busy).

### A6 · Many glass views (stress)

| Count | Auto quality (high-end 13+) | Per-frame GPU work while content moves |
|---|---|---|
| 1–6 | HIGH (refraction + RGB split) | N blur + shader passes |
| 7–12 | MEDIUM (no RGB split) | N blur + shader passes |
| 13+ | LOW (blur only, no shader) | N blur passes |

🟢 for the switching logic. 🔴 for actual frame rates; they must be measured.

**Far-away animations (🟢, fixed):** an invalidation inside a backdrop only redraws glass views whose sample area overlaps the changed view (old or new position). A corner spinner no longer re-blurs every glass. Check it with `skippedFarChanges` in `getGlassStats()`.

### A7 · Idle screen

Nothing changes, so there are no invalidations and no redraws. Pre-draw listeners only run when something else triggers a frame. 🟢 **Expected:** zero extra battery cost when nothing moves.

### A8 · Navigate away and back

| # | What happens | Conf. |
|---|---|---|
| 1 | Detach: glass unbinds; the backdrop stops recording and discards its display list; renderer memory is released | 🟢 |
| 2 | Re-attach: both re-register; glass rebinds; recording is re-enabled even though it's the same backdrop object | 🟢 (was a bug, fixed) |

### A9 · Collapsed / hidden glass (`height: 0`, `display: none`, invisible)

Pre-draw skips it, so there are no redraws. 🟢 (Before the fix this looped at 60 fps forever.)

### A10 · Setup mistakes

| Mistake | Result | Conf. |
|---|---|---|
| No backdrop | Frosted solid colour + one `LiquidGlass` logcat warning | 🟢 |
| Glass inside its backdrop | Never binds to it (no loop), solid + warning | 🟢 |
| Glass in a Modal, backdrop outside | Different window → solid + warning | 🟢 |
| Not rebuilt / Expo Go | JS fallback view + one JS warning | 🟢 |

### A11 · Android 7–11 (compat)

| Situation | Behaviour | Conf. |
|---|---|---|
| Content scrolls inside backdrop | Re-capture of a 1/4-size software drawing, at most every 32 ms (MEDIUM), with a final capture after scrolling stops | 🟢 |
| Images using HARDWARE bitmaps behind glass | Capture throws → solid, retried every 3 s, warning once | 🟡 |
| Video / map in SurfaceView | Not captured (empty) | 🟢 |

---

## iOS

### I1 · Mount

| # | What happens | Conf. |
|---|---|---|
| 1 | `LiquidGlassViewComponentView` creates: effect view, fallback view, child container (children always above) | 🟢 (code) / 🔴 (never compiled) |
| 2 | Props: iOS 26 → `UIGlassEffect` (regular/clear, tint, interactive). iOS 15–25 → system material picked from `blurRadius`, plus tint view and light sheen | 🟡 |
| 3 | RN applies its own border radius after us with the same value → consistent | 🟢 |
| 4 | `GlassBackdrop` is a plain View; the system samples the screen itself | 🟢 |

### I2 · Press a `LiquidGlassButton`

| iOS | Behaviour | Conf. |
|---|---|---|
| 26+ | JS spring (0.96) + system glass response when the finger lands on the glass surface (not on the label) | 🟡 |
| 15–25 | JS spring + sheen boost | 🟢 |

### I3 · Accessibility

Reduce Transparency on → opaque fallback, updates live via notification. Reduce Motion → effect changes don't animate. 🟢

### I4 · Performance

UIKit renders the blur. Cost grows with the number and size of overlapping blur views; Apple advises keeping them few. Fading glass (alpha < 1) renders blur incorrectly: a UIKit limitation. 🟡

---

## Bugs this trace found (all fixed)

| # | Bug | Symptom it would have caused | Fix |
|---|---|---|---|
| 1 | Zero-size / hidden glass never updated its "last seen" state | Redraw loop at 60 fps forever, draining battery | `onPreDraw` skips 0-size / hidden glass |
| 2 | Sampling beyond the backdrop at screen edges | Tab bars / headers faded to see-through at the edge | Sample area clipped to backdrop; shader `uOrigin` |
| 3 | Compat renderer throttled movement | Blur lagged, then snapped, while cards scrolled (Android 7–11) | Shift snapshot per frame; re-capture only past padding |
| 4 | Squish compensation baked into the compat capture | Background wobbled during the press spring (Android 7–11) | Compensate at draw time |
| 5 | Disabled button still observed touches | Disabled button squished and glowed | `interactive={false}` when disabled |
| 6 | iOS 26 button skipped the JS spring, but system glass rarely got the touch | No press feedback on iOS 26 | JS spring on iOS always; effect view touchable when interactive |
| 7 | Battery-saver IPC per glass per mount | Jank when many glass views mount (lists) | Cached, refreshed by broadcast |
| 8 | New chained RenderEffect every frame | Needless allocations / GPU layer updates | Reused while inputs are unchanged |
| 9 | Any change anywhere in a backdrop redrew every glass on it | Constant GPU work from a far-away spinner / Lottie | Proximity filter on the invalidated view's old + new screen rect |

## Still to verify on a device (highest risk first)

1. ~~The iOS code compiles~~ ✅ now type-checked with `npm run check:ios` (real iOS SDK + RN headers). Still unverified: `pod install`, linking, running 🟡
2. The Android Gradle + codegen build inside a real app 🔴 (Kotlin compiles against the real android.jar; Gradle itself not run)
3. A RenderNode drawn in two parents (backdrop + glass) renders correctly on the RenderThread 🟡
4. `onDescendantInvalidated` fires for scroll / animation on Android 8+ 🟡
5. `RenderEffect` CLAMP repeats edge pixels on a RenderNode (no dark rim at node edges) 🟡
6. Frame rates at 1 / 6 / 12 glass on mid-range hardware 🔴. The example's Stress screen now shows native work per second (`getGlassStats`) to make this a 5-minute measurement
