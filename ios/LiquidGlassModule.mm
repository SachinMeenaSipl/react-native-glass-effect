#import "LiquidGlassModule.h"
#import "LiquidGlassViewComponentView.h"
#import <UIKit/UIKit.h>

@implementation LiquidGlassModule

RCT_EXPORT_MODULE(LiquidGlassModule)

+ (BOOL)requiresMainQueueSetup
{
  return NO;
}

- (NSDictionary *)getCapabilities
{
  NSInteger major = [[NSProcessInfo processInfo] operatingSystemVersion].majorVersion;
  BOOL systemGlass = NO;
#if defined(__IPHONE_26_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
  if (@available(iOS 26.0, *)) {
    systemGlass = YES;
  }
#endif
  return @{
    @"platform" : @"ios",
    @"osVersion" : @(major),
    @"bestRenderer" : systemGlass ? @"system-glass" : @"system-material",
    @"supportsBlur" : @YES,
    @"supportsRefraction" : @(systemGlass),
    @"isLowRamDevice" : @NO,
    @"isPowerSaveMode" : @([[NSProcessInfo processInfo] isLowPowerModeEnabled]),
    @"reduceTransparency" : @(UIAccessibilityIsReduceTransparencyEnabled()),
    @"reduceMotion" : @(UIAccessibilityIsReduceMotionEnabled()),
  };
}

/** UIKit renders iOS glass, so only the live view count is observable. */
- (NSDictionary *)getStats
{
  __block NSInteger live = 0;
  if ([NSThread isMainThread]) {
    live = LGLiveGlassViewCount();
  } else {
    dispatch_sync(dispatch_get_main_queue(), ^{
      live = LGLiveGlassViewCount();
    });
  }
  return @{
    @"glassDraws" : @0,
    @"gpuBlurPasses" : @0,
    @"shaderPasses" : @0,
    @"compatCaptures" : @0,
    @"compatCaptureMs" : @0,
    @"skippedFarChanges" : @0,
    @"solidDraws" : @0,
    @"liveGlassViews" : @(live),
  };
}

- (void)resetStats
{
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeLiquidGlassModuleSpecJSI>(params);
}

@end
