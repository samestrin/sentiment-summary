// moduleConfig.js
let config = {};

/**
 * Updates the global configuration object by merging the provided options.
 *
 * @param {object} options - An object containing configuration key-value pairs to add or override.
 */

function setup(options) {
  config = { ...config, ...options };
}

/**
 * Returns a copy of the current global configuration object.
 *
 * @returns {object} A copy of the configuration object.
 */

function getConfig() {
  return config;
}

module.exports = { setup, getConfig };
