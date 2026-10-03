package com.facebook.react.bridge;
public abstract class ReactContextBaseJavaModule extends BaseJavaModule {
  public ReactContextBaseJavaModule(ReactApplicationContext c) {}
  protected final ReactApplicationContext getReactApplicationContext() { return null; } }
