/**
 * The web bridge replaces the native bridge in web bundles (lib/web). Both must export
 * the same names, and the web one must report that native code is unavailable so every
 * component renders its CSS/JS fallback.
 *
 * The native bridge imports TurboModule code that cannot load under Jest, so the export
 * names are compared from source text instead of importing it.
 */
import { readFileSync } from 'fs';
import { join } from 'path';
import * as web from '../native/nativeBridge.web';

const exportedNames = (file: string): string[] => {
  const source = readFileSync(join(__dirname, '..', 'native', file), 'utf8');
  return [...source.matchAll(/^export const (\w+)/gm)].map((m) => m[1]).sort();
};

describe('web bridge', () => {
  it('exports the same names as the native bridge', () => {
    expect(Object.keys(web).sort()).toEqual(exportedNames('nativeBridge.ts'));
  });

  it('reports native as unavailable and provides no native components', () => {
    expect(web.isNativeAvailable).toBe(false);
    expect(web.nativeModule).toBeNull();
    expect(web.NativeGlassView).toBeNull();
    expect(web.NativeBackdrop).toBeNull();
  });
});
