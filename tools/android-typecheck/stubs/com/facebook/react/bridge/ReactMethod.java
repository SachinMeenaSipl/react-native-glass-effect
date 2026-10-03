package com.facebook.react.bridge;
import java.lang.annotation.*;
@Retention(RetentionPolicy.RUNTIME) @Target(ElementType.METHOD)
public @interface ReactMethod { boolean isBlockingSynchronousMethod() default false; }
