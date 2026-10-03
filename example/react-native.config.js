const path = require('path');

/** Autolink the library from the parent folder. */
module.exports = {
  dependencies: {
    'react-native-liquid-glass': { root: path.join(__dirname, '..') },
  },
};
