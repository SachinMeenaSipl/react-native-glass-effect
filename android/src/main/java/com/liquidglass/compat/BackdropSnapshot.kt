package com.liquidglass.compat

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Matrix
import android.graphics.Paint
import android.graphics.RectF
import android.os.SystemClock
import android.view.View
import com.liquidglass.renderer.GlassFrame
import com.liquidglass.util.GlassLog
import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.max
import kotlin.math.roundToInt

/**
 * A small, blurred picture of what is behind the glass (compat tier).
 *
 * capture():
 *   1. make a bitmap at 1/4 (or 1/8) of (glass + padding)
 *   2. draw the backdrop VIEW into it with the same backdrop→glass matrix the GPU tier uses
 *   3. StackBlur it (radius scaled down by the same factor)
 *
 * draw():
 *   stretch the bitmap back over (glass + padding), clipped to the rounded shape,
 *   with bilinear filtering (which also adds free extra blur).
 *
 * MOVING GLASS: if the glass (or backdrop) only TRANSLATED since the capture, draw() shifts
 * the bitmap by that delta, so it stays perfectly aligned every frame without re-capturing.
 * [needsRecapture] asks for a new capture only when the shift would run past the padding,
 * or when scale/rotation changed.
 *
 * PRESS SQUISH is compensated at draw time (not baked into the capture), so it is exact
 * on every frame of the spring animation.
 *
 * KNOWN LIMITS (documented for users):
 * - Hardware bitmaps (Glide/Coil `Bitmap.Config.HARDWARE`) cannot be drawn into a software
 *   canvas → capture fails → we stay on the solid fallback and retry every few seconds.
 * - SurfaceView / TextureView content (video, maps, camera) is not captured on this tier.
 */
internal class BackdropSnapshot {

  private var bitmap: Bitmap? = null
  private val canvas = Canvas()
  private val blur = StackBlur()
  private val dst = RectF()
  private var padPx = 0
  private var failedAtMs = 0L
  private val capturedMatrix = Matrix()
  private val capturedRect = RectF()
  private val shifted = RectF()
  private val needed = RectF()
  private val a = FloatArray(9)
  private val b = FloatArray(9)

  /** True while a recent capture failed; retried after [RETRY_MS]. */
  val isFailing: Boolean
    get() = failedAtMs != 0L && SystemClock.uptimeMillis() - failedAtMs < RETRY_MS

  val hasContent: Boolean get() = bitmap != null && failedAtMs == 0L

  fun capture(backdrop: View, frame: GlassFrame, scale: Float): Boolean {
    // Capture only frame.sampleRect (glass + padding, clipped to the backdrop), so the blur
    // clamps at real content instead of fading into empty pixels at the screen edge.
    val sample = frame.sampleRect
    val fullW = sample.width().toInt()
    val fullH = sample.height().toInt()
    if (fullW <= 0 || fullH <= 0) return false

    val bw = max(1, ceil(fullW * scale).toInt())
    val bh = max(1, ceil(fullH * scale).toInt())
    val bmp = bitmap?.takeIf { it.width == bw && it.height == bh && !it.isRecycled }
      ?: try {
        bitmap?.recycle()
        Bitmap.createBitmap(bw, bh, Bitmap.Config.ARGB_8888).also { bitmap = it }
      } catch (oom: OutOfMemoryError) {
        GlassLog.warnOnce("oom", "Out of memory creating the glass snapshot; using solid fallback.", oom)
        bitmap = null
        failedAtMs = SystemClock.uptimeMillis()
        return false
      }

    bmp.eraseColor(0)
    canvas.setBitmap(bmp)
    val save = canvas.save()
    try {
      canvas.scale(bw / fullW.toFloat(), bh / fullH.toFloat())
      canvas.translate(-sample.left, -sample.top)
      canvas.concat(frame.backdropToGlass)
      backdrop.draw(canvas)
    } catch (t: Throwable) {
      // Typically: "Software rendering doesn't support hardware bitmaps".
      GlassLog.warnOnce(
        "snapshot",
        "Could not capture the backdrop on this Android version (often caused by HARDWARE " +
          "bitmaps from Glide/Coil). Glass shows a solid fallback. " +
          "See docs/user-guide/10-troubleshooting.md",
        t
      )
      failedAtMs = SystemClock.uptimeMillis()
      return false
    } finally {
      canvas.restoreToCount(save)
      canvas.setBitmap(null)
    }

    blur.blur(bmp, (frame.blurPx * scale).roundToInt())
    padPx = frame.padPx
    capturedRect.set(sample)
    capturedMatrix.set(frame.backdropToGlass)
    failedAtMs = 0L
    return true
  }

  /**
   * True when shifting the old snapshot is no longer good enough:
   * scale/rotation changed, or the glass moved more than half the padding.
   */
  fun needsRecapture(frame: GlassFrame): Boolean {
    capturedMatrix.getValues(a)
    frame.backdropToGlass.getValues(b)
    for (i in intArrayOf(Matrix.MSCALE_X, Matrix.MSKEW_X, Matrix.MSKEW_Y, Matrix.MSCALE_Y)) {
      if (abs(a[i] - b[i]) > 0.001f) return true
    }
    val dx = b[Matrix.MTRANS_X] - a[Matrix.MTRANS_X]
    val dy = b[Matrix.MTRANS_Y] - a[Matrix.MTRANS_Y]
    val limit = padPx * 0.5f
    if (abs(dx) > limit || abs(dy) > limit) return true
    // The shifted snapshot must still cover the visible glass (where backdrop exists).
    shifted.set(capturedRect)
    shifted.offset(dx, dy)
    needed.set(0f, 0f, frame.width.toFloat(), frame.height.toFloat())
    if (!needed.intersect(frame.sampleRect)) return false
    return !shifted.contains(needed)
  }

  fun draw(target: Canvas, frame: GlassFrame, paint: Paint) {
    val bmp = bitmap ?: return
    // How far the backdrop moved relative to the glass since the capture.
    capturedMatrix.getValues(a)
    frame.backdropToGlass.getValues(b)
    val dx = b[Matrix.MTRANS_X] - a[Matrix.MTRANS_X]
    val dy = b[Matrix.MTRANS_Y] - a[Matrix.MTRANS_Y]
    dst.set(capturedRect)
    dst.offset(dx, dy)
    target.save()
    target.clipPath(frame.shape.path)
    val s = frame.contentScale
    if (s != 1f && s > 0f) {
      // The view squishes the canvas while pressed; undo it so the world stays still.
      target.scale(1f / s, 1f / s, frame.width / 2f, frame.height / 2f)
    }
    target.drawBitmap(bmp, null, dst, paint)
    target.restore()
  }

  fun release() {
    bitmap?.recycle()
    bitmap = null
    blur.release()
    failedAtMs = 0L
  }

  private companion object {
    const val RETRY_MS = 3000L
  }
}
