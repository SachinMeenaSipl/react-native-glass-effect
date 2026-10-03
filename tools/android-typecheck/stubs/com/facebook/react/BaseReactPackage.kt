package com.facebook.react
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfoProvider
import com.facebook.react.uimanager.ViewManager
public abstract class BaseReactPackage : ReactPackage {
  abstract override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule?
  override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<in Nothing, in Nothing>> = emptyList()
  public abstract fun getReactModuleInfoProvider(): ReactModuleInfoProvider
}
