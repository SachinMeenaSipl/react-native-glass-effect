package com.liquidglass.config

import android.graphics.Color
import com.liquidglass.util.clamp01
import com.liquidglass.util.finiteOr
import com.liquidglass.util.lerp
import kotlin.math.abs

/**
 * Every value a glass view needs, in one immutable object.
 *
 * - The ViewManager writes incoming props into a "pending" copy.
 * - At the end of a prop batch the view commits it (see LiquidGlassView.commitConfig).
 * - GlassConfigTransition animates from the old config to the new one.
 *
 * Lengths are dp (converted to px at draw time). Strengths are 0..1.
 */
data class GlassConfig(
  val blurRadiusDp: Float = 20f,
  val tintColor: Int = Color.WHITE,
  val tintOpacity: Float = 0.12f,
  val refraction: Float = 0.35f,
  val distortion: Float = 0.1f,
  val illumination: Float = 0.5f,
  val lightAngleDeg: Float = -60f,
  val chromaticAberration: Float = 0f,
  val edgeWidthDp: Float = 16f,
  val cornerRadiusDp: Float = 24f,
  val borderWidthDp: Float = 1f,
  val borderOpacity: Float = 0.3f,
  val quality: QualityMode = QualityMode.AUTO,
  val reduceTransparency: Boolean = false,
  val fallbackColor: Int = 0xFFF2F2F7.toInt(),
  val backdropId: String = "",
  val pressed: Boolean = false,
  val interactive: Boolean = false,
  val motionLighting: Boolean = false,
  val transitionDurationMs: Float = 180f,
  val clipContent: Boolean = true,
) {

  /** Clamp everything into a safe range. JS already clamps; this is the native safety net. */
  fun sanitized(): GlassConfig = copy(
    blurRadiusDp = blurRadiusDp.finiteOr(20f).coerceIn(0f, MAX_BLUR_DP),
    tintOpacity = tintOpacity.finiteOr(0.12f).clamp01(),
    refraction = refraction.finiteOr(0f).clamp01(),
    distortion = distortion.finiteOr(0f).clamp01(),
    illumination = illumination.finiteOr(0f).clamp01(),
    lightAngleDeg = lightAngleDeg.finiteOr(-60f),
    chromaticAberration = chromaticAberration.finiteOr(0f).clamp01(),
    edgeWidthDp = edgeWidthDp.finiteOr(16f).coerceIn(0f, 64f),
    cornerRadiusDp = cornerRadiusDp.finiteOr(0f).coerceAtLeast(0f),
    borderWidthDp = borderWidthDp.finiteOr(0f).coerceIn(0f, 8f),
    borderOpacity = borderOpacity.finiteOr(0f).clamp01(),
    transitionDurationMs = transitionDurationMs.finiteOr(180f).coerceIn(0f, 2000f),
  )

  /**
   * Blend the ANIMATABLE fields towards [to]. Non-animatable fields (quality,
   * backdropId, flags...) are taken from [to] immediately.
   */
  fun lerp(to: GlassConfig, t: Float): GlassConfig = to.copy(
    blurRadiusDp = lerp(blurRadiusDp, to.blurRadiusDp, t),
    tintColor = lerpColor(tintColor, to.tintColor, t),
    tintOpacity = lerp(tintOpacity, to.tintOpacity, t),
    refraction = lerp(refraction, to.refraction, t),
    distortion = lerp(distortion, to.distortion, t),
    illumination = lerp(illumination, to.illumination, t),
    lightAngleDeg = lerpAngle(lightAngleDeg, to.lightAngleDeg, t),
    chromaticAberration = lerp(chromaticAberration, to.chromaticAberration, t),
    edgeWidthDp = lerp(edgeWidthDp, to.edgeWidthDp, t),
    cornerRadiusDp = lerp(cornerRadiusDp, to.cornerRadiusDp, t),
    borderWidthDp = lerp(borderWidthDp, to.borderWidthDp, t),
    borderOpacity = lerp(borderOpacity, to.borderOpacity, t),
  )

  /** True when the visible (animatable) values are the same, so no animation is needed. */
  fun looksLike(other: GlassConfig): Boolean =
    copy(quality = other.quality, reduceTransparency = other.reduceTransparency,
      fallbackColor = other.fallbackColor, backdropId = other.backdropId,
      pressed = other.pressed, interactive = other.interactive,
      motionLighting = other.motionLighting,
      transitionDurationMs = other.transitionDurationMs,
      clipContent = other.clipContent) == other

  companion object {
    const val MAX_BLUR_DP = 100f

    /** Per-channel ARGB blend. Pure Kotlin, so config logic is unit-testable off-device. */
    fun lerpColor(from: Int, to: Int, t: Float): Int {
      fun ch(c: Int, shift: Int) = (c ushr shift) and 0xFF
      fun mix(shift: Int) = (ch(from, shift) + (ch(to, shift) - ch(from, shift)) * t).toInt().coerceIn(0, 255)
      return (mix(24) shl 24) or (mix(16) shl 16) or (mix(8) shl 8) or mix(0)
    }

    /** Interpolate angles the short way round (170° → -170° goes through 180°). */
    fun lerpAngle(from: Float, to: Float, t: Float): Float {
      var delta = (to - from) % 360f
      if (delta > 180f) delta -= 360f
      if (delta < -180f) delta += 360f
      return if (abs(delta) < 0.001f) to else from + delta * t
    }
  }
}
