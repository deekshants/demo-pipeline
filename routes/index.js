var express = require('express');
var router = express.Router();
var app = require('./../app.js');
var utils = require('../controller/utilityController');
var loginController = require('../controller/loginController');
var crypto = require('crypto');
const signupController = require('../controller/signupController');
const resetPWController = require('../controller/resetPWController');
const timeController = require('../controller/timeInTimeout');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('home/page_home', { baseUrl: process.env.BASE_URL, user: req.session.user });
});
router.get('/getNotifications', utils.getNotifications)
//router.get('/getRolesTable', utils.getRolesTable);
router.post('/signupUser', loginController.signup)
router.get('/logout', loginController.logout);
router.post('/loginAuth', loginController.authorizeUser);
// ============
router.post('/validateDomain', loginController.validateDomain);
router.post('/validateDomainforSignup', signupController.validateDomainforSignup);
router.post('/adminRegisteration', signupController.signUp);
router.post('/loginUser', loginController.login);
router.post('/employeeRegisteration', signupController.signupEmployee);
router.post('/resetPassword', resetPWController.sendResetPasswordMail);
router.post('/createNewPassword', resetPWController.createNewPassword);


router.get('/getTimeInfo', timeController.getTimeInfo);
router.get('/getTimeOutInfo', timeController.getTimeOutInfo);
router.get('/company/login', loginController.showLoginPage);
router.get('/company/logout', loginController.logout);

router.get('/signup-step2', function (req, res) {
    var mykey = crypto.createDecipheriv('aes-128-cbc', 'encryptUrl');
    var mystr = mykey.update(req.query.domain, 'hex', 'utf8')
    mystr += mykey.final('utf8');
    res.render('signups/page_SignupStep2', { baseUrl: process.env.BASE_URL, companyUrl: mystr });
});

router.get('/create-password', resetPWController.showPasswordPage);

// ============
router.get('/account-suspended', function (req, res) {
    res.render('errorPage/page_accountSuspended', { baseUrl: process.env.BASE_URL });
});
router.get('/account-deactivated', function (req, res) {
    res.render('errorPage/page_accountDeactivated', { baseUrl: process.env.BASE_URL });
});

router.get('/signup', function (req, res) {
    res.render('signups/page_Signup', { baseUrl: process.env.BASE_URL, user: req.session.user });
});
/* router.get('/signup-step2', function(req, res) {     =======
    res.render('signups/page_SignupStep2', {baseUrl: process.env.BASE_URL, user: req.session.user});
}); */
router.get('/company/signup', function (req, res) {
    res.render('signups/page_SignupWithDomain', { baseUrl: process.env.BASE_URL, user: req.session.user });
});
router.get('/login', function (req, res) {
    res.render('logins/page_Login', { baseUrl: process.env.BASE_URL, user: req.session.user });
});
router.get('/company/login', loginController.showLoginPage);
router.get('/reset-password', function (req, res) {
    res.render('resetPass/page_ResetPass', { baseUrl: process.env.BASE_URL, user: req.session.user });
});
/* router.get('/create-password', function (req, res) {        ===========
    res.render('resetPass/page_CreatePass', { baseUrl: process.env.BASE_URL, user: req.session.user });
}); */
router.get('/org/admin-setup', function (req, res) {
    res.render('org/adminSetup/page_AdminSetup', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/org/employees', function (req, res) {
    res.render('org/orgEmployees/page_orgEmployees', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/attendance/my-attendance', function (req, res) {
    res.render('attendance/myAttendance/page_MyAttendance', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/attendance/my-attendance-requests', function (req, res) {
    res.render('attendance/myAttendanceRequests/page_MyAttenReq', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/attendance/my-wfh-requests', function (req, res) {
    res.render('attendance/myWorkFromHomeRequests/page_MyWFHReq', { baseUrl: process.env.BASE_URL, user: req.session.user });
});


router.get('/myteam/dashboard', function (req, res) {
    res.render('myTeam/teamDashboard/page_TeamDashboard', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/myteam/attendance-approvals', function (req, res) {
    res.render('myTeam/teamAttendanceApprovals/page_TeamAttendanceApprovals', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/myteam/wfh-approvals', function (req, res) {
    res.render('myTeam/teamWFHApprovals/page_TeamWFHApprovals', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/myteam/leave-approvals', function (req, res) {
    res.render('myTeam/teamLeaveApprovals/page_TeamLeaveApprovals', { baseUrl: process.env.BASE_URL, user: req.session.user });
});


router.get('/org/org-tree', function (req, res) {
    res.render('org/orgTree/page_OrgTree', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/me/my-leaves', function (req, res) {
    res.render('me/myLeaves/page_myLeaves', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

router.get('/employee-details', function (req, res) {
    res.render('empDetails/page_empDetails', { baseUrl: process.env.BASE_URL, user: req.session.user });
});





router.get('/extra', function (req, res) {
    res.render('extra/page_extra', { baseUrl: process.env.BASE_URL, user: req.session.user });
});

module.exports = router;
