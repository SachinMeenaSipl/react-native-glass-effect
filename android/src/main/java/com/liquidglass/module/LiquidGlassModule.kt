package com.liquidglass.module

import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.LifecycleEventListener
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.module.annotations.ReactModule
import com.liquidglass.NativeLiquidGlassModuleSpec
import com.liquidglass.capability.DeviceCapabilities
import com.liquidglass.capability.RendererTier
import com.liquidglass.interaction.MotionLightSource
import com.liquidglass.util.GlassStats

/**
 * TurboModule "LiquidGlassModule".
 *
 * - getCapabilities(): what this device can render (sync, cheap).
 * - Also pauses the shared tilt sensor while the app is in the background.
 *
 * JS uses the mere existence of this module to know native code is linked.
 */
@ReactModule(name = LiquidGlassModule.NAME)
class LiquidGlassModule(private val reactContext: ReactApplicationContext) :
  NativeLiquidGlassModuleSpec(reactContext), LifecycleEventListener {

  override fun getName(): String = NAME

  override fun initialize() {
    super.initialize()
    reactContext.addLifecycleEventListener(this)
  }

  override fun invalidate() {
    reactContext.removeLifecycleEventListener(this)
    super.invalidate()
  }

  override fun getCapabilities(): WritableMap {
    val tier = RendererTier.best()
    return Arguments.createMap().apply {
      putString("platform", "android")
      putDouble("osVersion", android.os.Build.VERSION.SDK_INT.toDouble())
      putString("bestRenderer", tier.jsName)
      putBoolean("supportsBlur", true)
      putBoolean("supportsRefraction", tier == RendererTier.SHADER)
      putBoolean("isLowRamDevice", DeviceCapabilities.isLowRamDevice(reactContext))
      putBoolean("isPowerSaveMode", DeviceCapabilities.isPowerSaveMode(reactContext))
      putBoolean("reduceTransparency", false) // Android has no such system setting.
      putBoolean("reduceMotion", DeviceCapabilities.isReduceMotion(reactContext))
    }
  }

  override fun getStats(): WritableMap = Arguments.createMap().apply {
    putDouble("glassDraws", GlassStats.glassDraws.toDouble())
    putDouble("gpuBlurPasses", GlassStats.gpuBlurPasses.toDouble())
    putDouble("shaderPasses", GlassStats.shaderPasses.toDouble())
    putDouble("compatCaptures", GlassStats.compatCaptures.toDouble())
    putDouble("compatCaptureMs", GlassStats.compatCaptureNanos / 1_000_000.0)
    putDouble("skippedFarChanges", GlassStats.skippedFarChanges.toDouble())
    putDouble("solidDraws", GlassStats.solidDraws.toDouble())
    putDouble("liveGlassViews", GlassStats.liveGlassViews.toDouble())
  }

  override fun resetStats() {
    // Counters are touched on the UI thread; reset there too.
    com.facebook.react.bridge.UiThreadUtil.runOnUiThread { GlassStats.reset() }
  }

  override fun onHostResume() = MotionLightSource.resume()
  override fun onHostPause() = MotionLightSource.pause()
  override fun onHostDestroy() = MotionLightSource.pause()

  companion object {
    const val NAME = "LiquidGlassModule"
  }
}
