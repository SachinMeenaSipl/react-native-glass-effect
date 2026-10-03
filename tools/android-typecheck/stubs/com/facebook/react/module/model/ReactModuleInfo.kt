package com.facebook.react.module.model
public class ReactModuleInfo(
  @get:JvmName("name") public val name: String,
  @get:JvmName("className") public val className: String,
  @get:JvmName("canOverrideExistingModule") public val canOverrideExistingModule: Boolean,
  @get:JvmName("needsEagerInit") public val needsEagerInit: Boolean,
  public val isCxxModule: Boolean,
  public val isTurboModule: Boolean,
)
