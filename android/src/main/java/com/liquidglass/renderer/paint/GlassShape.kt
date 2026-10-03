package com.liquidglass.renderer.paint

import android.graphics.Path
import android.graphics.RectF
import kotlin.math.min

/**
 * The rounded-rectangle outline of a glass view, in view-local px.
 * The radius is clamped to half the shortest side, so any cornerRadius is safe
 * (a huge radius simply becomes a pill / circle).
 */
internal class GlassShape {
  val rect = RectF()
  val path = Path()
  var radius = 0f
    private set

  private var lastW = -1f
  private var lastH = -1f
  private var lastR = -1f

  fun update(width: Int, height: Int, requestedRadiusPx: Float) {
    val w = width.toFloat()
    val h = height.toFloat()
    val r = requestedRadiusPx.coerceIn(0f, min(w, h) / 2f)
    if (w == lastW && h == lastH && r == lastR) return
    lastW = w; lastH = h; lastR = r
    radius = r
    rect.set(0f, 0f, w, h)
    path.rewind()
    path.addRoundRect(rect, r, r, Path.Direction.CW)
  }

  /** Same shape shrunk by [inset] px on every side (for centred border strokes). */
  fun insetPath(inset: Float, out: Path) {
    out.rewind()
    val r = (radius - inset).coerceAtLeast(0f)
    out.addRoundRect(
      rect.left + inset, rect.top + inset, rect.right - inset, rect.bottom - inset,
      r, r, Path.Direction.CW
    )
  }
}
