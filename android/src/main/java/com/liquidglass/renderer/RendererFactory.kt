package com.liquidglass.renderer

import android.os.Build
import com.liquidglass.capability.QualityLevel
import com.liquidglass.capability.RendererTier
import com.liquidglass.config.GlassConfig

/**
 * The single decision point for "which renderer draws this glass?".
 *
 * | Condition (first match wins)                  | Renderer       |
 * |-----------------------------------------------|----------------|
 * | reduceTransparency                            | SOLID          |
 * | no backdrop to sample                         | SOLID          |
 * | quality = static                              | COMPAT_STATIC  |
 * | window not hardware accelerated               | COMPAT_LIVE    |
 * | Android 13+, shader OK, level HIGH or MEDIUM  | SHADER         |
 * | Android 12+                                   | BLUR           |
 * | otherwise (Android 7–11)                      | COMPAT_LIVE    |
 */
internal object RendererFactory {

  fun choose(
    config: GlassConfig,
    level: QualityLevel,
    hasBackdrop: Boolean,
    hardwareAccelerated: Boolean,
  ): RendererKind {
    if (config.reduceTransparency) return RendererKind.SOLID
    if (!hasBackdrop) return RendererKind.SOLID
    if (level == QualityLevel.STATIC) return RendererKind.COMPAT_STATIC
    if (!hardwareAccelerated) return RendererKind.COMPAT_LIVE
    val tier = RendererTier.best()
    return when {
      tier == RendererTier.SHADER && (level == QualityLevel.HIGH || level == QualityLevel.MEDIUM) ->
        RendererKind.SHADER
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> RendererKind.BLUR
      else -> RendererKind.COMPAT_LIVE
    }
  }

  fun create(kind: RendererKind): GlassRenderer = when (kind) {
    RendererKind.SHADER ->
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) RenderNodeGlassRenderer(useShader = true)
      else CompatGlassRenderer(static = false)
    RendererKind.BLUR ->
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) RenderNodeGlassRenderer(useShader = false)
      else CompatGlassRenderer(static = false)
    RendererKind.COMPAT_LIVE -> CompatGlassRenderer(static = false)
    RendererKind.COMPAT_STATIC -> CompatGlassRenderer(static = true)
    RendererKind.SOLID -> SolidGlassRenderer()
  }
}
