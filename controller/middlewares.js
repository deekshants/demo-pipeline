
// check if user is logged in and has access to url
exports.checkLogin = function (req, res, next) {
    if (req.session.loggedIn) {
        checkAccess(req, res, next);
    }
    else {
        if (allowedUrls.includes(req.originalUrl.split('?')[0])) {
            next();
        }
        else {
            res.redirect('/login');
        }
    }
}
function checkAccess(req, res, next) {
    console.log('SESSION::::');

    console.log(req.session);

    if (req.session.user.role.cannotAccess.includes(req.originalUrl)) {
        res.send('Restricted');
    }
    else {
        next();
    }
}

exports.noCache = function (req, res, next) {
    if (!allowedUrls.includes(req.originalUrl.split('?')[0])) {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
    }
    next()
}

// catch 404 and forward to error handler
exports.errorHandler404 = function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
}

// production error handler
// no stacktraces leaked to user
exports.productionErrorHandler = function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
}

// development error handler
// will print stacktrace
exports.developmentErrorHandler = function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: err
    });
}

var allowedUrls = [
    '/company/login',
    '/login',
    '/signup',
    '/signup-step2',
    '/validateDomain',
    '/validateDomainforSignup',
    '/adminRegisteration',
    '/loginUser',
    '/employeeRegisteration',
    '/resetPassword',
    '/createNewPassword',
    '/create-password',
    '/loginAuth',
    '/company/signup',
    '/signupUser',
    '/reset-password'
];