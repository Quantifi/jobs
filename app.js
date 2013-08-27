/**
 * Module dependencies.
 */

var express = require('express'),
    stylus = require('stylus'),
    path = require('path'),
    db = require('./model/db'),
    fs = require('fs');

// Create app
var app = express();

// Configure app (All Environments)
app.configure(function() {
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(stylus.middleware({
    src: __dirname + '/views',
    dest: __dirname + '/public'
  }));
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.compress());
  app.use(express.static(path.join(__dirname, 'public')));
});

// Config (Development Only)
app.configure('development', function() {
  app.use(express.errorHandler({
    showStack: true,
    dumpExceptions: true
  }));
});

// Find Routes
var routesDir = 'routes',
    routeFiles = fs.readdirSync(routesDir);

// Load Routes
routeFiles.forEach(function(file) {
  var filePath = path.resolve('./', routesDir, file),
      route = require(filePath);
  route.init(app);
});

// Listen for connections
app.listen(app.get('port'), function() {
  console.log('App listening @ ' + app.get('port'));
});
