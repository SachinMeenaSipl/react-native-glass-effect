import { MATERIALS } from '../materials/presets';
import { MAX_BLUR_DP, normalizeAngle, resolveMaterial } from '../materials/resolveMaterial';
import { __resetWarnings } from '../utils/warnOnce';

const base = { colorScheme: 'light' as const, defaultMaterial: 'regular' as const };

beforeEach(() => {
  __resetWarnings();
  jest.spyOn(console, 'warn').mockImplementation(() => undefined);
});
afterEach(() => jest.restoreAllMocks());

describe('resolveMaterial', () => {
  it('uses the default material when none is given', () => {
    const r = resolveMaterial({ ...base, props: {} });
    expect(r.blurRadius).toBe(MATERIALS.regular.blur);
    expect(r.tintOpacity).toBe(MATERIALS.regular.tintOpacity.light);
  });

  it('picks dark-scheme tint and opacity', () => {
    const r = resolveMaterial({ ...base, colorScheme: 'dark', props: { material: 'thick' } });
    expect(r.tintColor).toBe(MATERIALS.thick.tint.dark);
    expect(r.tintOpacity).toBe(MATERIALS.thick.tintOpacity.dark);
    expect(r.fallbackColor).toBe(MATERIALS.thick.fallbackColor.dark);
  });

  it('prop beats theme override beats preset', () => {
    const themed = resolveMaterial({
      ...base,
      props: {},
      materialOverrides: { regular: { blur: 30 } },
    });
    expect(themed.blurRadius).toBe(30);
    const prop = resolveMaterial({
      ...base,
      props: { blur: 5 },
      materialOverrides: { regular: { blur: 30 } },
    });
    expect(prop.blurRadius).toBe(5);
  });

  it('intensity scales effect strengths but not tint opacity', () => {
    const full = resolveMaterial({ ...base, props: {} });
    const half = resolveMaterial({ ...base, props: { intensity: 0.5 } });
    expect(half.blurRadius).toBeCloseTo(full.blurRadius / 2);
    expect(half.refraction).toBeCloseTo(full.refraction / 2);
    expect(half.illumination).toBeCloseTo(full.illumination / 2);
    expect(half.tintOpacity).toBe(full.tintOpacity);
  });

  it('clamps out-of-range and non-finite values', () => {
    const r = resolveMaterial({
      ...base,
      props: {
        blur: 10_000,
        refraction: 5,
        distortion: -1,
        illumination: NaN,
        tintOpacity: Infinity,
        borderWidth: 999,
        intensity: 3,
      },
    });
    expect(r.blurRadius).toBe(MAX_BLUR_DP);
    expect(r.refraction).toBe(1);
    expect(r.distortion).toBe(0);
    expect(r.illumination).toBe(MATERIALS.regular.illumination);
    expect(r.tintOpacity).toBe(0.12);
    expect(r.glassBorderWidth).toBe(8);
  });

  it('falls back to the default material for unknown names and warns once', () => {
    const r = resolveMaterial({ ...base, props: { material: 'glossy' as never } });
    resolveMaterial({ ...base, props: { material: 'glossy' as never } });
    expect(r.blurRadius).toBe(MATERIALS.regular.blur);
    expect(console.warn).toHaveBeenCalledTimes(1);
  });

  it('passes custom tint through untouched (PlatformColor objects etc.)', () => {
    const platformColor = { semantic: ['systemBlue'] };
    const r = resolveMaterial({ ...base, props: { tint: platformColor as never } });
    expect(r.tintColor).toBe(platformColor);
  });

  it('clear material asks iOS for the clear glass style', () => {
    expect(resolveMaterial({ ...base, props: { material: 'clear' } }).appearance).toBe('clear');
  });
});

describe('normalizeAngle', () => {
  it.each([
    [0, 0],
    [-60, -60],
    [180, -180],
    [270, -90],
    [-270, 90],
    [720, 0],
    [NaN, -60],
  ])('%p → %p', (input, out) => {
    expect(normalizeAngle(input)).toBe(out);
  });
});
