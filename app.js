var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
//var role = require('./model/roleModel');
//var employee = require('./model/employeeModel');
var logs = require('./model/logsModel');
var routes = require('./routes/index.js');
var middleware = require('./controller/middlewares')
var app = express();

// view engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

express.static(path.join(__dirname, 'public'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//custom middlewares

app.use('/', middleware.checkLogin);
app.use('/', routes);
app.use(middleware.errorHandler404);
if (app.get('env') === 'development') {
  app.use(middleware.developmentErrorHandler);
}
app.use(middleware.productionErrorHandler);

module.exports = app;
