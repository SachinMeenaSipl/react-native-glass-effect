const path = require('path');
const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const root = path.resolve(__dirname, '..');

/** Lets Metro see the library source one folder up. */
module.exports = mergeConfig(getDefaultConfig(__dirname), {
  watchFolders: [root],
  resolver: {
    extraNodeModules: { 'react-native-liquid-glass': path.join(root, 'src') },
    nodeModulesPaths: [path.join(__dirname, 'node_modules'), path.join(root, 'node_modules')],
    // Library source lives outside example/, so it would otherwise find ../node_modules/react:
    // a second copy of React ("Invalid hook call"). Resolve both from the example instead.
    resolveRequest: (context, name, platform) =>
      /^(react|react-native)(\/|$)/.test(name)
        ? context.resolveRequest(
            { ...context, originModulePath: path.join(__dirname, 'index.js') },
            name,
            platform,
          )
        : context.resolveRequest(context, name, platform),
  },
});
