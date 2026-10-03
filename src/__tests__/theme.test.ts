import { normalizeQuality } from '../quality/normalizeQuality';
import { defaultTheme } from '../theme/defaultTheme';
import { mergeTheme } from '../theme/mergeTheme';
import { __resetWarnings } from '../utils/warnOnce';

describe('mergeTheme', () => {
  it('returns the parent when there is no child', () => {
    expect(mergeTheme(defaultTheme)).toBe(defaultTheme);
  });

  it('merges material overrides field by field across nested providers', () => {
    const outer = mergeTheme(defaultTheme, { materials: { regular: { blur: 30, refraction: 0.2 } } });
    const inner = mergeTheme(outer, { defaultMaterial: 'thick', materials: { regular: { blur: 12 } } });
    expect(inner.defaultMaterial).toBe('thick');
    expect(inner.materials.regular).toEqual({ blur: 12, refraction: 0.2 });
    expect(inner.cornerRadius).toBe(defaultTheme.cornerRadius);
  });
});

describe('normalizeQuality', () => {
  beforeEach(() => {
    __resetWarnings();
    jest.spyOn(console, 'warn').mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it('accepts valid values and defaults undefined', () => {
    expect(normalizeQuality('low')).toBe('low');
    expect(normalizeQuality(undefined, 'medium')).toBe('medium');
  });

  it('rejects unknown values with a warning', () => {
    expect(normalizeQuality('ultra')).toBe('auto');
    expect(console.warn).toHaveBeenCalled();
  });
});
