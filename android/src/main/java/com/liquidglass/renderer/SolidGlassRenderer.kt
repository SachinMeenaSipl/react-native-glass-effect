package com.liquidglass.renderer

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.Paint

/**
 * No backdrop sampling at all. Used when:
 * - reduceTransparency is on        → fully opaque `fallbackColor`
 * - there is no GlassBackdrop       → "frosted" `fallbackColor` at 92% (still reads as a surface)
 * - the backdrop has not recorded its first frame yet (one frame only)
 */
internal class SolidGlassRenderer : GlassRenderer {
  override val kind = RendererKind.SOLID
  private val paint = Paint(Paint.ANTI_ALIAS_FLAG)

  override fun draw(canvas: Canvas, frame: GlassFrame): Boolean {
    drawSolid(canvas, frame, paint)
    return false
  }

  override fun release() = Unit

  companion object {
    private const val FROSTED_ALPHA = 0.92f

    fun drawSolid(canvas: Canvas, frame: GlassFrame, paint: Paint) {
      com.liquidglass.util.GlassStats.solidDraws++
      val cfg = frame.config
      val alpha = if (cfg.reduceTransparency) 1f else FROSTED_ALPHA
      val c = cfg.fallbackColor
      paint.shader = null
      paint.color = Color.argb(
        (Color.alpha(c) * alpha).toInt(), Color.red(c), Color.green(c), Color.blue(c)
      )
      canvas.drawPath(frame.shape.path, paint)
    }
  }
}
