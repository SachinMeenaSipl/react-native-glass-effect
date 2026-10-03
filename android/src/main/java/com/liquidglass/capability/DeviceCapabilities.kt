package com.liquidglass.capability

import android.app.ActivityManager
import android.content.Context
import android.os.Build
import android.os.PowerManager
import android.provider.Settings

/**
 * Facts about the device that decide how much glass it can afford.
 * All reads are cheap system calls; nothing is cached except total RAM.
 */
object DeviceCapabilities {

  private var totalRamBytes: Long = -1

  fun isLowRamDevice(context: Context): Boolean =
    (context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager)?.isLowRamDevice == true

  // isPowerSaveMode() is a cross-process call. With many glass views mounting in a list it
  // was being called per view per mount, so cache it briefly; the battery-saver broadcast
  // (SystemSettingsMonitor) clears the cache immediately when the setting changes.
  private var powerSaveCached = false
  private var powerSaveReadAt = 0L
  private const val POWER_SAVE_TTL_MS = 2000L

  fun isPowerSaveMode(context: Context): Boolean {
    val now = android.os.SystemClock.uptimeMillis()
    if (powerSaveReadAt == 0L || now - powerSaveReadAt > POWER_SAVE_TTL_MS) {
      powerSaveCached =
        (context.getSystemService(Context.POWER_SERVICE) as? PowerManager)?.isPowerSaveMode == true
      powerSaveReadAt = now
    }
    return powerSaveCached
  }

  /** Called when battery saver toggles so the next read is fresh. */
  fun invalidatePowerSaveCache() {
    powerSaveReadAt = 0L
  }

  /** "Remove animations" (developer options / accessibility) sets animator scale to 0. */
  fun isReduceMotion(context: Context): Boolean = try {
    Settings.Global.getFloat(
      context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f
    ) == 0f
  } catch (_: Throwable) {
    false
  }

  fun totalRamGb(context: Context): Float {
    if (totalRamBytes < 0) {
      val am = context.getSystemService(Context.ACTIVITY_SERVICE) as? ActivityManager
      val info = ActivityManager.MemoryInfo()
      am?.getMemoryInfo(info)
      totalRamBytes = info.totalMem
    }
    return totalRamBytes / (1024f * 1024f * 1024f)
  }

  /**
   * Android "media performance class" (API 31+). 0 means the OEM did not declare
   * one, which usually means a mid/low-end device.
   */
  fun performanceClass(): Int =
    if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) Build.VERSION.MEDIA_PERFORMANCE_CLASS else 0

  /** A device we trust with the full shader at HIGH by default. */
  fun isHighEnd(context: Context): Boolean =
    performanceClass() >= Build.VERSION_CODES.S || totalRamGb(context) >= 6f
}
