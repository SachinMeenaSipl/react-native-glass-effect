# 03 · Android renderer

Android is the reason this library exists, so this is the deepest doc.

---

## 1. The three problems

| Problem | Solution in this repo |
|---|---|
| A view can't see the pixels behind it | **Dynamic background capture**: `GlassBackdrop` records its drawing into a `RenderNode`, and glass re-draws that node |
| Old Androids have no GPU blur or shaders | **Tiers**: SHADER (13+), BLUR (12), COMPAT (7–11) |
| Low-end phones can't afford full glass | **Quality levels** + `auto` resolution |

---

## 2. Dynamic background capture

### What a RenderNode is (plain language)

A `RenderNode` is a **recording of drawing commands** ("draw this image here, draw this text there"), not a picture. Recording is cheap, and the same recording can be played back in several places. If a child view changes (a list scrolls), the recording refers to the child's own node, so every playback shows the new content automatically.

### How the backdrop records

```
GlassBackdropView.draw(canvas)
  if (Android 12+ && a glass is bound && hardware canvas)
      rc = contentNode.beginRecording()
      super.draw(rc)                 ← children draw into the recording
      contentNode.endRecording()
      canvas.drawRenderNode(contentNode)   ← screen shows it as normal
  else
      super.draw(canvas)             ← normal drawing, zero overhead
```

Recording is **off** until some glass binds to the backdrop (`BackdropRegistry.updateRecordingFlags`).

### How glass plays it back

```
glassNode (covers sampleRect = glass + pad, CLIPPED to the backdrop's bounds)
  record:
    translate(-sampleRect.left, -sampleRect.top)
    scale(1/squish) around centre      ← keep the world still while glass squishes
    concat(backdropToGlass matrix)     ← line the backdrop up with the screen
    drawRenderNode(backdrop.contentNode)
  effect:
    blur(blurPx) → saturation(1.35) → AGSL shader (13+)
canvas:
  clipPath(rounded shape) → translate(sampleRect.left, top) → drawRenderNode(glassNode)
```

The **padding** (`GlassFrame.padPx` ≈ 2×blur + refraction reach, max 256 px) makes blur and refraction near the edges read real neighbouring content.

The sample area is **clipped to the backdrop** (`LiquidGlassView.computeSampleRect`). Without that, glass flush with the screen edge (tab bars, full-width headers) would blur empty pixels in and fade to see-through at that edge. With it, the CLAMP blur repeats the backdrop's edge pixels. The shader receives the node's position as `uOrigin`.

The **matrix** comes from `View.transformMatrixToGlobal` for both views (API 29+). That makes translate, scale, rotation, scroll offsets and Reanimated/native-driver transforms line up exactly. API 24–28 use window positions, so translation is exact and rotation/scale are ignored.

### How glass knows when to redraw

| Signal | Source | Catches |
|---|---|---|
| Content version | `GlassBackdropView.onDescendantInvalidated` / `invalidateChildInParent` / `invalidate` → `BackdropRegistry.notifyContentChanged` | Scrolling, images loading, animations **inside** the backdrop |
| Geometry | `LiquidGlassView.onPreDraw` compares the backdrop→glass matrix with last frame | Glass or backdrop **moving** (including native-driver animations that never call `invalidate`) |
| Own state | prop commit, transition frames, touch/press/tilt | Everything the glass does itself |

All of these call `invalidate()` **before** drawing, so the glass updates in the **same frame**. There is no one-frame lag.

**Proximity filter.** `onDescendantInvalidated(child, target)` tells the backdrop *which* view changed. `BackdropRegistry.notifyContentChanged` maps that view's rect to screen coordinates, unions it with where that view was last time (so a moving view leaves no ghost), and only invalidates glass views whose screen sample area overlaps it. A spinner in one corner no longer re-blurs every glass on screen. The backdrop's own `invalidate()` (and API 24–25) still notify every glass. On Android 12+ this also lets the GPU keep each glass's cached blur layer, because an un-invalidated glass doesn't re-record its node.

### Matching glass to a backdrop

`BackdropRegistry.resolve` (first match wins):

1. same window only (a `Modal` is a separate window)
2. never a backdrop that contains the glass
3. `backdropId` match, if given
4. otherwise the backdrop with the largest on-screen overlap; ties go to the newest

---

## 3. Renderer tiers

`RendererFactory.choose` is the single decision point:

| Condition (first match wins) | Renderer |
|---|---|
| `reduceTransparency` | SOLID (opaque `fallbackColor`) |
| no backdrop found | SOLID (frosted, 92% `fallbackColor`) |
| `quality="static"` | COMPAT_STATIC |
| window not hardware accelerated | COMPAT_LIVE |
| API 33+, shader compiled, level HIGH/MEDIUM | SHADER |
| API 31+ | BLUR |
| otherwise | COMPAT_LIVE |

| Renderer | Blur | Refraction | Lighting | Cost |
|---|---|---|---|---|
| SHADER | GPU `RenderEffect` | AGSL | AGSL (rim, back-light, touch, press) | GPU only |
| BLUR | GPU `RenderEffect` | — | `SurfacePainter` (sheen, touch glow, press veil) | GPU only |
| COMPAT_LIVE | CPU StackBlur on a 1/4–1/8 bitmap | — | `SurfacePainter` | CPU, throttled |
| COMPAT_STATIC | same, captured once | — | `SurfacePainter` | once |
| SOLID | — | — | border only | ~0 |

All tiers finish with `SurfacePainter` (tint + border), so they look like one family.

### Software canvas (screenshots)

If `onDraw` gets a non-hardware canvas (e.g. `react-native-view-shot` drawing into a Bitmap), RenderNodes can't be drawn. The GPU renderer then delegates that one draw to a private `CompatGlassRenderer`, so screenshots still contain believable glass instead of crashing.

---

## 4. Quality

| Level | SHADER tier | COMPAT tier |
|---|---|---|
| HIGH | refraction + RGB split | capture every frame, 1/4 res |
| MEDIUM | refraction, no RGB split | capture ≤ every 32 ms, 1/4 res |
| LOW | BLUR renderer (no shader) | capture ≤ every 100 ms, 1/8 res |
| STATIC | COMPAT_STATIC | capture once + on move/resize |

`QualityResolver` for `auto`:

1. Start: HIGH on high-end Android 13+ (media performance class ≥ 12 **or** ≥ 6 GB RAM), otherwise MEDIUM.
2. Low-RAM device **or** battery saver → LOW.
3. More than 6 glass views in the window → one level down. More than 12 → LOW.

It re-runs when battery saver toggles (`SystemSettingsMonitor`), when glass views are added or removed, and when `quality` changes.

Compat throttling applies to **content** changes only, and always has a **trailing edge**: if a change is throttled, the renderer sets `frame.redrawAfterMs`, and the view posts a delayed redraw. The final state after scrolling stops is always captured.

**Movement is never throttled on compat.** When the glass or backdrop only translates, `BackdropSnapshot.draw` shifts the existing bitmap by the exact delta every frame (free). It re-captures immediately only when the shift would exceed half the padding, the snapshot no longer covers the glass, or scale/rotation changed. Glass cards scrolling over a wallpaper therefore stay aligned on Android 7–11. The press squish is compensated at draw time, so it's exact on every spring frame.

---

## 5. The shader (AGSL)

Source: `shader/GlassShaderSource.kt`. It runs per pixel **after** blur and saturation.

| Step | What it does |
|---|---|
| 1 Shape | Signed distance to the rounded rect; pixels outside pass through |
| 2 Rim | `bend` = 1 at the edge → 0 at `edgeWidth` inside (smoothstep) |
| 3 Normal | Direction the edge faces, from the distance field's gradient |
| 4 Lens | Whole surface magnifies by up to 12% × `distortion` (+2.5% when pressed) |
| 5 Refract | Near the rim, sample further inside along the normal × `refraction` × `edgeWidth` |
| 6 RGB split | Red and blue sampled at opposite offsets at the rim (`chromaticAberration`, HIGH only) |
| 7 Light | Specular on the rim facing `lightDir`; faint back-light on the opposite rim; Gaussian glow under the finger; slight lift while pressed |

Uniforms are pushed only when a value changed (`GlassShader.effectFor` compares a 15-float array). A `RenderEffect` captures uniforms at creation, so a new effect is made only when something changed.

**Compile failure** (rare GPU driver bugs): `GlassShader.createOrNull` catches it, sets `RendererTier.shaderBroken = true` for the process, and every glass view uses BLUR from then on.

---

## 6. Animation

| Feature | Class | Behaviour | Reduce motion |
|---|---|---|---|
| Prop transitions | `GlassConfigTransition` | 180 ms ease between old and new config; interruptions continue from mid-state; angles take the short way round; colours use ARGB interpolation | snap |
| Touch light | `TouchLightController` | Fade in 120 ms at the finger, smoothed follow, fade out 320 ms. Observes touches only, never consumes them | instant on/off |
| Press squish | `PressAnimator` | 0→1 in 110 ms; release springs back with overshoot (420 ms) for a jelly settle. Up to 3.5% smaller via **canvas** scale; the backdrop sample is counter-scaled so the world stays still | highlight only, no movement |
| Tilt lighting | `MotionLightSource` | One shared `GAME_ROTATION_VECTOR` listener (accelerometer fallback), smoothed, ±35°, paused in background via the TurboModule's lifecycle listener | off |

---

## 7. Fallbacks at a glance (Android)

| Situation | Result |
|---|---|
| API 24–30 | COMPAT snapshot renderer |
| Shader fails to compile | BLUR tier for the whole app |
| No hardware acceleration | COMPAT_LIVE |
| Software canvas (screenshot) | one-off compat draw |
| No backdrop / wrong `backdropId` / glass nested in its backdrop | SOLID frosted + one logcat warning |
| Snapshot capture throws (HARDWARE bitmaps) | SOLID, retried every 3 s, one warning |
| Out of memory creating a snapshot | SOLID, one warning |
| `reduceTransparency` | SOLID opaque, backdrop recording stops |

---

## 8. Performance notes

- API 31+: **no pixel readback** ever. Blur and shader run on the RenderThread / GPU.
- Backdrop recording costs roughly one extra display-list pass (CPU-side commands), and only while glass is bound.
- Per-frame allocations are avoided: Shaders and RenderEffects are cached by key, and bitmaps and blur buffers are reused.
- Built-in counters (`getGlassStats()` in JS; the example's Stress screen shows them per second): draws, GPU blur passes, shader passes, compat captures + ms, skipped far changes, solid draws, live views.
- Glass count is the main cost driver on the GPU (each glass = one blur pass over its own area + padding). That's why `auto` steps down above 6 and 12 views.
