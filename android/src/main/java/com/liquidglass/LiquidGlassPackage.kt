package com.liquidglass

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
import com.liquidglass.backdrop.GlassBackdropManager
import com.liquidglass.module.LiquidGlassModule
import com.liquidglass.view.LiquidGlassViewManager

/**
 * Entry point found by autolinking. Registers:
 * - TurboModule  LiquidGlassModule
 * - Views        LiquidGlassView, GlassBackdrop
 */
class LiquidGlassPackage : BaseReactPackage() {

  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? =
    if (name == LiquidGlassModule.NAME) LiquidGlassModule(reactContext) else null

  override fun getReactModuleInfoProvider(): ReactModuleInfoProvider = ReactModuleInfoProvider {
    mapOf(
      LiquidGlassModule.NAME to ReactModuleInfo(
        LiquidGlassModule.NAME,
        LiquidGlassModule.NAME,
        false, // canOverrideExistingModule
        false, // needsEagerInit
        false, // isCxxModule
        true, // isTurboModule
      )
    )
  }

  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> =
    listOf(LiquidGlassViewManager(), GlassBackdropManager())
}
