/**
 * Module dependencies
 */

var fs = require('fs'),
    winston = require('winston'),
    exec = require('child_process').exec;

/**
 * Expose `utils`
 */

var utils = module.exports = exports;


/**
 * Clone the git repo to `./repos`
 *
 * @param {String} uri
 * @param {Function} callback
 */

utils.cloneRepo = function(uri, callback) {
  exec('git clone ' + uri, {cwd: './repos'}, function(error, stdout, stderr) {
    if(error) {
      winston.log('error', error.message);
    } else {
      console.log(stdout);
      console.log(stderr);
      return callback();
    }
  });
};

/**
 * Return the language that belongs to the repository
 *
 * @param {String} language
 */

utils.language = function(language, repo) {
  if(language) return language;

  var files = fs.readdirSync('./repos/' + repo);
  if(~files.indexOf('Gemfile')) return 'ruby';
  if(~files.indexOf('Gruntfile.js')) return 'static';
  if(~files.indexOf('package.json')) return 'javascript';
};