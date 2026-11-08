# How it works

You don't need this page to use the library, but two minutes here make every other page easier.

## The big picture

<ArchitectureDiagram />

## The problem

Glass shows a blurred, bent copy of **what's behind it**. A normal view can't see behind itself: it only knows how to draw its own pixels. So every platform needs a different trick.

## Android

1. You wrap the content the glass should see in a [`<GlassBackdrop>`](/components/glass-backdrop).
2. The backdrop records what it draws into a GPU display list (a `RenderNode`). This isn't a screenshot: it's a list of drawing commands, cheap to replay.
3. Each glass view replays that list, lined up with its own position on screen, through a blur, a saturation step and, on Android 13+, a refraction shader written in AGSL.
4. The glass then draws its tint, rim light and border, and finally its children on top, sharp.

When the content under the glass changes, or the glass moves, only the glass views that overlap the change redraw. Changes far away cost nothing.

On Android 7–11, GPU blur isn't available, so the library takes a snapshot of the backdrop, blurs it on the CPU and reuses it while it can.

One frame, step by step:

<AndroidPipelineDiagram />

## iOS

iOS can blur the real screen by itself, so by default the library uses Apple's own effect:

- **iOS 26+**: `UIGlassEffect`, Apple's Liquid Glass.
- **iOS 15–25**: `UIVisualEffectView` system materials.

`<GlassBackdrop>` is a plain view on iOS in that mode. Keep it anyway: the same code then works on both platforms.

With `iosRenderer="shader"`, iOS uses the library's own Metal renderer instead. It samples the backdrop like Android does, so the two platforms match and every prop works. See [iOS renderers](/features/ios-renderers).

## Web

The web build uses CSS `backdrop-filter: blur() saturate()` with your tint, border and corner radius. Refraction, chromatic aberration and touch lighting have no web equivalent, so those props are accepted and ignored. See [Web installation](/installation/web).

## Materials and resolution

Every glass starts from a **material**, a named set of values (blur, tint, refraction, light, border…). The library resolves the final values in this order, last wins:

1. The built-in material preset.
2. Your theme's overrides for that material ([`GlassThemeProvider`](/components/glass-theme-provider)).
3. The props on the component.
4. `intensity` scales the effect strengths, and everything is clamped to safe ranges.

The result is a set of flat numbers sent to native. Native never knows the word "regular".

## Quality

`quality="auto"` (the default) picks the best effect the device can afford: less on old or low-RAM phones, in battery saver, or when many glass views are on screen. See [Quality and performance](/features/quality).

## Never crash

Every failure has a fallback:

| Situation | What you get |
|---|---|
| The shader fails to compile on a GPU | Blur without refraction |
| Capturing the backdrop fails | An opaque fallback surface |
| No backdrop on Android | An opaque fallback surface and one log line |
| Expo Go, tests, missing native code | A plain tinted view |
| Reduce Transparency is on | An opaque `fallbackColor` surface |

The full list is in the [edge-case table](/architecture/05-edge-cases).
