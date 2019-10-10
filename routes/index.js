var express = require('express');
var router = express.Router();
var app = require('./../app.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("process.env.BASE_URL");
	console.log(process.env);
  res.render('index', {baseUrl: process.env.BASE_URL});
});



router.get('/signup', function(req, res) {
    res.render('signups/page_Signup', {baseUrl: process.env.BASE_URL});
});
router.get('/signup-step2', function(req, res) {
    res.render('signups/page_SignupStep2', {baseUrl: process.env.BASE_URL});
});
router.get('/company/signup', function(req, res) {
    res.render('signups/page_SignupWithDomain', {baseUrl: process.env.BASE_URL});
});
router.get('/login', function(req, res) {
    res.render('logins/page_Login', {baseUrl: process.env.BASE_URL});
});
router.get('/company/login', function(req, res) {
    res.render('logins/page_LoginWithDomain', {baseUrl: process.env.BASE_URL});
});
router.get('/reset-password', function(req, res) {
    res.render('resetPass/page_ResetPass', {baseUrl: process.env.BASE_URL});
});
router.get('/create-password', function(req, res) {
    res.render('resetPass/page_CreatePass', {baseUrl: process.env.BASE_URL});
});
router.get('/org/admin-setup', function(req, res) {
    res.render('org/adminSetup/page_AdminSetup', {baseUrl: process.env.BASE_URL});
});
router.get('/org/employees', function(req, res) {
    res.render('org/orgEmployees/page_orgEmployees', {baseUrl: process.env.BASE_URL});
});
router.get('/employee-details', function(req, res) {
    res.render('empDetails/page_empDetails', {baseUrl: process.env.BASE_URL});
});

module.exports = router;
