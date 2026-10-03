package com.liquidglass.renderer.paint

import android.graphics.Canvas
import android.graphics.Color
import android.graphics.LinearGradient
import android.graphics.Paint
import android.graphics.Path
import android.graphics.RadialGradient
import android.graphics.Shader
import com.liquidglass.renderer.GlassFrame
import kotlin.math.hypot
import kotlin.math.max
import kotlin.math.min

/**
 * Draws the layers that sit ON TOP of the blurred backdrop, identical on every tier:
 *
 *   1. tint          – the material colour at `tintOpacity`
 *   2. sheen         – soft light-facing gradient        (skipped when the shader lit it)
 *   3. touch glow    – radial light under the finger     (skipped when the shader lit it)
 *   4. press veil    – slight brightening while pressed  (skipped when the shader lit it)
 *   5. border        – 1dp stroke, brighter on the lit side
 *
 * Gradients are cached and only rebuilt when size or light direction changes.
 */
internal class SurfacePainter {

  private val fill = Paint(Paint.ANTI_ALIAS_FLAG)
  private val stroke = Paint(Paint.ANTI_ALIAS_FLAG).apply { style = Paint.Style.STROKE }
  private val borderPath = Path()

  private var sheenKey = FloatArray(0)
  private var sheen: Shader? = null
  private var borderKey = FloatArray(0)
  private var border: Shader? = null

  fun paint(canvas: Canvas, frame: GlassFrame, lightingDoneByShader: Boolean, drawTint: Boolean = true) {
    val cfg = frame.config
    val shape = frame.shape
    val w = frame.width.toFloat()
    val h = frame.height.toFloat()
    if (w <= 0f || h <= 0f) return

    // 1. tint
    if (drawTint && cfg.tintOpacity > 0f) {
      fill.shader = null
      fill.color = withAlpha(cfg.tintColor, Color.alpha(cfg.tintColor) / 255f * cfg.tintOpacity)
      canvas.drawPath(shape.path, fill)
    }

    val light = frame.light
    if (!lightingDoneByShader) {
      // 2. sheen
      if (cfg.illumination > 0.01f) {
        val key = floatArrayOf(w, h, light.dirX, light.dirY, cfg.illumination)
        if (!key.contentEquals(sheenKey)) {
          sheenKey = key
          val cx = w / 2f
          val cy = h / 2f
          val reach = hypot(w, h) / 2f
          sheen = LinearGradient(
            cx + light.dirX * reach, cy + light.dirY * reach, cx, cy,
            intArrayOf(white(0.22f * cfg.illumination), white(0.04f * cfg.illumination), Color.TRANSPARENT),
            floatArrayOf(0f, 0.35f, 1f),
            Shader.TileMode.CLAMP
          )
        }
        fill.shader = sheen
        canvas.drawPath(shape.path, fill)
        fill.shader = null
      }

      // 3. touch glow
      if (light.touchStrength > 0.01f) {
        val radius = max(min(w, h) * 0.6f, 48f * frame.density)
        fill.shader = RadialGradient(
          light.touchX, light.touchY, radius,
          white(0.22f * light.touchStrength), Color.TRANSPARENT, Shader.TileMode.CLAMP
        )
        canvas.drawPath(shape.path, fill)
        fill.shader = null
      }

      // 4. press veil
      if (light.press > 0.01f) {
        fill.color = white(0.07f * light.press)
        canvas.drawPath(shape.path, fill)
      }
    }

    // 5. border
    val borderPx = cfg.borderWidthDp * frame.density
    if (borderPx > 0f && cfg.borderOpacity > 0f) {
      val op = cfg.borderOpacity
      val key = floatArrayOf(w, h, light.dirX, light.dirY, op)
      if (!key.contentEquals(borderKey)) {
        borderKey = key
        val cx = w / 2f
        val cy = h / 2f
        val reach = hypot(w, h) / 2f
        border = LinearGradient(
          cx + light.dirX * reach, cy + light.dirY * reach,
          cx - light.dirX * reach, cy - light.dirY * reach,
          intArrayOf(white(op), white(op * 0.3f), white(op * 0.65f)),
          floatArrayOf(0f, 0.55f, 1f),
          Shader.TileMode.CLAMP
        )
      }
      shape.insetPath(borderPx / 2f, borderPath)
      stroke.strokeWidth = borderPx
      stroke.shader = border
      canvas.drawPath(borderPath, stroke)
    }
  }

  private fun white(alpha: Float): Int = Color.argb((alpha.coerceIn(0f, 1f) * 255).toInt(), 255, 255, 255)

  private fun withAlpha(color: Int, alpha: Float): Int =
    Color.argb((alpha.coerceIn(0f, 1f) * 255).toInt(), Color.red(color), Color.green(color), Color.blue(color))
}
