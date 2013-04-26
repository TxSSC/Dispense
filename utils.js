/**
 * Module dependencies
 */

var fs = require('fs'),
    winston = require('winston'),
    exec = require('child_process').exec;

/**
 * Expose `deploy`
 */

module.exports = exports = deploy;

/**
 * Clone the git repo to `./repos`
 *
 * @param {String} uri
 * @param {Function} callback
 */

function deploy(obj) {
  repo = details.url.replace(/^https?:\/\/github.com\//, ''),
      uri = 'git@github.com:' + repo + '.git';
  exec('git clone ' + uri, {cwd: './repos'}, function(error, stdout, stderr) {
    if(error) {
      winston.log('error', error.message);
    } else {
      console.log(stdout);
      console.log(stderr);
      return callback();
    }
  });
}

/**
 * Return the language that belongs to the repository
 *
 * @param {String} language
 */

function language(lang, repo) {
  if(lang) return lang;

  var files = fs.readdirSync('./repos/' + repo);
  if(~files.indexOf('Gemfile')) return 'ruby';
  if(~files.indexOf('Gruntfile.js')) return 'static';
  if(~files.indexOf('package.json')) return 'javascript';
}