package com.facebook.react.uimanager;
public enum PointerEvents { NONE, BOX_NONE, BOX_ONLY, AUTO;
  public static boolean canBeTouchTarget(PointerEvents p) { return p == AUTO || p == BOX_ONLY; } }
