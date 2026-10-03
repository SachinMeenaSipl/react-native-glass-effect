package com.facebook.react
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager
public interface ReactPackage {
  public fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> = emptyList()
  public fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<in Nothing, in Nothing>>
  public fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? = null
}
