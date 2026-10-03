/**
 * Autolinking config. Both platforms are linked automatically on RN >= 0.76.
 * Nothing needs to be added to the host app.
 */
module.exports = {
  dependency: {
    platforms: {
      android: {},
      ios: {},
    },
  },
};
