package com.facebook.react.uimanager;
import android.view.View;
public abstract class ViewManager<T extends View, C extends ReactShadowNode> {
  public abstract String getName();
  protected abstract T createViewInstance(ThemedReactContext reactContext);
  protected abstract T prepareToRecycleView(ThemedReactContext reactContext, T view);
  protected void onAfterUpdateTransaction(T view) {}
  public void onDropViewInstance(T view) {}
}
