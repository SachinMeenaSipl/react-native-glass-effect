package com.liquidglass.renderer

import android.graphics.Canvas

/** Which renderer implementation is active. */
internal enum class RendererKind {
  /** Android 13+: RenderNode + blur + AGSL refraction/lighting. */
  SHADER,
  /** Android 12+ (or 13+ at LOW): RenderNode + blur, canvas lighting. */
  BLUR,
  /** Any Android: bitmap snapshot + CPU blur, re-captured on a throttle. */
  COMPAT_LIVE,
  /** Any Android: bitmap snapshot captured once (quality="static"). */
  COMPAT_STATIC,
  /** No sampling: opaque/frosted colour (reduce transparency, no backdrop). */
  SOLID,
}

/**
 * One way of drawing the glass BACKGROUND (the part under the children).
 *
 * Contract:
 * - [draw] is called from LiquidGlassView.onDraw with the canvas already scaled for
 *   the press squish. It must leave the canvas state as it found it.
 * - [draw] returns true if it already painted rim/touch/press lighting (shader tier),
 *   so SurfacePainter can skip its approximations.
 * - [release] frees GPU/bitmap memory. The renderer may be reused after it.
 */
internal interface GlassRenderer {
  val kind: RendererKind
  fun draw(canvas: Canvas, frame: GlassFrame): Boolean
  fun release()
}
