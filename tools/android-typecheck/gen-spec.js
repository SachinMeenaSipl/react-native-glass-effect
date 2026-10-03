// Runs React Native codegen on src/specs.
// usage: node gen-spec.js [android|ios]  (default android)
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..', '..');
const platform = process.argv[2] || 'android';
const out = platform === 'ios' ? path.join(__dirname, '..', 'ios-typecheck', '.cache', 'codegen') : path.join(__dirname, '.cache', 'codegen');
const combine = require(path.join(root, 'node_modules/@react-native/codegen/lib/cli/combine/combine-js-to-schema.js'));
const RNCodegen = require(path.join(root, 'node_modules/@react-native/codegen/lib/generators/RNCodegen.js'));
const specs = fs.readdirSync(path.join(root, 'src/specs')).map((f) => path.join(root, 'src/specs', f));
const schema = combine.combineSchemasInFileList(specs, platform, undefined);
fs.mkdirSync(out, { recursive: true });
RNCodegen.generate(
  { libraryName: 'RNLiquidGlassSpec', schema, outputDirectory: out, packageName: 'com.liquidglass', assumeNonnull: false },
  { generators: platform === 'ios' ? ['modulesIOS', 'componentsIOS'] : ['modulesAndroid', 'componentsAndroid'], test: false }
);
console.log(`codegen (${platform}) OK →`, out);
