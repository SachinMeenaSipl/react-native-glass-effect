package com.liquidglass.capability

import android.os.Build

/**
 * The best rendering technique the OS version allows.
 *
 * | Tier    | Android       | What you get                                              |
 * |---------|---------------|-----------------------------------------------------------|
 * | SHADER  | 13+ (API 33)  | GPU blur + AGSL refraction, rim lighting, touch light     |
 * | BLUR    | 12  (API 31)  | GPU blur + canvas-drawn lighting (no refraction)          |
 * | COMPAT  | 7–11 (24–30)  | Downscaled snapshot + CPU StackBlur, throttled            |
 */
enum class RendererTier(val jsName: String) {
  SHADER("shader"),
  BLUR("blur"),
  COMPAT("compat");

  companion object {
    /** Set to true if the AGSL shader failed to compile on this device (driver bug). */
    @Volatile var shaderBroken: Boolean = false

    fun best(): RendererTier = when {
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU && !shaderBroken -> SHADER
      Build.VERSION.SDK_INT >= Build.VERSION_CODES.S -> BLUR
      else -> COMPAT
    }
  }
}
