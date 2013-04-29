/**
 * Module dependencies
 */

var fs = require('fs'),
    path = require('path'),
    winston = require('winston'),
    exec = require('child_process').exec,
    config = require('./deployments.json');

/**
 * Expose `deploy`
 */

var utils = module.exports = exports;

/**
 * Deploy the repo source
 *
 * @param {Object} repo
 */

utils.deploy = function(repo) {
  if(fs.existsSync(path.join('./repos', repo.name))) {
    winston.log('info', 'Updating repo ' + repo.name + ' to commit: ' + repo.commit);
    fetch(repo.name, function() {
      build(repo);
    });
  } else {
    clone(repo.url, function() {
      build(repo);
    });
  }
};

/**
 * Config getter
 */

utils.__defineGetter__('config', function() {
  var config = loadConfig();

  function loadConfig() {
    return config || require('./deployments.json');
  }

  return config;
});

/**
 * Run scripts for building and deploying the repo
 *
 * @param {Object} repo
 */

function build(repo) {
  var conf = config.repos[repo.name],
      cwd = path.join('./repos', repo.name),
      script = path.resolve(path.join('./scripts', conf.type));

  if(fs.existsSync(script)) {
    console.log(script);
    exec(script, {cwd: cwd}, function(error, stdout, stderr) {
      if(error) {
        winston.log('error', error.message);
      } else {
        console.log(stdout);
        console.log(stderr);
      }
    });
  } else {
    winston.log('error', 'Cannot build project with type ' + conf.type);
  }
}

/**
 * Clone the git repo to `./repos`
 *
 * @param {String} url
 * @param {Function} callback
 */

function clone(url, callback) {
  var repo = url.replace(/^https?:\/\/github.com\//, ''),
      ssh = 'git@github.com:' + repo + '.git';

  exec('git clone ' + ssh, {cwd: './repos'}, function(error, stdout, stderr) {
    if(error) {
      winston.log('error', error.message);
    } else {
      winston.log('info', 'Successfully cloned ' + ssh);
      return callback();
    }
  });
}

/**
 * Fetch the git repo at `./repos + name`
 *
 * @param {String} name
 * @param {Function} callback
 */

function fetch(name, callback) {
  var cwd = path.join('./repos', name);

  exec('git pull origin master', {cwd: cwd}, function(error, stdout, stderr) {
    if(error) {
      winston.log('error', error.message);
    } else {
      winston.log('info', 'Successfully pulled master of ' + name);
      return callback();
    }
  });
}