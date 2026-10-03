package com.liquidglass.shader

import android.graphics.RenderEffect
import android.graphics.RuntimeShader
import android.os.Build
import androidx.annotation.RequiresApi
import com.liquidglass.capability.QualityLevel
import com.liquidglass.capability.RendererTier
import com.liquidglass.renderer.GlassFrame
import com.liquidglass.util.GlassLog

/**
 * One compiled AGSL program + its uniforms, owned by one glass view.
 *
 * [createOrNull] never throws: if the GPU driver rejects the program, it marks the
 * shader tier as broken for the whole process, and every glass view drops to the
 * BLUR tier instead of crashing the app.
 */
@RequiresApi(Build.VERSION_CODES.TIRAMISU)
internal class GlassShader private constructor(private val shader: RuntimeShader) {

  private val last = FloatArray(UNIFORM_COUNT) { Float.NaN }
  private val next = FloatArray(UNIFORM_COUNT)
  private var effect: RenderEffect? = null

  /**
   * Push this frame's values into the shader.
   * @return the RenderEffect to chain after the blur. Reused when nothing changed.
   */
  fun effectFor(frame: GlassFrame, originX: Float, originY: Float): RenderEffect {
    val cfg = frame.config
    val light = frame.light
    next[0] = frame.width.toFloat()
    next[1] = frame.height.toFloat()
    next[2] = originX
    next[3] = originY
    next[4] = frame.shape.radius
    next[5] = frame.edgePx
    next[6] = cfg.refraction
    next[7] = cfg.distortion
    next[8] = if (frame.level == QualityLevel.HIGH) cfg.chromaticAberration else 0f
    next[9] = cfg.illumination
    next[10] = light.dirX
    next[11] = light.dirY
    next[12] = light.touchX
    next[13] = light.touchY
    next[14] = light.touchStrength
    next[15] = light.press

    val cached = effect
    if (cached != null && next.contentEquals(last)) return cached

    shader.setFloatUniform("uSize", next[0], next[1])
    shader.setFloatUniform("uOrigin", next[2], next[3])
    shader.setFloatUniform("uRadius", next[4])
    shader.setFloatUniform("uEdge", next[5])
    shader.setFloatUniform("uRefraction", next[6])
    shader.setFloatUniform("uDistortion", next[7])
    shader.setFloatUniform("uChroma", next[8])
    shader.setFloatUniform("uIllumination", next[9])
    shader.setFloatUniform("uLightDir", next[10], next[11])
    shader.setFloatUniform("uTouch", next[12], next[13], next[14])
    shader.setFloatUniform("uPress", next[15])
    next.copyInto(last)

    // Uniform values are captured when the effect is created, so build a new one.
    return RenderEffect.createRuntimeShaderEffect(shader, GlassShaderSource.CONTENT)
      .also { effect = it }
  }

  companion object {
    private const val UNIFORM_COUNT = 16

    fun createOrNull(): GlassShader? {
      if (RendererTier.shaderBroken) return null
      return try {
        GlassShader(RuntimeShader(GlassShaderSource.AGSL))
      } catch (t: Throwable) {
        RendererTier.shaderBroken = true
        GlassLog.warnOnce(
          "shader",
          "Glass shader failed to compile on this GPU; falling back to blur-only rendering.",
          t
        )
        null
      }
    }
  }
}
