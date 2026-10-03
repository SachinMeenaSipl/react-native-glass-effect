package com.facebook.react.uimanager;
import android.view.View;
public abstract class BaseViewManager<T extends View, C extends LayoutShadowNode> extends ViewManager<T, C> {
  protected T prepareToRecycleView(ThemedReactContext reactContext, T view) { return view; }
  protected void onAfterUpdateTransaction(T view) {}
}
