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
  var callback = function() {
    return build(repo);
  };

  if(fs.existsSync(path.join('./repos', repo.name))) {
    winston.log('info', 'Updating repo ' +
      repo.name + ' to commit: ' + repo.commit.slice(0, 6));
    fetch(repo.name, callback);
  } else {
    clone(repo.url, callback);
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
  var args,
      conf = config.repos[repo.name],
      cwd = path.join('./repos', repo.name),
      script = path.resolve(path.join('./scripts', conf.type));

  if(fs.existsSync(script)) {
    args = [script, config.ssh_user, conf.deploy_to, conf.directory_to_deploy];

    exec(args.join(' '), {cwd: cwd}, function(error, stdout, stderr) {
      if(error) {
        winston.log('error', error.message);
      } else {
        winston.log('info', repo.name + ' successfully exited deploy script');
      }
    });
  } else {
    winston.log('error', 'Cannot deploy project with type ' + conf.type);
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
      winston.log('info', 'Cloned ' + ssh);
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
      winston.log('info', 'Pulled master of ' + name);
      return callback();
    }
  });
}