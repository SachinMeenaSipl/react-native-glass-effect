package com.facebook.react.uimanager.annotations;
import java.lang.annotation.*;
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.METHOD)
public @interface ReactProp { String name(); String customType() default "__default_type__";
  double defaultDouble() default 0.0; float defaultFloat() default 0.0f; int defaultInt() default 0;
  long defaultLong() default 0L; boolean defaultBoolean() default false; }
