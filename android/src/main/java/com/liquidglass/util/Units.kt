package com.liquidglass.util

import android.content.Context

/** dp → px using the device density. All JS lengths arrive in dp. */
internal fun Context.dpToPx(dp: Float): Float = dp * resources.displayMetrics.density

internal fun lerp(a: Float, b: Float, t: Float): Float = a + (b - a) * t

internal fun Float.clamp01(): Float = coerceIn(0f, 1f)

/** Replace NaN / Infinity with a fallback so bad values never reach the GPU. */
internal fun Float.finiteOr(fallback: Float): Float = if (isFinite()) this else fallback
