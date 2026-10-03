package com.liquidglass.capability

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.os.Build
import android.os.PowerManager

/**
 * Watches battery saver while at least one glass view is on screen and tells
 * listeners to re-pick their quality. Registered lazily, released when the last
 * listener leaves, so an app with no glass pays nothing.
 */
internal object SystemSettingsMonitor {

  private val listeners = LinkedHashSet<() -> Unit>()
  private var receiver: BroadcastReceiver? = null
  private var appContext: Context? = null

  fun add(context: Context, listener: () -> Unit) {
    listeners.add(listener)
    if (receiver == null) register(context.applicationContext)
  }

  fun remove(listener: () -> Unit) {
    listeners.remove(listener)
    if (listeners.isEmpty()) unregister()
  }

  private fun register(context: Context) {
    val r = object : BroadcastReceiver() {
      override fun onReceive(c: Context?, intent: Intent?) {
        DeviceCapabilities.invalidatePowerSaveCache()
        listeners.toList().forEach { it() }
      }
    }
    val filter = IntentFilter(PowerManager.ACTION_POWER_SAVE_MODE_CHANGED)
    try {
      if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.TIRAMISU) {
        context.registerReceiver(r, filter, Context.RECEIVER_NOT_EXPORTED)
      } else {
        context.registerReceiver(r, filter)
      }
      receiver = r
      appContext = context
    } catch (_: Throwable) {
      // Some OEM builds reject registration in odd states. Glass still works;
      // it just won't react to battery saver until the next remount.
    }
  }

  private fun unregister() {
    val r = receiver ?: return
    try {
      appContext?.unregisterReceiver(r)
    } catch (_: Throwable) {
    }
    receiver = null
    appContext = null
  }
}
