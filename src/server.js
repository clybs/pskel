const express = require('express');
const jwt = require('jsonwebtoken');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const config = require('./config');

// Get routes
var login = require('./routes/login');
var matches = require('./routes/matches');
var players = require('./routes/players');
var stats = require('./routes/stats');
var users = require('./routes/users');

// Initialize DB
mongoose.Promise = global.Promise;
mongoose.connect(config.mongoDb.url);
mongoose.connection.on('error', err => {
  console.log(`DB error: ${err}`);
  process.exit();
});

// Initialize express
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Authentication middleware
var auth = function(req, res, next) {
  // Get the token
  let token = req.headers.authorization;

  // Check if there was a token defined
  if (token === undefined) {
    return res.status(403).send({
      success: false,
      error: 'No token provided'
    });
  }

  // Check if bearer keyword exists
  if (token.indexOf('Bearer ') === -1) {
    return res.json({
      success: false,
      message: 'Failed to authenticate token'
    });
  }

  token = token.replace('Bearer', ' ');
  token = token.trim();

  if (token === '') {
    return res.status(403).send({
      success: false,
      error: 'No token provided'
    });
  }

  // Check if correct
  jwt.verify(token, config.jwt.secret, (err, authData) => {
    if (err) {
      return res.json({
        success: false,
        message: 'Failed to authenticate token'
      });
    }
    req.authData = authData;
    next();
  });
};

// Do authentication
app.use('/api/matches', auth);
app.use('/api/players', auth);

// Map the routes
app.use('/api/login', login);
app.use('/api/matches', matches);
app.use('/api/players', players);
app.use('/api/stats', stats);
app.use('/api/user', users);

// Catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Error handler
app.use(function(err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.send(err);
});

module.exports = app;
