const passport = require('passport');
var sequelize = require("../config/sequelizeCon").sequelize;
const crypto = require('crypto');
var companyModel = require("../model/companyModel");
var employeeModel = require("../model/employeeModel");
var attendanceDetail = require("../model/attendanceModel");
var bcrypt = require('bcrypt');
const { Strategy: LocalStrategy } = require('passport-local');
const RememberMeStrategy = require('passport-remember-me').Strategy;
global.tokens = {}


passport.serializeUser((user, done) => {
  console.log('serialize user is ' + JSON.stringify(user));
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  console.log("deserializeUser Step1-->");
  console.log(user);
  if (Array.isArray(user)) {
    user = user[0];
  }
  findById(user.id, function (err, user) {
    console.log("deserializeUser Step2-->");
    console.log(user);
    done(err, user);
  });
});

function consumeRememberMeToken(token, fn) {
  console.log('consume remember me token');
  console.log(tokens);
  var uid = tokens[token];
  // invalidate the single-use token
  delete tokens[token];
  return fn(null, uid);
}

function findById(id, fn) {
  console.log('findById step1 -->' + id);
  if (id != undefined) {
    employeeModel.findAll({
      where: {
        id: id
      },
      raw: true
    }).then((employee) => {
      console.log("findById step2 -->");
      console.log(employee[0]);
      sequelize.query(
        'Select "id", "timeIn", "timeOut" FROM "AttendanceDetails" where "userId" = ' + id + ' order by "createdAt" desc limit 1;',
        { raw: false }
      ).then((displayRecord) => {
        console.log('company1 isAuthenticated--->>>');
        console.log(displayRecord[0][0]);
        if (displayRecord[0][0].id != undefined || displayRecord[0][0].id != null) {
          if (displayRecord[0][0].timeOut == null && displayRecord[0][0].timeIn != null) {
            console.log('displayRecord');
            console.log(displayRecord[0][0].timeIn);
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
      })

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
    var mykey = crypto.createDecipheriv('aes-128-cbc', 'encryptUrl');
    var decryptUrl = mykey.update(req.body.companyUrl, 'hex', 'utf8')
    decryptUrl += mykey.final('utf8');
    console.log("LocalStrategy");
    console.log(req.body);
    console.log(email);
    console.log(password);
    companyModel.
      findAll({
        where: {
          companyURL: decryptUrl
        },
        raw: true
      }).then((company) => {
        console.log("LocalStrategy step1 -- >");
        console.log(company[0])
        if (company.length != 0) {
          var domainName = company[0].companyURL;
          employeeModel.findAll({
            where: {
              email: email.toLowerCase(),
              companyId: company[0].id
            },
            raw: true
          }).then((user) => {
            console.log("LocalStrategy Step2 -- >");
            console.log(user);
            if (user.length != 0) {
              if (user[0].activated == false) {
                var info = {};
                info.userExist = true;
                info.activated = false;
                info.message = "Your Account is not Activated. Please check your email for Activation.";
                console.log(info);
                return done(null, user, info);
              }
              else {
                console.log("activated");
                bcrypt.compare(password, user[0].password, function (err, same) {
                  console.log("activated1");
                  console.log(same);
                  console.log(err);
                  if (same) {
                    req.session.loggedin = true;
                    req.session.domainName = domainName;
                    req.session.email = email.toLowerCase();
                    req.session.userid = user[0].id;
                    req.session.userType = user[0].userType;
                    var info = {};
                    info.userType = user[0].userType;
                    info.passwordCorrect = true;
                    console.log("LocalStrategy step2-->");
                    console.log(info);
                    return done(null, user, info);
                  }
                  else {
                    var info = {};
                    info.userType = user[0].userType;
                    info.passwordCorrect = false;
                    return done(null, null, info);
                  }
                });
              }
            }
            else {
              console.log("LocalStrategy Step3 -- >");
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
    console.log("isAuthenticated step1--->");
    console.log(req.user);
    res.redirect('/login');
  } else {
    console.log("isAuthenticated step2--->");
    console.log(req.user);
    companyModel.
      findAll({
        where: {
          id: req.user.companyId
        },
        raw: true
      }).then((company) => {
        if (company.length != 0) {
          console.log("company isAuthenticated--->>>");
          req.user.companyName = company[0].company;
          req.user.companyURL = company[0].companyURL;
          console.log('company2 isAuthenticated--->>>');
          console.log(req.user);

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
    console.log('inside remember me strategy')
    console.log(token);
    consumeRememberMeToken(token, function (err, uid) {
      if (err) { return done(err); }
      if (!uid) { return done(null, false); }
      console.log('uid ' + uid);
      console.log('consumeRememberMeToken --->');
      console.log(tokens);
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
  console.log('save remember me token in auth');
  tokens[token] = uid;
  console.log('tokens remember me');
  console.log(tokens);
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