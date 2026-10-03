package com.liquidglass.backdrop

import com.facebook.react.uimanager.ThemedReactContext
import com.facebook.react.uimanager.annotations.ReactProp
import com.facebook.react.views.view.ReactViewGroup
import com.facebook.react.views.view.ReactViewManager

/**
 * ViewManager for <GlassBackdrop>.
 *
 * Extends ReactViewManager (not ViewGroupManager) so the backdrop supports every
 * normal <View> prop: backgroundColor, borderRadius, overflow, pointerEvents...
 * Props are applied through @ReactProp reflection (no codegen delegate on purpose,
 * because codegen delegates would drop the inherited View props).
 */
class GlassBackdropManager : ReactViewManager() {

  override fun getName(): String = NAME

  override fun createViewInstance(context: ThemedReactContext): ReactViewGroup =
    GlassBackdropView(context)

  @ReactProp(name = "backdropId")
  fun setBackdropId(view: ReactViewGroup, value: String?) {
    (view as? GlassBackdropView)?.backdropId = value ?: ""
  }

  override fun prepareToRecycleView(
    reactContext: ThemedReactContext,
    view: ReactViewGroup,
  ): ReactViewGroup? {
    (view as? GlassBackdropView)?.backdropId = ""
    return super.prepareToRecycleView(reactContext, view)
  }

  companion object {
    const val NAME = "GlassBackdrop"
  }
}
