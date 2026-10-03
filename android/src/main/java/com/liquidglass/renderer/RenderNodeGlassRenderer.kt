package com.liquidglass.renderer

import android.graphics.Canvas
import android.graphics.Paint
import android.graphics.RenderEffect
import android.graphics.RenderNode
import android.graphics.Shader
import android.os.Build
import androidx.annotation.RequiresApi
import com.liquidglass.backdrop.BackdropRegistry
import com.liquidglass.renderer.paint.Saturation
import com.liquidglass.shader.GlassShader
import com.liquidglass.util.GlassStats

/**
 * GPU renderer for Android 12+ (BLUR) and Android 13+ (SHADER).
 *
 * Per frame:
 *
 *   glassNode  (covers frame.sampleRect = glass + padding, clipped to the backdrop)
 *     │  record: translate(-sample.left/top) → undo press squish → backdrop-to-glass matrix
 *     │          → drawRenderNode(backdrop.contentNode)
 *     │  effect: blur (CLAMP at node edges) → saturation → [AGSL refraction + lighting]
 *     ▼
 *   canvas: clip to rounded shape → translate(sample.left/top) → drawRenderNode(glassNode)
 *
 * No pixels are read back to the CPU at any point. The heavy work (blur, shader)
 * runs on the RenderThread / GPU.
 *
 * If the canvas is NOT hardware accelerated (e.g. react-native-view-shot drawing
 * into a Bitmap), RenderNodes cannot be drawn, so this delegates to a compat
 * renderer for that draw. Screenshots therefore still contain believable glass.
 */
@RequiresApi(Build.VERSION_CODES.S)
internal class RenderNodeGlassRenderer(useShader: Boolean) : GlassRenderer {

  private val shader: GlassShader? =
    if (useShader && Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) GlassShader.createOrNull() else null

  override val kind: RendererKind = if (shader != null) RendererKind.SHADER else RendererKind.BLUR

  private val glassNode = RenderNode("LiquidGlass")
  private val solidPaint = Paint(Paint.ANTI_ALIAS_FLAG)
  private var softwareFallback: CompatGlassRenderer? = null

  private var baseEffect: RenderEffect? = null
  private var baseEffectBlur = -1f
  private var lastShaderEffect: RenderEffect? = null
  private var lastBaseEffect: RenderEffect? = null
  private var appliedEffect: RenderEffect? = null

  override fun draw(canvas: Canvas, frame: GlassFrame): Boolean {
    val backdrop = frame.backdrop
    if (backdrop == null || !frame.hasGeometry) {
      SolidGlassRenderer.drawSolid(canvas, frame, solidPaint)
      return false
    }

    if (!canvas.isHardwareAccelerated) {
      val fallback = softwareFallback ?: CompatGlassRenderer(static = false).also { softwareFallback = it }
      return fallback.draw(canvas, frame)
    }

    if (!backdrop.hasRecordedContent()) {
      // First frame after binding: the backdrop records on its next draw.
      SolidGlassRenderer.drawSolid(canvas, frame, solidPaint)
      when {
        // A 0-sized backdrop never records; asking again would redraw forever.
        backdrop.width <= 0 || backdrop.height <= 0 -> Unit
        !backdrop.isRecordingEnabled -> BackdropRegistry.updateRecordingFlags()
        else -> backdrop.invalidate()
      }
      return false
    }

    val w = frame.width
    val h = frame.height
    val sample = frame.sampleRect
    val originX = sample.left
    val originY = sample.top
    val nodeW = sample.width().toInt()
    val nodeH = sample.height().toInt()
    if (nodeW <= 0 || nodeH <= 0) {
      SolidGlassRenderer.drawSolid(canvas, frame, solidPaint)
      return false
    }

    // ---- record the backdrop, lined up with the glass --------------------------------
    glassNode.setPosition(0, 0, nodeW, nodeH)
    val rc = glassNode.beginRecording(nodeW, nodeH)
    try {
      rc.translate(-originX, -originY)
      val s = frame.contentScale
      if (s != 1f && s > 0f) {
        // The view is squished around its centre while pressed; undo it here so the
        // world behind the glass stays still and only the glass itself moves.
        rc.scale(1f / s, 1f / s, w / 2f, h / 2f)
      }
      rc.concat(frame.backdropToGlass)
      rc.drawRenderNode(backdrop.contentNode())
    } finally {
      glassNode.endRecording()
    }
    glassNode.setAlpha(backdrop.alpha)

    // ---- effects -----------------------------------------------------------------------
    val base = baseEffect(frame.blurPx)
    val shaderEffect = shader?.effectFor(frame, originX, originY)
    if (shaderEffect !== lastShaderEffect || base !== lastBaseEffect || appliedEffect == null) {
      // Only rebuild + re-apply when an input changed (touch move, prop change...).
      appliedEffect = shaderEffect?.let { RenderEffect.createChainEffect(it, base) } ?: base
      lastShaderEffect = shaderEffect
      lastBaseEffect = base
      glassNode.setRenderEffect(appliedEffect)
    }

    // ---- composite -------------------------------------------------------------------
    canvas.save()
    canvas.clipPath(frame.shape.path)
    canvas.translate(originX, originY)
    canvas.drawRenderNode(glassNode)
    canvas.restore()
    GlassStats.gpuBlurPasses++
    if (shader != null) GlassStats.shaderPasses++

    return shader != null
  }

  /** blur → saturation. Rebuilt only when the blur radius changes. */
  private fun baseEffect(blurPx: Float): RenderEffect {
    val cached = baseEffect
    if (cached != null && blurPx == baseEffectBlur) return cached
    val saturate = RenderEffect.createColorFilterEffect(Saturation.filter)
    val effect = if (blurPx >= 0.5f) {
      RenderEffect.createChainEffect(
        saturate,
        RenderEffect.createBlurEffect(blurPx, blurPx, Shader.TileMode.CLAMP)
      )
    } else {
      saturate
    }
    baseEffect = effect
    baseEffectBlur = blurPx
    return effect
  }

  override fun release() {
    glassNode.discardDisplayList()
    glassNode.setRenderEffect(null)
    baseEffect = null
    baseEffectBlur = -1f
    lastShaderEffect = null
    lastBaseEffect = null
    appliedEffect = null
    softwareFallback?.release()
    softwareFallback = null
  }
}
