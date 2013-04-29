
/**
 * Module dependencies.
 */

var http = require('http'),
    utils = require('./utils'),
    express = require('express');
    winston = require('winston');

var app = express();

/**
 * Configure express app
 */

app.configure(function() {
  app.set('port', process.env.DEPLOY_PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(app.router);
});

/**
 * Configure winston logging
 */

winston.add(winston.transports.File, {filename: 'builds.log'});
       //.remove(winston.transports.Console);

/**
 * Github endpoint
 */

app.post('/gh', function(req, res) {
  var repo, data = req.body.payload;
  if(!data || !data.repository) return res.send(400);
  repo = {
    name: data.repository.name,
    url: data.repository.url,
    commit: data.after
  };

  if(!utils.config.repos[repo.name]) return res.send(401);
  res.send(204); // Go ahead and fire back a 204 status
  utils.deploy(repo);
});

/**
 * Bitbucket endpoint
 */

app.post('/bb', function(req, res) {

});

/**
 * Start the server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});