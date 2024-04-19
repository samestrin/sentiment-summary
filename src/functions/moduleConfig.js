// moduleConfig.js
let config = {};

function setup(options) {
  config = { ...config, ...options };
}

function getConfig() {
  return config;
}

module.exports = { setup, getConfig };
