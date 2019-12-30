var employeeTable = require('../model/employeeModel');
var util = require('./utilityController');
exports.authorizeUser = function (req, res) {
    employeeTable.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(employee => {
            if (employee == null) {
                res.send('NO user');
            }
            else {
                if (employee.password == req.body.password) {
                    req.session.loggedIn = true;
                    employee.getRole()
                        .then((role) => {
                            req.session.user = {
                                firstName: employee.firstName,
                                lastName: employee.lastName,
                                email: employee.email,
                                role: role.dataValues
                            }
                            res.redirect('/');
                        })
                }
                else {
                    res.send('pass NO')
                }
            }
        })

}

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/company/login');
}

exports.signup = function (req, res) {
    employeeTable
        .findAll({
            where: {
                email: req.body.email
            }
        })
        .then(users => {
            if (users.length == 0) {
                createUser();
            } else {
                res.send('User already exists');
            }
        });

    function createUser() {
        employeeTable
            .create({
                email: req.body.email,
                password: req.body.password,
                RoleId: req.body.role
            })
            .then(() => res.redirect('/company/login'));
    }
}
//          =====================
var registerModel = require("../model/companyModel");
var employeeRegister = require("../model/employeeModel");
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var crypto = require('crypto');
var passport = require('passport');
exports.validateDomain = function (req, res) {
    var companyUrl = req.body.domain + '.hrm.com';
    registerModel
        .findAll({
            where: {
                companyURL: companyUrl
            },
            raw: true
        }).then((company) => {
            console.log('validateDomain');
            console.log(company);
            if (company.length == 0) {
                res.send({ "data": "Domain Name is not registered", "message": "already Exist!", "registered": false });
            }
            else {
                res.cookie("company", company[0].company);
                res.cookie("companyId", company[0].id);
                if (company[0].logo == null) {
                    res.cookie("logo", '');
                }
                else {
                    res.cookie("logo", company[0].logo);
                }
                var mykey = crypto.createCipher('aes-128-cbc', 'encryptUrl');
                var encrptUrl = mykey.update(companyUrl, 'utf8', 'hex')
                encrptUrl += mykey.final('hex');
                res.send({ "registered": true, "domain": encrptUrl, "company": company.company });
            }
        })
}

exports.showLoginPage = function (req, res) {
    var mykey = crypto.createDecipheriv('aes-128-cbc', 'encryptUrl');
    var decryptUrl = mykey.update(req.query.domain, 'hex', 'utf8')
    decryptUrl += mykey.final('utf8');
    registerModel
        .findAll({
            where: {
                companyURL: decryptUrl
            },
            raw: true
        }).then((company) => {
            if (company.length != 0 && req.query.id != undefined) {
                employeeRegister
                    .update(
                        { activated: true },
                        { where: { id: req.query.id } }
                    )
                    .then((users) => {
                        res.render('logins/page_LoginWithDomain', { baseUrl: process.env.BASE_URL, companyUrl: company[0].company, logo: '' , user: req.session.user});
                    })
            }
            else {
                res.render('logins/page_LoginWithDomain', { baseUrl: process.env.BASE_URL, companyUrl: company[0].company, logo: '', user: req.session.user });
            }
        })

}

exports.login = function (req, res) {
    console.log("login user");
    console.log(req.body);
    console.log(req.user);
    console.log(req.session);
    var mykey = crypto.createDecipheriv('aes-128-cbc', 'encryptUrl');
    var decryptUrl = mykey.update(req.body.companyUrl, 'hex', 'utf8')
    decryptUrl += mykey.final('utf8');
    passport.authenticate('user', function (err, user, info) {
        console.log("step1-->");
        console.log(err);
        console.log(user);
        console.log(info);
        if (err) {
            console.log("step2-->");
            res.status(401).json(user);
            res.end();
        }
        else {
            console.log("step3-->");
            console.log(req.session.cookie);
            //console.log(req.session.cookie);
            if (req.body.remember_me && err == null) {
                console.log('inside remember_me');
                issueToken(user, function (err, token) {
                    if (err) {
                        console.log("error step3 -->");
                        console.log(err);
                    } else {
                        console.log("set cookie step3-->");
                        console.log(token);
                        res.cookie('remember_me', token, { path: '/', httpOnly: true, maxAge: 720000 });
                    }
                });
            }

            if (user) {
                var userDetail = user;
                req.logIn(userDetail, (err) => {
                    if (err) {
                        console.debug("--------2222-" + err);

                        try {
                            res.clearCookie('remember_me');
                            req.logout();
                            req.session.destroy((error) => {
                                if (error) {
                                    console.log('Error : Failed to destroy the session during logout.', err);
                                } else {
                                    req.user = null;
                                }
                            });
                        } catch (err) {
                            console.debug("--------3333-" + err);
                        }
                    } else {
                        console.debug("success step3--->" + info);
                    }
                });
            }
            else {
                console.log("step4 -->"+info);
            }
        }
    })(req, res);
}

function randomString(len) {
    var buf = []
        , chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
        , charlen = chars.length;

    for (var i = 0; i < len; ++i) {
        buf.push(chars[getRandomInt(0, charlen - 1)]);
    }

    return buf.join('');
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function issueToken(user, done) {
    console.log('user in auth');
    console.log(user);
    var token = randomString(64);
    if (Array.isArray(user)) {
        user = user[0];
    }
    saveRememberMeToken(token, user.id, function (err) {
        if (err) { return done(err); }
        console.log('saveRememberMeToken');
        console.log(token);
        return done(null, token);
    });
}

function saveRememberMeToken(token, uid, fn) {
    console.log('save remember me token in auth');
    tokens[token] = uid;
    console.log('tokens remember me');
    console.log(tokens);
    return fn();
}

exports.logout = function (req, res) {
    console.log('logout step1-->');
    res.clearCookie('remember_me');
    res.clearCookie('company');
    res.clearCookie('companyId');
    res.clearCookie('logo');
    console.log(req.user);
    req.logout();
    console.log('logout step2-->');
    console.log(req.user);
    req.session.destroy((error) => {
        if (error) {
            res.send('ERROR');
        } else {
            req.session = null;
            res.redirect('/');
        }
    });
}

exports.nocache = (req, res, next) => {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

//              ==================