package com.facebook.react.bridge;
import android.content.Context; import android.content.ContextWrapper;
public class ReactContext extends ContextWrapper {
  public ReactContext(Context base) { super(base); }
  public void addLifecycleEventListener(LifecycleEventListener l) {}
  public void removeLifecycleEventListener(LifecycleEventListener l) {}
}
