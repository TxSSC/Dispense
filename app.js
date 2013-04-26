
/**
 * Module dependencies.
 */

var http = require('http'),
    express = require('express');

var app = express();

app.configure(function() {
  app.set('port', process.env.DEPLOY_PORT || 3000);
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(app.router);
});

/**
 * Github endpoint
 */

app.post('/gh/:repo', function(req, res) {

});

/**
 * Bitbucket endpoint
 */

app.post('/bb/:repo', function(req, res) {

});

/**
 * Start the server
 */

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});