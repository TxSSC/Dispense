/**
 * Expose `utils`
 */

var utils = module.exports = exports;

/**
 * Helper function for building script arguments
 *  - Returns argument values sorted in key order, with any type key ignored
 * Ex: `copy`: `build` would come before `directory`: `build`
 *
 * @param {Object} config
 * @return {Array}
 */

utils.makeArgs = function(config) {
  return Object.keys(config).sort().filter(function(key) {
    return key !== 'type';
  }).map(function(key) {
    return config[key];
  });
};