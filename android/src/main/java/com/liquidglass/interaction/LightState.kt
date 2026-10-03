package com.liquidglass.interaction

import kotlin.math.cos
import kotlin.math.sin

/**
 * Everything about light for one frame. Filled by LiquidGlassView from:
 * - the `lightAngle` prop (+ device tilt when `motionLighting` is on)
 * - the finger position/strength (TouchLightController)
 * - the press amount (PressAnimator)
 */
internal class LightState {
  /** Unit vector pointing TOWARDS the light, screen space (y grows downward). */
  var dirX = 0.5f
  var dirY = -0.866f

  /** Finger position in glass-local px, and how strongly it glows (0..1). */
  var touchX = 0f
  var touchY = 0f
  var touchStrength = 0f

  /** 0 = released, 1 = fully pressed. */
  var press = 0f

  fun setAngle(degrees: Float) {
    val rad = Math.toRadians(degrees.toDouble())
    dirX = cos(rad).toFloat()
    dirY = sin(rad).toFloat()
  }
}
