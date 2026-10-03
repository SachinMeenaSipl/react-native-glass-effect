package com.liquidglass.renderer.paint

import android.graphics.ColorMatrix
import android.graphics.ColorMatrixColorFilter

/**
 * Real glass makes colours behind it look richer ("vibrancy").
 * Every tier applies the same saturation boost so they look alike.
 */
internal object Saturation {
  const val GLASS_SATURATION = 1.35f

  val filter: ColorMatrixColorFilter by lazy {
    ColorMatrixColorFilter(ColorMatrix().apply { setSaturation(GLASS_SATURATION) })
  }
}
