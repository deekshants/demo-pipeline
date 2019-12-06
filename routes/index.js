var express = require('express');
var router = express.Router();
var app = require('./../app.js');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('home/page_home', {baseUrl: process.env.BASE_URL});
});



router.get('/account-suspended', function(req, res) {
    res.render('errorPage/page_accountSuspended', {baseUrl: process.env.BASE_URL});
});
router.get('/account-deactivated', function(req, res) {
    res.render('errorPage/page_accountDeactivated', {baseUrl: process.env.BASE_URL});
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

router.get('/attendance/my-attendance', function(req, res) {
    res.render('attendance/myAttendance/page_MyAttendance', {baseUrl: process.env.BASE_URL});
});

router.get('/attendance/my-attendance-requests', function(req, res) {
    res.render('attendance/myAttendanceRequests/page_MyAttenReq', {baseUrl: process.env.BASE_URL});
});

router.get('/attendance/my-wfh-requests', function(req, res) {
    res.render('attendance/myWorkFromHomeRequests/page_MyWFHReq', {baseUrl: process.env.BASE_URL});
});


router.get('/myteam/dashboard', function(req, res) {
    res.render('myTeam/teamDashboard/page_TeamDashboard', {baseUrl: process.env.BASE_URL});
});

router.get('/myteam/attendance-approvals', function(req, res) {
    res.render('myTeam/teamAttendanceApprovals/page_TeamAttendanceApprovals', {baseUrl: process.env.BASE_URL});
});

router.get('/myteam/wfh-approvals', function(req, res) {
    res.render('myTeam/teamWFHApprovals/page_TeamWFHApprovals', {baseUrl: process.env.BASE_URL});
});

router.get('/myteam/leave-approvals', function(req, res) {
    res.render('myTeam/teamLeaveApprovals/page_TeamLeaveApprovals', {baseUrl: process.env.BASE_URL});
});


router.get('/org/org-tree', function(req, res) {
    res.render('org/orgTree/page_OrgTree', {baseUrl: process.env.BASE_URL});
});

router.get('/me/my-leaves', function(req, res) {
    res.render('me/myLeaves/page_myLeaves', {baseUrl: process.env.BASE_URL});
});

router.get('/employee-details', function(req, res) {
    res.render('empDetails/page_empDetails', {baseUrl: process.env.BASE_URL});
});





router.get('/extra', function(req, res) {
    res.render('extra/page_extra', {baseUrl: process.env.BASE_URL});
});

module.exports = router;
