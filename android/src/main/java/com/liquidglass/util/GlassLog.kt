package com.liquidglass.util

import android.util.Log

/**
 * Logging with one tag ("LiquidGlass") so developers can `adb logcat -s LiquidGlass`.
 * `warnOnce` keeps setup mistakes visible without spamming every frame.
 */
internal object GlassLog {
  private const val TAG = "LiquidGlass"
  private val warned = HashSet<String>()

  fun d(message: String) {
    if (Log.isLoggable(TAG, Log.DEBUG)) Log.d(TAG, message)
  }

  fun w(message: String, error: Throwable? = null) {
    Log.w(TAG, message, error)
  }

  fun warnOnce(key: String, message: String, error: Throwable? = null) {
    if (warned.add(key)) Log.w(TAG, message, error)
  }
}
