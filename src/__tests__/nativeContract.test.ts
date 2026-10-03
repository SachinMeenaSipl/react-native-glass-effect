/**
 * Contract test: the props declared in the codegen spec (TypeScript) must match
 * the @ReactProp setters on Android and the props iOS reads. If you add a prop in
 * one place and forget another, this fails. See AGENTS.md → "Adding a prop".
 */
import { readFileSync } from 'fs';
import { join } from 'path';

const root = join(__dirname, '..', '..');
const read = (p: string) => readFileSync(join(root, p), 'utf8');

function specProps(file: string): string[] {
  const src = read(file);
  const body = src.slice(src.indexOf('extends ViewProps {'), src.indexOf('\n}', src.indexOf('extends ViewProps {')));
  return [...body.matchAll(/^\s{2}(\w+)\?:/gm)].map((m) => m[1]!).sort();
}

function kotlinProps(file: string): string[] {
  return [...read(file).matchAll(/@ReactProp\(name = "(\w+)"/g)].map((m) => m[1]!).sort();
}

describe('native prop contract', () => {
  it('LiquidGlassView: TS spec == Android @ReactProp', () => {
    expect(kotlinProps('android/src/main/java/com/liquidglass/view/LiquidGlassViewManager.kt')).toEqual(
      specProps('src/specs/LiquidGlassViewNativeComponent.ts')
    );
  });

  it('GlassBackdrop: TS spec == Android @ReactProp', () => {
    expect(kotlinProps('android/src/main/java/com/liquidglass/backdrop/GlassBackdropManager.kt')).toEqual(
      specProps('src/specs/GlassBackdropNativeComponent.ts')
    );
  });

  it('LiquidGlassView: every spec prop is passed by the JS component', () => {
    const component = read('src/components/LiquidGlassView/LiquidGlassView.tsx');
    for (const prop of specProps('src/specs/LiquidGlassViewNativeComponent.ts')) {
      expect(component).toMatch(new RegExp(`\\b${prop}=\\{`));
    }
  });
});
