#import "LGShaderRenderer.h"

#import <Metal/Metal.h>
#import <MetalPerformanceShaders/MetalPerformanceShaders.h>

// Compiled at runtime so the library ships no .metallib and needs no build step.
static NSString *const kLGShaderSource = @R"METAL(
#include <metal_stdlib>
using namespace metal;

struct U {
  float sizeX, sizeY, originX, originY, captureX, captureY;
  float radius, edge, refraction, distortion, chroma, illumination;
  float lightX, lightY, touchX, touchY, touchStrength, press;
  float tintR, tintG, tintB, tintA, borderWidth, borderOpacity;
};

vertex float4 lgVertex(uint id [[vertex_id]]) {
  float2 p = float2((id << 1) & 2, id & 2);
  return float4(p * 2.0 - 1.0, 0.0, 1.0);
}

static float sdRoundRect(float2 p, float2 halfSize, float r) {
  float2 q = abs(p) - halfSize + float2(r, r);
  return length(max(q, float2(0.0))) + min(max(q.x, q.y), 0.0) - r;
}

// Same weights and strength as Android's ColorMatrix.setSaturation(1.35).
static float4 sampleAt(texture2d<float> tex, sampler s, float2 pos, float2 capture) {
  float4 c = tex.sample(s, pos / capture);
  const float sat = 1.35;
  float l = dot(c.rgb, float3(0.213, 0.715, 0.072));
  c.rgb = clamp(mix(float3(l), c.rgb, sat), 0.0, c.a);
  return c;
}

fragment float4 lgFragment(float4 position [[position]],
                           constant U &u [[buffer(0)]],
                           texture2d<float> content [[texture(0)]]) {
  constexpr sampler s(address::clamp_to_edge, filter::linear);
  float2 size = float2(u.sizeX, u.sizeY);
  float2 origin = float2(u.originX, u.originY);
  float2 capture = float2(u.captureX, u.captureY);
  float2 lightDir = float2(u.lightX, u.lightY);
  float2 halfSize = size * 0.5;
  float2 local = position.xy;
  float2 p = local - halfSize;

  // 1. shape
  float d = sdRoundRect(p, halfSize, u.radius);
  float cover = 1.0 - smoothstep(-0.5, 0.5, d);
  if (cover <= 0.0) {
    discard_fragment();
  }

  // 2. rim
  float edgeW = max(u.edge, 1.0);
  float depth = clamp(-d / edgeW, 0.0, 1.0);
  float rim = 1.0 - depth;
  float bend = rim * rim * (3.0 - 2.0 * rim);

  // 3. outward normal
  float2 ex = float2(1.0, 0.0);
  float2 ey = float2(0.0, 1.0);
  float2 grad = float2(
    sdRoundRect(p + ex, halfSize, u.radius) - sdRoundRect(p - ex, halfSize, u.radius),
    sdRoundRect(p + ey, halfSize, u.radius) - sdRoundRect(p - ey, halfSize, u.radius));
  float gl = length(grad);
  float2 n = gl > 0.0001 ? grad / gl : float2(0.0);

  // 4. lens + 5. refraction
  float mag = 1.0 - u.distortion * 0.12 - u.press * 0.025;
  float2 bent = p * mag - n * bend * u.refraction * edgeW;
  float2 samplePos = bent + halfSize - origin;

  // 6. optional RGB split
  float4 color;
  if (u.chroma > 0.001) {
    float2 split = n * bend * u.chroma * 4.0;
    float4 mid = sampleAt(content, s, samplePos, capture);
    color = float4(sampleAt(content, s, samplePos - split, capture).r, mid.g,
                   sampleAt(content, s, samplePos + split, capture).b, mid.a);
  } else {
    color = sampleAt(content, s, samplePos, capture);
  }

  // 7. light
  float facing = max(dot(n, lightDir), 0.0);
  float spec = facing * facing * bend * u.illumination * 0.55;
  float back = pow(max(dot(n, -lightDir), 0.0), 3.0) * bend * u.illumination * 0.2;
  float glowR = max(min(size.x, size.y) * 0.5, 24.0);
  float2 tv = local - float2(u.touchX, u.touchY);
  float glow = u.touchStrength * exp(-dot(tv, tv) / (2.0 * glowR * glowR)) * 0.28;
  float line = exp(-depth * edgeW / max(edgeW * 0.09, 1.0));
  float gloss = line * (0.25 + 0.75 * facing * facing) * u.illumination * 0.65;
  float light = spec + back + gloss + glow + u.press * 0.05;
  float3 rgb = min(color.rgb + float3(light) * color.a, float3(color.a));
  float a = color.a;

  // Android's SurfacePainter: tint, then a border that is lighter on the lit side.
  rgb = rgb * (1.0 - u.tintA) + float3(u.tintR, u.tintG, u.tintB) * u.tintA;
  a = a * (1.0 - u.tintA) + u.tintA;
  if (u.borderWidth > 0.0 && u.borderOpacity > 0.0) {
    float band = smoothstep(-0.5, 0.5, d + u.borderWidth);
    float t = clamp((dot(p, -lightDir) / length(halfSize) + 1.0) * 0.5, 0.0, 1.0);
    float op = t < 0.55 ? mix(1.0, 0.3, t / 0.55) : mix(0.3, 0.65, (t - 0.55) / 0.45);
    float b = band * op * u.borderOpacity;
    rgb = rgb * (1.0 - b) + float3(b);
    a = a * (1.0 - b) + b;
  }
  return float4(rgb, a) * cover;
}
)METAL";

@implementation LGShaderRenderer {
  id<MTLDevice> _device;
  id<MTLCommandQueue> _queue;
  id<MTLRenderPipelineState> _pipeline;
  CAMetalLayer *_layer;
  CGContextRef _context;
  void *_lastPixels;
  size_t _pixelBytes;
  size_t _width;
  size_t _height;
  id<MTLTexture> _source;
  id<MTLTexture> _blurred;
  MPSImageGaussianBlur *_blur;
  CGFloat _blurSigma;
}

+ (instancetype)create
{
  id<MTLDevice> device = MTLCreateSystemDefaultDevice();
  if (!device || !MPSSupportsMTLDevice(device)) {
    return nil;
  }
  NSError *error = nil;
  id<MTLLibrary> library = [device newLibraryWithSource:kLGShaderSource options:nil error:&error];
  if (!library) {
    NSLog(@"[LiquidGlass] shader compile failed, using system glass: %@", error);
    return nil;
  }
  MTLRenderPipelineDescriptor *descriptor = [MTLRenderPipelineDescriptor new];
  descriptor.vertexFunction = [library newFunctionWithName:@"lgVertex"];
  descriptor.fragmentFunction = [library newFunctionWithName:@"lgFragment"];
  descriptor.colorAttachments[0].pixelFormat = MTLPixelFormatBGRA8Unorm;
  id<MTLRenderPipelineState> pipeline = [device newRenderPipelineStateWithDescriptor:descriptor error:&error];
  if (!pipeline) {
    NSLog(@"[LiquidGlass] shader pipeline failed, using system glass: %@", error);
    return nil;
  }
  LGShaderRenderer *renderer = [LGShaderRenderer new];
  renderer->_device = device;
  renderer->_queue = [device newCommandQueue];
  renderer->_pipeline = pipeline;
  CAMetalLayer *layer = [CAMetalLayer layer];
  layer.device = device;
  layer.pixelFormat = MTLPixelFormatBGRA8Unorm;
  layer.opaque = NO;
  layer.framebufferOnly = YES;
  renderer->_layer = layer;
  return renderer;
}

- (CAMetalLayer *)layer
{
  return _layer;
}

- (void)dealloc
{
  [self releaseResources];
}

- (void)releaseResources
{
  if (_context) {
    CGContextRelease(_context);
    _context = NULL;
  }
  free(_lastPixels);
  _lastPixels = NULL;
  _source = nil;
  _blurred = nil;
  _width = 0;
  _height = 0;
}

- (BOOL)prepareWidth:(size_t)width height:(size_t)height
{
  if (width == _width && height == _height && _context) {
    return YES;
  }
  [self releaseResources];
  CGColorSpaceRef space = CGColorSpaceCreateDeviceRGB();
  _context = CGBitmapContextCreate(NULL, width, height, 8, 0, space,
                                   (uint32_t)kCGImageAlphaPremultipliedFirst | (uint32_t)kCGBitmapByteOrder32Little);
  CGColorSpaceRelease(space);
  if (!_context) {
    return NO;
  }
  _pixelBytes = CGBitmapContextGetBytesPerRow(_context) * height;
  _lastPixels = calloc(_pixelBytes, 1);
  MTLTextureDescriptor *descriptor =
      [MTLTextureDescriptor texture2DDescriptorWithPixelFormat:MTLPixelFormatBGRA8Unorm
                                                         width:width
                                                        height:height
                                                     mipmapped:NO];
  descriptor.usage = MTLTextureUsageShaderRead;
  _source = [_device newTextureWithDescriptor:descriptor];
  descriptor.usage = MTLTextureUsageShaderRead | MTLTextureUsageShaderWrite;
  _blurred = [_device newTextureWithDescriptor:descriptor];
  _width = width;
  _height = height;
  return _lastPixels && _source && _blurred;
}

- (BOOL)drawGlass:(UIView *)glass
         backdrop:(UIView *)backdrop
         uniforms:(LGShaderUniforms)uniforms
           blurPx:(CGFloat)blurPx
            force:(BOOL)force
{
  const CGFloat scale = _layer.contentsScale;
  const CGSize size = glass.bounds.size;
  if (size.width <= 0 || size.height <= 0) {
    return NO;
  }

  // Glass + padding, clipped to the backdrop (Android: LiquidGlassView.computeSampleRect).
  const CGFloat padPx = MIN(ceil(blurPx * 2 + uniforms.edge * uniforms.refraction + 4), 256);
  CGRect glassRect = [backdrop convertRect:glass.bounds fromView:glass];
  CGRect sample = CGRectIntegral(CGRectIntersection(CGRectInset(glassRect, -padPx / scale, -padPx / scale),
                                                    backdrop.bounds));
  if (CGRectIsEmpty(sample) || CGRectIsNull(sample)) {
    return NO;
  }

  // Heavy blur hides detail, so capture at half resolution to keep the CPU step cheap.
  const CGFloat captureScale = blurPx >= 8 ? scale / 2 : scale;
  const size_t width = MAX((size_t)ceil(sample.size.width * captureScale), 1);
  const size_t height = MAX((size_t)ceil(sample.size.height * captureScale), 1);
  if (![self prepareWidth:width height:height]) {
    return NO;
  }

  CGContextSaveGState(_context);
  CGContextClearRect(_context, CGRectMake(0, 0, width, height));
  CGContextTranslateCTM(_context, 0, height);
  CGContextScaleCTM(_context, captureScale, -captureScale);
  CGContextTranslateCTM(_context, -sample.origin.x, -sample.origin.y);
  [backdrop.layer renderInContext:_context];
  CGContextRestoreGState(_context);

  // Nothing moved and no animation is running: skip the GPU work entirely.
  const void *pixels = CGBitmapContextGetData(_context);
  const BOOL changed = memcmp(pixels, _lastPixels, _pixelBytes) != 0;
  if (!changed && !force) {
    return YES;
  }
  memcpy(_lastPixels, pixels, _pixelBytes);

  [_source replaceRegion:MTLRegionMake2D(0, 0, width, height)
             mipmapLevel:0
               withBytes:pixels
             bytesPerRow:CGBitmapContextGetBytesPerRow(_context)];

  id<MTLCommandBuffer> commands = [_queue commandBuffer];
  // Android blurs with sigma ≈ radius × 0.58 + 0.5 (radius in px).
  const CGFloat sigma = (blurPx * 0.57735 + 0.5) * captureScale / scale;
  id<MTLTexture> content = _source;
  if (blurPx >= 0.5) {
    if (!_blur || _blurSigma != sigma) {
      _blur = [[MPSImageGaussianBlur alloc] initWithDevice:_device sigma:(float)sigma];
      _blur.edgeMode = MPSImageEdgeModeClamp;
      _blurSigma = sigma;
    }
    [_blur encodeToCommandBuffer:commands sourceTexture:_source destinationTexture:_blurred];
    content = _blurred;
  }

  const CGSize drawable = CGSizeMake(round(size.width * scale), round(size.height * scale));
  if (!CGSizeEqualToSize(_layer.drawableSize, drawable)) {
    _layer.drawableSize = drawable;
  }
  id<CAMetalDrawable> target = [_layer nextDrawable];
  if (!target) {
    [commands commit];
    return YES;
  }

  uniforms.sizeX = (float)drawable.width;
  uniforms.sizeY = (float)drawable.height;
  uniforms.originX = (float)((sample.origin.x - glassRect.origin.x) * scale);
  uniforms.originY = (float)((sample.origin.y - glassRect.origin.y) * scale);
  uniforms.captureX = (float)(sample.size.width * scale);
  uniforms.captureY = (float)(sample.size.height * scale);

  MTLRenderPassDescriptor *pass = [MTLRenderPassDescriptor renderPassDescriptor];
  pass.colorAttachments[0].texture = target.texture;
  pass.colorAttachments[0].loadAction = MTLLoadActionClear;
  pass.colorAttachments[0].clearColor = MTLClearColorMake(0, 0, 0, 0);
  pass.colorAttachments[0].storeAction = MTLStoreActionStore;
  id<MTLRenderCommandEncoder> encoder = [commands renderCommandEncoderWithDescriptor:pass];
  [encoder setRenderPipelineState:_pipeline];
  [encoder setFragmentBytes:&uniforms length:sizeof(uniforms) atIndex:0];
  [encoder setFragmentTexture:content atIndex:0];
  [encoder drawPrimitives:MTLPrimitiveTypeTriangle vertexStart:0 vertexCount:3];
  [encoder endEncoding];
  [commands presentDrawable:target];
  [commands commit];
  return YES;
}

@end
