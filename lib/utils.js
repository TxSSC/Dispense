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

/**
 * Create BitBucket repository url
 *
 * @param {Object} repo
 * @return {String}
 */

utils.bitbucketURL = function(repo) {
  return 'git@bitbucket.org:' + repo.owner + '/' + repo.slug + '.git';
};

/**
 * Create Github repository url
 *
 * @param {Object} repo
 * @return {String}
 */

utils.githubURL = function(repo) {
  return 'git@github.com:' + repo.owner.name + '/' + repo.name + '.git';
};