package com.liquidglass.interaction

import android.animation.ValueAnimator
import android.view.animation.DecelerateInterpolator
import android.view.animation.OvershootInterpolator

/**
 * The press "squish".
 *
 * [amount] goes 0 → 1 quickly on press and springs back past 0 on release
 * (overshoot), which gives the jelly-like settle of Liquid Glass.
 *
 * The view turns [amount] into:
 * - [scale] (only for interactive glass): up to 3.5% smaller, applied to the CANVAS (not View.scaleX), so it never
 *   fights with transforms set from React Native styles or Reanimated;
 * - extra lens magnification and brightness in the shader / painter.
 *
 * With animations disabled it jumps straight to the end value, and the view skips the
 * squish (highlight only), so nothing moves for users who asked for reduced motion.
 */
internal class PressAnimator(private val onChange: () -> Unit) {

  var amount = 0f
    private set

  /** Canvas scale for the squish. Overshoot on release briefly goes above 1 (jelly settle). */
  fun scale(squish: Boolean): Float = if (squish) 1f - MAX_SQUISH * amount else 1f

  private var isPressed = false
  private var anim: ValueAnimator? = null

  fun setPressed(pressed: Boolean, animationsEnabled: Boolean) {
    if (pressed == isPressed) return
    isPressed = pressed
    anim?.cancel()
    val target = if (pressed) 1f else 0f
    if (!animationsEnabled) {
      amount = target
      onChange()
      return
    }
    anim = ValueAnimator.ofFloat(amount, target).apply {
      if (pressed) {
        duration = 110L
        interpolator = DecelerateInterpolator()
      } else {
        duration = 420L
        interpolator = OvershootInterpolator(3f)
      }
      addUpdateListener {
        amount = it.animatedValue as Float
        onChange()
      }
      start()
    }
  }

  fun reset() {
    anim?.cancel()
    anim = null
    amount = 0f
    isPressed = false
  }

  private companion object {
    const val MAX_SQUISH = 0.035f
  }
}
