/**
 * Module dependencies
 */

var fs = require('fs'),
    path = require('path'),
    utils = require('./utils'),
    winston = require('winston'),
    exec = require('child_process').exec;

/**
 * Expose `dispense`
 */

var dispense = module.exports = exports;

/**
 * Global paths variables
 */

var repoPath = path.join(__dirname, '../repos'),
    scriptPath = path.join(__dirname, '../scripts');

/**
 * Deploy the repo source
 *
 * @param {Object} repo
 */

dispense.deploy = function(repo) {
  var callback = function() {
    return build(repo);
  };

  if(fs.existsSync(path.join(repoPath, repo.name))) {
    fetch(repo.name, callback);
  } else {
    clone(repo.url, callback);
  }
};

/**
 * Config getter
 */

dispense.__defineGetter__('config', function() {
  var config = loadConfig();

  function loadConfig() {
    var p = path.join(__dirname, '../config/deployments.json');
    return config || JSON.parse(fs.readFileSync(p, 'utf8'));
  }

  return config;
});

/**
 * Run scripts for building and deploying the repo
 *
 * @param {Object} repo
 */

function build(repo) {
  var c = dispense.config.repos[repo.name],
      cwd = path.join(repoPath, repo.name),
      args = utils.makeArgs(c),
      script = path.join(scriptPath, c.type);

  if(fs.existsSync(script)) {
    exec(script + ' ' + args.join(' '), {cwd: cwd},
      function(error, stdout, stderr) {
        if(error) {
          winston.log('error', 'Error in deploy script for ' +
                        repo.name + ': ' + error.message);
        } else {
          winston.log('info', repo.name + ' successfully exited deploy script');
        }
      });
  } else {
    winston.log('error', 'Cannot deploy project with type ' + c.type);
  }
}

/**
 * Clone the git repo to `./repos`
 *
 * @param {String} url
 * @param {Function} callback
 */

function clone(url, callback) {
  exec('git clone ' + url, {cwd: repoPath}, function(error, stdout, stderr) {
    if(error) {
      winston.log('error', 'Error cloning ' + url + ': ' + error.message);
    } else {
      winston.log('info', 'Cloned ' + url);
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
  var cwd = path.join(repoPath, name);

  exec('git pull origin master', {cwd: cwd}, function(error, stdout, stderr) {
    if(error) {
      winston.log('error', 'Error fetching ' + name + ': ' + error.message);
    } else {
      winston.log('info', 'Pulled master of ' + name);
      return callback();
    }
  });
}