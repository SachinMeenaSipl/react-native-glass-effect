#import "LiquidGlassViewComponentView.h"

#import "LGShaderRenderer.h"

#import <React/RCTConversions.h>
#import <react/renderer/components/RNLiquidGlassSpec/ComponentDescriptors.h>
#import <react/renderer/components/RNLiquidGlassSpec/Props.h>
#import <react/renderer/components/RNLiquidGlassSpec/RCTComponentViewHelpers.h>

using namespace facebook::react;

#if defined(__IPHONE_26_0) && __IPHONE_OS_VERSION_MAX_ALLOWED >= __IPHONE_26_0
#define LG_HAS_GLASS_SDK 1
#else
#define LG_HAS_GLASS_SDK 0
#endif

/**
 * Holds React children ABOVE the glass layers.
 * Returns nil when the touch hits empty space, so the glass view itself becomes
 * the touch target (RN's touch handler only understands component views).
 */
@interface LGChildContainerView : UIView
@end

@implementation LGChildContainerView
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  UIView *hit = [super hitTest:point withEvent:event];
  return hit == self ? nil : hit;
}
@end

@interface LiquidGlassViewComponentView () <RCTLiquidGlassViewViewProtocol>
@end

static NSInteger gLiveGlassViews = 0;

NSInteger LGLiveGlassViewCount(void)
{
  return gLiveGlassViews;
}

@implementation LiquidGlassViewComponentView {
  UIVisualEffectView *_effectView;   // blur / system glass
  UIView *_tintView;                 // pre-iOS 26 tint layer
  CAGradientLayer *_sheenLayer;      // pre-iOS 26 light sheen
  UIView *_fallbackView;             // reduce transparency: opaque colour
  LGChildContainerView *_childContainer;
  BOOL _hasAppliedProps;
  BOOL _countedLive;
  CGFloat _cornerRadius;

  // iosRenderer="shader"
  BOOL _wantsShader;
  BOOL _shaderUnavailable;
  BOOL _warnedNoBackdrop;
  BOOL _forceDraw;
  LGShaderRenderer *_shader;
  UIView *_shaderHost;
  CADisplayLink *_displayLink;
  __weak UIView *_backdrop;
  LGShaderUniforms _uniforms;
  CGFloat _blurPx;
  NSString *_backdropId;
  NSInteger _frameInterval;
  BOOL _staticQuality;
  BOOL _capturedOnce;
  NSUInteger _tick;
  BOOL _touching;
  BOOL _forcePressed;
  BOOL _interactive;
  CGPoint _touchPoint;
  CGFloat _touchStrength;
  CGFloat _press;
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<LiquidGlassViewComponentDescriptor>();
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const LiquidGlassViewProps>();
    _props = defaultProps;

    UIViewAutoresizing fill = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;

    _effectView = [[UIVisualEffectView alloc] initWithEffect:nil];
    _effectView.frame = self.bounds;
    _effectView.autoresizingMask = fill;
    _effectView.userInteractionEnabled = NO;
    _effectView.clipsToBounds = YES;
    _effectView.layer.cornerCurve = kCACornerCurveContinuous;

    _tintView = [[UIView alloc] initWithFrame:self.bounds];
    _tintView.autoresizingMask = fill;
    _tintView.userInteractionEnabled = NO;
    [_effectView.contentView addSubview:_tintView];

    _sheenLayer = [CAGradientLayer layer];
    [_effectView.contentView.layer addSublayer:_sheenLayer];

    _fallbackView = [[UIView alloc] initWithFrame:self.bounds];
    _fallbackView.autoresizingMask = fill;
    _fallbackView.userInteractionEnabled = NO;
    _fallbackView.hidden = YES;
    _fallbackView.layer.cornerCurve = kCACornerCurveContinuous;

    _childContainer = [[LGChildContainerView alloc] initWithFrame:self.bounds];
    _childContainer.autoresizingMask = fill;

    _shaderHost = [[UIView alloc] initWithFrame:self.bounds];
    _shaderHost.autoresizingMask = fill;
    _shaderHost.userInteractionEnabled = NO;
    _shaderHost.hidden = YES;

    [self addSubview:_effectView];
    [self addSubview:_shaderHost];
    [self addSubview:_fallbackView];
    [self addSubview:_childContainer];

    [[NSNotificationCenter defaultCenter] addObserver:self
                                             selector:@selector(accessibilityChanged)
                                                 name:UIAccessibilityReduceTransparencyStatusDidChangeNotification
                                               object:nil];
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

#pragma mark - Children go into the container, above the glass

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [_childContainer insertSubview:childComponentView atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [childComponentView removeFromSuperview];
}

#pragma mark - Props

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
  const auto &p = *std::static_pointer_cast<const LiquidGlassViewProps>(props);
  [super updateProps:props oldProps:oldProps];
  [self applyProps:p];
  _hasAppliedProps = YES;
}

- (void)accessibilityChanged
{
  [self applyProps:*std::static_pointer_cast<const LiquidGlassViewProps>(_props)];
}

- (void)applyProps:(const LiquidGlassViewProps &)p
{
  // Clamped to half the shortest side, like Android's GlassShape (see applyCornerRadius).
  _cornerRadius = MAX(0, p.cornerRadius);
  [self applyCornerRadius];
  const BOOL reduce = p.reduceTransparency || UIAccessibilityIsReduceTransparencyEnabled();

  UIColor *tint = RCTUIColorFromSharedColor(p.tintColor) ?: UIColor.whiteColor;
  UIColor *fallback = RCTUIColorFromSharedColor(p.fallbackColor) ?: [UIColor secondarySystemBackgroundColor];
  const CGFloat tintOpacity = MIN(MAX(p.tintOpacity, 0), 1);

  // Shape
  self.layer.cornerCurve = kCACornerCurveContinuous;
  self.clipsToBounds = p.clipContent;
  _childContainer.clipsToBounds = p.clipContent;
  _childContainer.layer.cornerCurve = kCACornerCurveContinuous;

  // Border (on the effect view, so it never fights RN's own style.border*)
  _effectView.layer.borderWidth = MAX(0, p.glassBorderWidth);
  _effectView.layer.borderColor =
      [UIColor colorWithWhite:1 alpha:MIN(MAX(p.glassBorderOpacity, 0), 1)].CGColor;

  // Reduce transparency → opaque surface
  _fallbackView.backgroundColor = fallback;
  _fallbackView.hidden = !reduce;
  _effectView.hidden = reduce;
  [self updateShaderWithProps:p tint:tint tintOpacity:tintOpacity reduce:reduce];
  if (reduce) {
    return;
  }

  UIVisualEffect *effect = nil;
  BOOL systemGlass = NO;

#if LG_HAS_GLASS_SDK
  if (@available(iOS 26.0, *)) {
    UIGlassEffectStyle style = p.appearance == LiquidGlassViewAppearance::Clear ? UIGlassEffectStyleClear
                                                                                : UIGlassEffectStyleRegular;
    UIGlassEffect *glass = [UIGlassEffect effectWithStyle:style];
    glass.tintColor = tintOpacity > 0 ? [tint colorWithAlphaComponent:tintOpacity] : nil;
    glass.interactive = p.interactive;
    effect = glass;
    systemGlass = YES;
    // Interactive glass must receive touches. RN still resolves the touch to this component
    // (RCTSurfaceTouchHandler walks up superviews), so JS handlers keep working.
    _effectView.userInteractionEnabled = p.interactive;
  }
#endif

  if (!systemGlass) {
    effect = [UIBlurEffect effectWithStyle:[self blurStyleFor:p]];
    _effectView.userInteractionEnabled = NO;
  }

  // Pre-26: we draw tint + sheen ourselves. iOS 26: the system glass does both.
  _tintView.hidden = systemGlass;
  _sheenLayer.hidden = systemGlass;
  if (!systemGlass) {
    _tintView.backgroundColor = [tint colorWithAlphaComponent:tintOpacity];
    [self updateSheenWithAngle:p.lightAngle
                  illumination:MIN(MAX(p.illumination, 0), 1) + (p.pressed ? 0.25 : 0)];
  }

  const BOOL animate = _hasAppliedProps && p.transitionDuration > 0 && !UIAccessibilityIsReduceMotionEnabled();
  if (animate) {
    [UIView animateWithDuration:p.transitionDuration / 1000.0
                     animations:^{
                       self->_effectView.effect = effect;
                     }];
  } else {
    _effectView.effect = effect;
  }
}

/** A radius above half the shortest side makes Core Animation draw a broken shape. */
- (void)applyCornerRadius
{
  const CGSize size = self.bounds.size;
  const CGFloat radius = size.width > 0 && size.height > 0
      ? MIN(_cornerRadius, MIN(size.width, size.height) / 2)
      : _cornerRadius;
  _effectView.layer.cornerRadius = radius;
  _fallbackView.layer.cornerRadius = radius;
  self.layer.cornerRadius = radius;
  _childContainer.layer.cornerRadius = self.clipsToBounds ? radius : 0;
  if (_wantsShader) {
    const CGFloat scale = self.window.screen.scale ?: UIScreen.mainScreen.scale;
    _uniforms.radius = (float)(radius * scale);
    _forceDraw = YES;
  }
}

#pragma mark - iosRenderer="shader"

- (void)updateShaderWithProps:(const LiquidGlassViewProps &)p
                         tint:(UIColor *)tint
                  tintOpacity:(CGFloat)tintOpacity
                       reduce:(BOOL)reduce
{
  _wantsShader = p.iosRenderer == LiquidGlassViewIosRenderer::Shader && !reduce && !_shaderUnavailable;
  if (!_wantsShader) {
    [self stopShader];
    return;
  }
  if (!_shader) {
    _shader = [LGShaderRenderer create];
    if (!_shader) {
      // Same promise as Android: a device limit downgrades the look, it never crashes.
      _shaderUnavailable = YES;
      _wantsShader = NO;
      return;
    }
    [_shaderHost.layer addSublayer:_shader.layer];
  }

  const CGFloat scale = self.window.screen.scale ?: UIScreen.mainScreen.scale;
  const CGFloat rad = p.lightAngle * M_PI / 180.0;
  CGFloat r = 1, g = 1, b = 1, a = 1;
  [tint getRed:&r green:&g blue:&b alpha:&a];
  const CGFloat tintAlpha = a * tintOpacity;

  _shader.layer.contentsScale = scale;
  _blurPx = MAX(p.blurRadius, 0) * scale;
  _uniforms.radius = (float)(MIN(MAX(p.cornerRadius, 0),
                                 MIN(self.bounds.size.width, self.bounds.size.height) / 2) * scale);
  _uniforms.edge = (float)(MAX(p.edgeWidth, 0) * scale);
  _uniforms.refraction = MIN(MAX(p.refraction, 0), 1);
  _uniforms.distortion = MIN(MAX(p.distortion, 0), 1);
  _uniforms.chroma = p.quality == LiquidGlassViewQuality::High || p.quality == LiquidGlassViewQuality::Auto
      ? MIN(MAX(p.chromaticAberration, 0), 1)
      : 0;
  _uniforms.illumination = MIN(MAX(p.illumination, 0), 1);
  _uniforms.lightX = (float)cos(rad);
  _uniforms.lightY = (float)sin(rad);
  _uniforms.tintR = (float)r;
  _uniforms.tintG = (float)g;
  _uniforms.tintB = (float)b;
  _uniforms.tintA = (float)tintAlpha;
  _uniforms.borderWidth = (float)(MAX(p.glassBorderWidth, 0) * scale);
  _uniforms.borderOpacity = MIN(MAX(p.glassBorderOpacity, 0), 1);

  _frameInterval = p.quality == LiquidGlassViewQuality::Low ? 3 : 1;
  _staticQuality = p.quality == LiquidGlassViewQuality::Static;
  _backdropId = [NSString stringWithUTF8String:p.backdropId.c_str()];
  _forcePressed = p.pressed;
  _interactive = p.interactive;
  _backdrop = nil;
  _capturedOnce = NO;
  _forceDraw = YES;
  [self startDisplayLink];
}

- (void)startDisplayLink
{
  if (_displayLink || !self.window || !_wantsShader) {
    return;
  }
  _displayLink = [CADisplayLink displayLinkWithTarget:self selector:@selector(renderFrame)];
  [_displayLink addToRunLoop:NSRunLoop.mainRunLoop forMode:NSRunLoopCommonModes];
}

- (void)stopShader
{
  [_displayLink invalidate];
  _displayLink = nil;
  [_shader releaseResources];
  _shaderHost.hidden = YES;
  _backdrop = nil;
}

/** Depth-first search for <GlassBackdrop>, skipping any backdrop that contains this glass. */
- (UIView *)findBackdropIn:(UIView *)view marker:(NSString *)marker
{
  UIView *found = nil;
  for (UIView *child in view.subviews) {
    if ([child isKindOfClass:RCTViewComponentView.class] &&
        [((RCTViewComponentView *)child).nativeId isEqualToString:marker] &&
        ![self isDescendantOfView:child]) {
      found = child; // the last match is the topmost, like Android's "most recent"
    }
    UIView *nested = [self findBackdropIn:child marker:marker];
    found = nested ?: found;
  }
  return found;
}

- (void)renderFrame
{
  _tick++;
  if (_frameInterval > 1 && _tick % _frameInterval != 0) {
    return;
  }
  UIView *backdrop = _backdrop;
  if (!backdrop) {
    NSString *marker = [@"LiquidGlassBackdrop:" stringByAppendingString:_backdropId ?: @""];
    backdrop = self.window ? [self findBackdropIn:self.window marker:marker] : nil;
    _backdrop = backdrop;
  }
  if (!backdrop) {
    // No backdrop yet, or a setup mistake: stay on system glass and try again next frame.
    if (!_warnedNoBackdrop && _tick > 120) {
      _warnedNoBackdrop = YES;
      NSLog(@"[LiquidGlass] iosRenderer=\"shader\" found no <GlassBackdrop>, using system glass.");
    }
    _shaderHost.hidden = YES;
    _effectView.hidden = NO;
    return;
  }

  const BOOL reduceMotion = UIAccessibilityIsReduceMotionEnabled();
  const CGFloat pressTarget = (_touching || _forcePressed) ? 1 : 0;
  const CGFloat touchTarget = _touching ? 1 : 0;
  const CGFloat oldPress = _press;
  const CGFloat oldTouch = _touchStrength;
  _press += (pressTarget - _press) * 0.25;
  _touchStrength += (touchTarget - _touchStrength) * 0.25;
  if (fabs(pressTarget - _press) < 0.005) {
    _press = pressTarget;
  }
  if (fabs(touchTarget - _touchStrength) < 0.005) {
    _touchStrength = touchTarget;
  }
  const BOOL animating = _press != oldPress || _touchStrength != oldTouch;

  if (_staticQuality && _capturedOnce && !animating && !_forceDraw) {
    return;
  }

  const CGFloat scale = _shader.layer.contentsScale;
  _uniforms.press = (float)_press;
  _uniforms.touchStrength = (float)_touchStrength;
  _uniforms.touchX = (float)(_touchPoint.x * scale);
  _uniforms.touchY = (float)(_touchPoint.y * scale);

  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  _shader.layer.frame = _shaderHost.bounds;
  if (animating) {
    const CGFloat squish = reduceMotion ? 1 : 1 - 0.03 * _press;
    const CATransform3D transform = CATransform3DMakeScale(squish, squish, 1);
    _shaderHost.layer.transform = transform;
    _childContainer.layer.transform = transform;
  }
  [CATransaction commit];

  const BOOL drawn = [_shader drawGlass:self
                               backdrop:backdrop
                               uniforms:_uniforms
                                 blurPx:_blurPx
                                  force:_forceDraw || animating];
  if (drawn) {
    _forceDraw = NO;
    _capturedOnce = YES;
  }
  _shaderHost.hidden = !drawn;
  _effectView.hidden = drawn;
}

- (void)updateTouch:(NSSet<UITouch *> *)touches active:(BOOL)active
{
  if (!_wantsShader || !_interactive) {
    return;
  }
  _touching = active;
  UITouch *touch = touches.anyObject;
  if (active && touch) {
    _touchPoint = [touch locationInView:self];
    _forceDraw = YES;
  }
}

- (void)touchesBegan:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [self updateTouch:touches active:YES];
  [super touchesBegan:touches withEvent:event];
}

- (void)touchesMoved:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [self updateTouch:touches active:YES];
  [super touchesMoved:touches withEvent:event];
}

- (void)touchesEnded:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [self updateTouch:touches active:NO];
  [super touchesEnded:touches withEvent:event];
}

- (void)touchesCancelled:(NSSet<UITouch *> *)touches withEvent:(UIEvent *)event
{
  [self updateTouch:touches active:NO];
  [super touchesCancelled:touches withEvent:event];
}

/** Map the blur radius (dp) onto the closest system material. */
- (UIBlurEffectStyle)blurStyleFor:(const LiquidGlassViewProps &)p
{
  if (p.appearance == LiquidGlassViewAppearance::Clear || p.blurRadius <= 6) {
    return UIBlurEffectStyleSystemUltraThinMaterial;
  }
  if (p.blurRadius <= 14) {
    return UIBlurEffectStyleSystemThinMaterial;
  }
  if (p.blurRadius <= 26) {
    return UIBlurEffectStyleSystemMaterial;
  }
  return UIBlurEffectStyleSystemThickMaterial;
}

- (void)updateSheenWithAngle:(CGFloat)degrees illumination:(CGFloat)illumination
{
  const CGFloat rad = degrees * M_PI / 180.0;
  const CGFloat dx = cos(rad) * 0.5;
  const CGFloat dy = sin(rad) * 0.5;
  _sheenLayer.startPoint = CGPointMake(0.5 + dx, 0.5 + dy); // lit side
  _sheenLayer.endPoint = CGPointMake(0.5 - dx, 0.5 - dy);
  _sheenLayer.colors = @[
    (id)[UIColor colorWithWhite:1 alpha:0.22 * illumination].CGColor,
    (id)[UIColor colorWithWhite:1 alpha:0.04 * illumination].CGColor,
    (id)UIColor.clearColor.CGColor,
  ];
  _sheenLayer.locations = @[ @0, @0.35, @0.5 ];
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [CATransaction begin];
  [CATransaction setDisableActions:YES];
  _sheenLayer.frame = _effectView.contentView.bounds;
  [self applyCornerRadius];
  [CATransaction commit];
}

#pragma mark - Stats

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  if (self.window) {
    _forceDraw = YES;
    [self startDisplayLink];
  } else {
    [_displayLink invalidate];
    _displayLink = nil;
    _backdrop = nil;
  }
  if (self.window && !_countedLive) {
    gLiveGlassViews++;
    _countedLive = YES;
  } else if (!self.window && _countedLive) {
    gLiveGlassViews--;
    _countedLive = NO;
  }
}

#pragma mark - Recycling

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _hasAppliedProps = NO;
  _effectView.effect = nil;
  _wantsShader = NO;
  _touching = NO;
  _press = 0;
  _touchStrength = 0;
  [self stopShader];
}

@end

Class<RCTComponentViewProtocol> LiquidGlassViewCls(void)
{
  return LiquidGlassViewComponentView.class;
}
