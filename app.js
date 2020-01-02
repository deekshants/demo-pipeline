var express = require('express');
var dotenv = require('dotenv').config();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var PgStore=require('connect-pg-simple')(session);
var logs = require('./model/logsModel');
var routes = require('./routes/index.js');
var middleware = require('./controller/middlewares')
var app = express();
var passport = require('passport')
require('./connection/passport')
// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

express.static(path.join(__dirname, 'public'));

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.authenticate('remember-me'));
app.use(session({
  store: new PgStore({
    url: "postgres://postgres:deeksh123@localhost:5432/postgres",
    autoReconnect: true,
  }),
  secret:'hrmSession',
  resave: false,
  saveUninitialized: false,
  secure : true
}));

//custom middlewares
app.use('/',middleware.noCache)
app.use('/', middleware.checkLogin);
app.use('/', routes);
app.use(middleware.errorHandler404);
if (app.get('env') === 'development') {
  app.use(middleware.developmentErrorHandler);
}
app.use(middleware.productionErrorHandler);

module.exports = app;
