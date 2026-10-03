package com.liquidglass.config

import android.animation.ValueAnimator
import android.view.animation.PathInterpolator

/**
 * Smoothly animates between configs when props change
 * (e.g. material "thin" → "thick", or blur 10 → 30).
 *
 * - Interrupting an animation starts the next one from the CURRENT mid-state,
 *   so rapid prop changes never jump.
 * - Snaps instantly when: first commit, duration 0, not attached, or the
 *   system "remove animations" setting is on.
 */
internal class GlassConfigTransition(private val onFrame: () -> Unit) {

  var current: GlassConfig = GlassConfig()
    private set

  var target: GlassConfig = GlassConfig()
    private set

  private var from: GlassConfig = current
  private var animator: ValueAnimator? = null
  private var hasCommitted = false

  val isRunning: Boolean get() = animator?.isRunning == true

  fun animateTo(next: GlassConfig, allowAnimation: Boolean) {
    target = next
    val shouldAnimate = allowAnimation && hasCommitted &&
      next.transitionDurationMs > 0f && !current.looksLike(next)
    hasCommitted = true

    animator?.cancel()
    animator = null

    if (!shouldAnimate) {
      current = next
      onFrame()
      return
    }

    from = current
    animator = ValueAnimator.ofFloat(0f, 1f).apply {
      duration = next.transitionDurationMs.toLong()
      interpolator = EASE
      addUpdateListener {
        current = from.lerp(target, it.animatedValue as Float)
        onFrame()
      }
      start()
    }
  }

  /** Stop animating and jump to the target (used on detach). */
  fun finish() {
    animator?.cancel()
    animator = null
    current = target
  }

  /** Forget everything (view recycling). */
  fun reset() {
    animator?.cancel()
    animator = null
    current = GlassConfig()
    target = current
    hasCommitted = false
  }

  private companion object {
    /** Material "standard" easing. */
    val EASE = PathInterpolator(0.2f, 0f, 0f, 1f)
  }
}
