const path = require('path');

module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Use the library's TypeScript source directly, so edits hot-reload.
  plugins: [
    [
      'module-resolver',
      { alias: { 'react-native-liquid-glass': path.join(__dirname, '..', 'src') } },
    ],
  ],
};
