const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const projectRoot = __dirname;
// The library lives two levels up and is linked into node_modules as a symlink.
const libraryRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Let Metro bundle the library's source from outside this app folder.
config.watchFolders = [libraryRoot];

// The library's own devDependencies include a different React. Without this, the
// library could load a second copy of React and crash with "Invalid hook call".
// Always resolve React and React Native from this app.
const singletons = ['react', 'react-native'];
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  const isSingleton = singletons.some((name) => moduleName === name || moduleName.startsWith(`${name}/`));
  if (isSingleton) {
    return (originalResolveRequest ?? context.resolveRequest)(
      { ...context, originModulePath: path.join(projectRoot, 'index.ts') },
      moduleName,
      platform
    );
  }
  return (originalResolveRequest ?? context.resolveRequest)(context, moduleName, platform);
};

module.exports = config;
