const passport = require('passport');
var sequelize = require("../config/sequelizeCon").sequelize;
const crypto = require('crypto');
var companyModel = require("../model/companyModel");
var employeeModel = require("../model/employeeModel");
var roleModel = require('../model/roleModel');
var attendanceDetail = require("../model/attendanceModel");
var bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const RememberMeStrategy = require('passport-remember-me').Strategy;
global.tokens = {}


passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  if (Array.isArray(user)) {
    user = user[0];
  }
  findById(user.id, function (err, user) {
    done(err, user);
  });
});

function consumeRememberMeToken(token, fn) {
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function findById(id, fn) {
  if (id != undefined) {
    employeeModel.findAll({
      where: {
        id: id
      },
      raw: true
    }).then((employee) => {
      /*sequelize.query(
        'Select "id", "timeIn", "timeOut" FROM "AttendanceDetails" where "userId" = ' + id + ' order by "createdAt" desc limit 1;',
        { raw: false }
      ).then((displayRecord) => {
        if (displayRecord[0][0].id != undefined || displayRecord[0][0].id != null) {
          if (displayRecord[0][0].timeOut == null && displayRecord[0][0].timeIn != null) {
            employee[0].timeIn = displayRecord[0][0].timeIn;
            employee[0].timeOut = '';
          }
          else if (displayRecord[0][0].timeOut != null && displayRecord[0][0].timeIn != null) {
            employee[0].timeIn = displayRecord[0][0].timeIn;
            employee[0].timeOut = displayRecord[0][0].timeOut;
          }
          else {
            employee[0].timeIn = '';
            employee[0].timeOut = '';
          }
        }
      })*/

      if (employee[0].id == undefined) {
        fn(true, null);
      }
      else {
        fn(false, employee[0]);
      }
    })
  }
  else {
    fn(false, null);
  }
}

passport.use('user', new LocalStrategy({ usernameField: 'email', passReqToCallback: true },
  function (req, email, password, done) {
    var mykey = crypto.createDecipher('aes-128-cbc', 'encryptUrl');
    var decryptUrl = mykey.update(req.body.companyUrl, 'hex', 'utf8')
    decryptUrl += mykey.final('utf8');
    companyModel.
      findAll({
        where: {
          companyURL: decryptUrl
        },
        raw: true
      }).then((company) => {
        if (company.length != 0) {
          var domainName = company[0].companyURL;
          employeeModel.findAll({
            where: {
              email: email.toLowerCase(),
              CompanyDetailId: company[0].id
            }
          }).then((user) => {
            if (user.length != 0) {
              if (user[0].activated == false) {
                var info = {};
                info.userExist = true;
                info.activated = false;
                info.message = "Your Account is not Activated. Please check your email for Activation.";
                return done(null, user, info);
              }
              else {
                
                bcrypt.compare(password, user[0].password, function (err, same) {
                  if (same) {
                    req.session.loggedIn = true;
                    req.session.domainName = domainName;
                    
                    user[0].getRole()
                    .then((role) => {
                      console.log(role);
                      req.session.user = {
                        email: email.toLowerCase(),
                        userId: user[0].id,
                        role: role.dataValues,
                        firstName: user[0].firstName,
                        lastName: user[0].lastName
                      }
                      console.log(':::::::::');
                      console.log(req.session);
                      var info = {};
                      info.userType = user[0].role;
                      info.passwordCorrect = true;
                      return done(null, user, info);
                    
                    })
                  }
                  else {
                    var info = {};
                    info.userType = user[0].role;
                    info.passwordCorrect = false;
                    return done(null, null, info);
                  }
                });
              }
            }
            else {
              var info = {};
              info.userExist = false;
              info.message = "Email is Incorrect.";
              return done(null, user, info);
            }

          })
        }
      })
  }));

exports.isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated()) {
    res.redirect('/login');
  } else {
    companyModel.
      findAll({
        where: {
          id: req.user.CompanyDetailId
        },
        raw: true
      }).then((company) => {
        if (company.length != 0) {
          req.user.companyName = company[0].company;
          req.user.companyURL = company[0].companyURL;

          var userDetail = [];
          userDetail.push(req.user);
          req.logIn(userDetail, (err) => {
            if (err) {
              console.debug("--------2222-" + err);

              try {
                res.clearCookie('remember_me');
                req.logout();
                req.session.destroy((error) => {
                  if (error) {
                    res.redirect("/");
                  } else {
                    req.user = null;
                    res.redirect("/");
                  }
                });
              } catch (err) {
                console.debug("--------3333-" + err);
                res.redirect("/");
              }
            } else {

              console.debug("success step3--->");
              console.log(userDetail);
              return next();
            }
          });
        }
      });
  }
}

passport.use(new RememberMeStrategy(
  function (token, done) {
    consumeRememberMeToken(token, function (err, uid) {
      if (err) { return done(err); }
      if (!uid) { return done(null, false); }
      findById(uid, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }
        return done(null, user);
      });
    });
  },
  issueToken
));

function issueToken(user, done) {
  var token = randomString(64);
  saveRememberMeToken(token, user.id, function (err) {
    if (err) { return done(err); }
    return done(null, token);
  });
}

function saveRememberMeToken(token, uid, fn) {
  tokens[token] = uid;
  return fn();
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