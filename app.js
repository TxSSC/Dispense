
/**
 * Module dependencies.
 */

var http = require('http'),
    express = require('express'),
    winston = require('winston'),
    utils = require('./lib/utils'),
    dispense = require('./lib/dispense');

var app = express();

/**
 * Configure express app
 */

app.configure(function() {
  app.set('port', process.env.DISPENSE_PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(app.router);
  winston.add(winston.transports.File, {
    filename: dispense.config.logfile || (__dirname + '/dispense.log')
  });
});

app.configure('production', function() {
  winston.remove(winston.transports.Console);
});

/**
 * Github endpoint
 */

app.post('/gh', function(req, res) {
  var repo, data;

  try {
    data = JSON.parse(req.body.payload);
  } catch(e) {
    return res.send(400);
  }

  if(!data || !data.repository) return res.send(400);
  if(data.ref.split('/')[2] !== 'master') return res.send(403);

  repo = {
    name: data.repository.name,
    url: utils.githubURL(data.repository),
    commit: data.after
  };

  // The user must be in the users array of the config file
  if(!dispense.config.repos[repo.name] || (dispense.config.users &&
     !~dispense.config.users.indexOf(data.pusher.name))) return res.send(401);
  res.send(202); // Go ahead and fire back a 202 status
  dispense.deploy(repo);
});

/**
 * Bitbucket endpoint
 */

app.post('/bb', function(req, res) {
  var repo, data;

  try {
    data = JSON.parse(req.body.payload);
  } catch(e) {
    res.send(400);
  }

  if(!data || !data.repository || !data.commits) return res.send(400);
  if(!data.commits.length || data.commits[0].branch !== 'master') return res.send(403);

  repo = {
    name: data.repository.name,
    url: utils.bitbucketURL(data.repository),
    commit: data.commits[0].node
  };

  // The user must be in the users array of the config file
  if(!dispense.config.repos[repo.name] || (dispense.config.users &&
     !~dispense.config.users.indexOf(data.user))) return res.send(401);
  res.send(202); // Go ahead and fire back a 202 status
  dispense.deploy(repo);
});

/**
 * Start the server
 */

http.createServer(app).listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});