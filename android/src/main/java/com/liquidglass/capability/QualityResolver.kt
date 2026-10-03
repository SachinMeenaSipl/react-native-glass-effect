package com.liquidglass.capability

import android.content.Context
import com.liquidglass.config.QualityMode

/**
 * Turns quality="auto" into a concrete level. Explicit modes are respected as-is.
 *
 * Auto rules, in order:
 * 1. Start: HIGH on a high-end Android 13+ device, otherwise MEDIUM.
 * 2. Low-RAM device or battery saver on → LOW.
 * 3. More than 6 glass views in the same window → one level down.
 *    More than 12 → LOW.
 */
object QualityResolver {

  const val CROWDED_GLASS_COUNT = 6
  const val VERY_CROWDED_GLASS_COUNT = 12

  fun resolve(
    mode: QualityMode,
    context: Context,
    tier: RendererTier,
    glassCountInWindow: Int,
  ): QualityLevel {
    when (mode) {
      QualityMode.HIGH -> return QualityLevel.HIGH
      QualityMode.MEDIUM -> return QualityLevel.MEDIUM
      QualityMode.LOW -> return QualityLevel.LOW
      QualityMode.STATIC -> return QualityLevel.STATIC
      QualityMode.AUTO -> Unit
    }

    var level =
      if (tier == RendererTier.SHADER && DeviceCapabilities.isHighEnd(context)) QualityLevel.HIGH
      else QualityLevel.MEDIUM

    if (DeviceCapabilities.isLowRamDevice(context) || DeviceCapabilities.isPowerSaveMode(context)) {
      level = QualityLevel.LOW
    }

    level = when {
      glassCountInWindow > VERY_CROWDED_GLASS_COUNT -> QualityLevel.LOW
      glassCountInWindow > CROWDED_GLASS_COUNT -> level.downgrade()
      else -> level
    }
    return level
  }
}
