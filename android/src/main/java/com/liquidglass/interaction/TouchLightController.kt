package com.liquidglass.interaction

import android.animation.ValueAnimator
import android.view.MotionEvent
import android.view.animation.DecelerateInterpolator

/**
 * "Light follows the finger" for interactive glass.
 *
 * DOWN   → glow fades in at the finger (120 ms)
 * MOVE   → glow follows, smoothed so fast flicks don't look jittery
 * UP/CANCEL → glow fades out (320 ms), staying where the finger left
 *
 * Only OBSERVES touches; it never consumes them, so Pressables, ScrollViews and
 * gesture handlers inside/around the glass behave normally.
 */
internal class TouchLightController(private val onChange: () -> Unit) {

  var x = 0f
    private set
  var y = 0f
    private set
  var strength = 0f
    private set

  private var targetX = 0f
  private var targetY = 0f
  private var fade: ValueAnimator? = null

  fun onTouch(event: MotionEvent, animationsEnabled: Boolean) {
    when (event.actionMasked) {
      MotionEvent.ACTION_DOWN -> {
        targetX = event.x; targetY = event.y
        x = targetX; y = targetY
        fadeTo(1f, 120L, animationsEnabled)
      }
      MotionEvent.ACTION_MOVE -> {
        targetX = event.x; targetY = event.y
        // Simple exponential smoothing: 45% of the way each event.
        x += (targetX - x) * SMOOTHING
        y += (targetY - y) * SMOOTHING
        onChange()
      }
      MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> fadeTo(0f, 320L, animationsEnabled)
    }
  }

  private fun fadeTo(to: Float, durationMs: Long, animate: Boolean) {
    fade?.cancel()
    if (!animate) {
      strength = to
      onChange()
      return
    }
    fade = ValueAnimator.ofFloat(strength, to).apply {
      duration = durationMs
      interpolator = DecelerateInterpolator()
      addUpdateListener {
        strength = it.animatedValue as Float
        onChange()
      }
      start()
    }
  }

  fun reset() {
    fade?.cancel()
    fade = null
    strength = 0f
  }

  private companion object {
    const val SMOOTHING = 0.45f
  }
}
