package com.liquidglass.renderer

import android.graphics.Matrix
import android.graphics.RectF
import com.liquidglass.backdrop.GlassBackdropView
import com.liquidglass.capability.QualityLevel
import com.liquidglass.config.GlassConfig
import com.liquidglass.interaction.LightState
import com.liquidglass.renderer.paint.GlassShape
import kotlin.math.ceil
import kotlin.math.min

/**
 * Everything a renderer needs to draw ONE frame. Owned and refilled by
 * LiquidGlassView before every draw; renderers only read it.
 * Reused across frames to avoid allocations.
 */
internal class GlassFrame {
  var width = 0
  var height = 0
  var density = 1f
  var config: GlassConfig = GlassConfig()
  var level: QualityLevel = QualityLevel.MEDIUM

  val shape = GlassShape()
  val light = LightState()

  /** The backdrop being sampled, or null (→ solid fallback). */
  var backdrop: GlassBackdropView? = null

  /** Maps backdrop-local coordinates to glass-local ones. Valid when [hasGeometry]. */
  val backdropToGlass = Matrix()
  var hasGeometry = false

  /**
   * The area (glass-local px) that renderers sample: glass + padding, CLIPPED to where the
   * backdrop actually has content. Sampling outside the backdrop would blur empty pixels
   * into the glass, so glass flush with the screen edge would fade to see-through.
   * Blurs clamp at this rect's edges instead (edge pixels are repeated).
   * Empty when the glass doesn't overlap its backdrop at all.
   */
  val sampleRect = RectF()

  /** Backdrop CONTENT changed since the last successful capture (input). */
  var backdropChanged = true

  /** Glass or backdrop MOVED / resized since the last draw (input). */
  var geometryChanged = true

  /**
   * Output: set by a throttled renderer to ask for another draw after N ms, so the
   * final state is captured once things stop moving. -1 = not needed.
   */
  var redrawAfterMs = -1L

  /** Canvas scale the view applies around its centre for the press "squish" (1 = none). */
  var contentScale = 1f

  val blurPx: Float get() = config.blurRadiusDp * density
  val edgePx: Float get() = config.edgeWidthDp * density

  /**
   * Extra pixels sampled around the glass, so blur and refraction near the edges
   * read real content instead of smearing transparent pixels in.
   */
  val padPx: Int
    get() = min(ceil(blurPx * 2f + edgePx * config.refraction + 4f).toInt(), MAX_PAD_PX)

  private companion object {
    const val MAX_PAD_PX = 256
  }
}
