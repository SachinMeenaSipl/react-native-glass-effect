package com.liquidglass.renderer

import android.graphics.Canvas
import android.graphics.Paint
import android.os.SystemClock
import com.liquidglass.capability.QualityLevel
import com.liquidglass.compat.BackdropSnapshot
import com.liquidglass.renderer.paint.Saturation

/**
 * Snapshot renderer for Android 7–11, software canvases, and quality="static".
 *
 * MOVEMENT (glass or backdrop moves): never throttled. The snapshot is shifted by the
 * exact delta every frame (free), and re-captured immediately only when the shift would
 * exceed the padding or the scale/rotation changed. So moving glass stays aligned.
 *
 * CONTENT changes (scrolling/animation INSIDE the backdrop): LIVE mode re-captures at most
 *   HIGH every frame · MEDIUM every 32 ms · LOW every 100 ms
 * When a change is throttled, it asks the view to redraw once the interval has passed,
 * so the LAST state after scrolling stops is always captured (trailing edge).
 *
 * STATIC mode ignores content changes entirely (captures once; movement handled as above).
 */
internal class CompatGlassRenderer(private val static: Boolean) : GlassRenderer {

  override val kind = if (static) RendererKind.COMPAT_STATIC else RendererKind.COMPAT_LIVE

  private val snapshot = BackdropSnapshot()
  private val bitmapPaint = Paint(Paint.FILTER_BITMAP_FLAG or Paint.ANTI_ALIAS_FLAG).apply {
    colorFilter = Saturation.filter
  }
  private val solidPaint = Paint(Paint.ANTI_ALIAS_FLAG)

  private var lastCaptureMs = 0L
  private var capturedW = -1
  private var capturedH = -1
  private var capturedBlur = -1f
  private var capturedLevel: QualityLevel? = null

  override fun draw(canvas: Canvas, frame: GlassFrame): Boolean {
    val backdrop = frame.backdrop
    if (backdrop == null || !frame.hasGeometry || snapshot.isFailing) {
      SolidGlassRenderer.drawSolid(canvas, frame, solidPaint)
      return false
    }

    val now = SystemClock.uptimeMillis()
    val sizeChanged = frame.width != capturedW || frame.height != capturedH ||
      frame.blurPx != capturedBlur || frame.level != capturedLevel
    val moved = frame.geometryChanged && snapshot.hasContent && snapshot.needsRecapture(frame)
    val contentChanged = !static && frame.backdropChanged
    val interval = intervalMs(frame.level)

    if (!snapshot.hasContent || sizeChanged || moved ||
      (contentChanged && now - lastCaptureMs >= interval)
    ) {
      val t0 = System.nanoTime()
      val ok = snapshot.capture(backdrop, frame, scaleFor(frame.level))
      com.liquidglass.util.GlassStats.compatCaptures++
      com.liquidglass.util.GlassStats.compatCaptureNanos += System.nanoTime() - t0
      lastCaptureMs = now
      if (ok) {
        capturedW = frame.width
        capturedH = frame.height
        capturedBlur = frame.blurPx
        capturedLevel = frame.level
      }
    } else if (contentChanged) {
      frame.redrawAfterMs = interval - (now - lastCaptureMs)
    }

    if (!snapshot.hasContent) {
      SolidGlassRenderer.drawSolid(canvas, frame, solidPaint)
      return false
    }
    snapshot.draw(canvas, frame, bitmapPaint)
    return false
  }

  override fun release() {
    snapshot.release()
    capturedW = -1
    capturedH = -1
    capturedLevel = null
  }

  private fun intervalMs(level: QualityLevel): Long = when (level) {
    QualityLevel.HIGH -> 0L
    QualityLevel.MEDIUM -> 32L
    QualityLevel.LOW -> 100L
    QualityLevel.STATIC -> Long.MAX_VALUE // content changes are ignored in static mode
  }

  private fun scaleFor(level: QualityLevel): Float = when (level) {
    QualityLevel.LOW -> 0.125f
    else -> 0.25f
  }
}
