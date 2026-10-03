package com.facebook.react.views.view
import com.facebook.react.uimanager.ThemedReactContext
public open class ReactViewManager : ReactClippingViewManager<ReactViewGroup>() {
  override fun prepareToRecycleView(reactContext: ThemedReactContext, view: ReactViewGroup): ReactViewGroup? =
    super.prepareToRecycleView(reactContext, view)
  override fun onDropViewInstance(view: ReactViewGroup) { super.onDropViewInstance(view) }
  override fun getName(): String = "RCTView"
  public override fun createViewInstance(context: ThemedReactContext): ReactViewGroup = ReactViewGroup(context)
}
