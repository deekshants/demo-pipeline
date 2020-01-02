var sequelize = require("../config/sequelizeCon").sequelize;
var companyRegister = require("../model/companyModel");
var employeeRegister = require("../model/employeeModel");
var emailTemplate = require("../model/emailTemplateModel");
const passport = require('passport');
var replace = require("batch-replace");
var ValidatePassword = require('validate-password');
var bcrypt = require('bcrypt');
const cls = require('continuation-local-storage');
const namespace = cls.createNamespace('my-very-own-namespace');
var sendEmail = require('../connection/emailConfig');

var crypto = require('crypto');

var options = {
  enforce: {
    lowercase: true,
    specialCharacters: true,
    numbers: true
  }
};

var validator = new ValidatePassword(options);

exports.validateDomainforSignup = (req, res) => {
  var companyUrl = req.body.domain + '.hrm.com';
  companyRegister
    .findOne({
      where: {
        companyURL: companyUrl
      },
      raw: true
    })
    .then(company => {
      if (!company) {
        var mykey = crypto.createCipher('aes-128-cbc', 'encryptUrl');
        var encryptUrl = mykey.update(companyUrl, 'utf8', 'hex')
        encryptUrl += mykey.final('hex');
        res.send({ "domain": encryptUrl, "registered": false, "message": "Domain does not Exist!" });
      }
      else {
        res.send({ "domain": companyUrl, "registered": true, "message": "Domain already Exist!" });
      }
    })
    .catch(err => {
      console.log(err);

    });
}

exports.signUp = function (req, res) {
  let serverName = process.env.BASE_URL;
  console.log("SignUp Email");
  console.log(req.body.email);
  var signupEmail = req.body.email.toLowerCase();
  checkPassword(req.body.password, function (error, message) {
    console.log("checkPassword");
    console.log(error);
    console.log(message);
    if (error) {
      res.send({ "error": true, "message": message, "rollBackError": false, "passwordError": true });
      res.end();
    }
    else {
      var mykey = crypto.createDecipher('aes-128-cbc', 'encryptUrl');
      var decryptUrl = mykey.update(req.body.companyUrl, 'hex', 'utf8')
      decryptUrl += mykey.final('utf8');
      console.log("decryptUrl step-->");
      console.log(decryptUrl);
      bcrypt.hash(req.body.password, 12, function (err, encrypted) {
        return sequelize.transaction().then(function (t) {
          companyRegister
            .findOne({
              where: {
                companyURL: decryptUrl
              },
              raw: true
            }, { transaction: t }).then(function (company) {
              console.log("signup step2-->");
              console.log(company);
              if (company) {
                res.send({ "error": true, "message": "Domain already Registered!", "passwordError": false, "alreadyExist": true });
              } else {
                return companyRegister.create({
                  company: req.body.companyName,
                  companyURL: decryptUrl
                }, { transaction: t })
                  .then(function (insertedCompanyData) {
                    console.log(insertedCompanyData);
                    employeeRegister.create({
                      CompanyDetailId: insertedCompanyData.dataValues.id,
                      firstName: req.body.firstName,
                      lastName: req.body.lastName,
                      email: signupEmail,
                      password: encrypted,
                      RoleId: 1,
                      activated: false,
                      img: "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg"
                    },
                      { transaction: t })
                      .then(function (result) {
                        const dataObj = result.get({ plain: true })
                        console.log('dataObj');
                        console.log(dataObj);
                        var emailTemplatehtml = '';
                        return emailTemplate.findOne({
                          where: {
                            id: 1
                          },
                          raw: true
                        },
                          { transaction: t }).then(function (email) {
                            console.log('email --->');
                            console.log(email);
                            emailTemplatehtml = email.html;
                            if (email.id != null) {
                              var link = process.env.BASE_URL + '/company/login?domain=' + req.body.companyUrl + '&id=' + dataObj.id;
                              emailTemplatehtml = emailTemplatehtml.split('[userName]').join(dataObj.firstName + ' ' + dataObj.lastName);
                              emailTemplatehtml = emailTemplatehtml.split('[companyUrl]').join(decryptUrl);
                              emailTemplatehtml = emailTemplatehtml.split('[link]').join(link);
                              console.log('emailTemplatehtml step1 --->');
                              console.log(emailTemplatehtml);
                              const mailOptions = {
                                from: "demologin@athenalogics.com",
                                to: dataObj.email,
                                subject: 'welcome to HRM',
                                html: emailTemplatehtml
                              };
                              req.mailoptions = mailOptions;
                              return sendEmail.sendMail(mailOptions, res, function (error, info) {
                                if (error) {
                                  console.log('error in sending email');
                                  console.log(error);
                                  //return t.rollBack();
                                  return res.json({
                                    error: true,
                                    message: "There are Some Issues, Please Contact Admininstrator",
                                    rollBackError: true,
                                    passwordError: false
                                  })
                                } else {
                                  console.log('Message sent: ' + info.response);
                                  t.commit();
                                  return res.json({
                                    error: false,
                                    rollBackError: false
                                  })
                                }
                              });
                            } else {
                              console.log('email id is null');
                              //return t.rollBack();
                              return res.json({
                                error: true,
                                message: "There are Some Issues, Please Contact Admininstrator",
                                rollBackError: true,
                                passwordError: false
                              })
                            }
                          }).catch(function (err) {
                            //return t.rollback();
                            return res.json({
                              error: true,
                              message: "There are Some Issues, Please Contact Admininstrator",
                              rollBackError: true,
                              passwordError: false
                            })
                          });
                      }).catch(function (err) {
                        //return t.rollback();
                        return res.json({
                          error: true,
                          message: "There are Some Issues, Please Contact Admininstrator",
                          rollBackError: true,
                          passwordError: false
                        })
                      });
                  }).catch(function (err) {
                    //return t.rollback();
                    return res.json({
                      error: true,
                      message: "There are Some Issues, Please Contact Admininstrator",
                      rollBackError: true,
                      passwordError: false
                    })
                  });
              }
            }).catch(function (err) {
              //return t.rollback();
              return res.json({
                error: true,
                message: "There are Some Issues, Please Contact Admininstrator",
                rollBackError: true,
                passwordError: false
              })
            });

        });
      })
    }
  })
}

function checkPassword(password, fn) {
  var passwordData = validator.checkPassword(password);
  if (password.length < 8) {
    return fn(true, "password length minimum 8 required");
  } else if (passwordData.isValid == false) {
    return fn(true, passwordData.validationMessage);
  }
  return fn(false, null);
}

exports.signupEmployee = function (req, res) {
  var passwordData = validator.checkPassword(req.body.signupPassword);
  if (req.body.signupPassword.length < 8) {
    res.send({ "error": true, "validPass": false, message: "Minimum 8 letters" });
  }
  else if (passwordData.isValid == false) {
    res.send({ "error": true, "validPass": false, "message": passwordData.validationMessage });
  }
  else {
    console.log("signupEmployee step1--->");
    console.log(req.body);
    bcrypt.hash(req.body.signupPassword, 12, function (err, encrypted) {
      console.log("signupEmployee step2--->");
      console.log(encrypted);
      return sequelize.transaction().then(function (t) {
        employeeRegister
          .findOne({
            where: {
              email: req.body.signupEmail,
              CompanyDetailId: req.cookies.companyId
            },
            raw: true
          }, { transaction: t }).then(function (employee) {
            console.log("signupEmployee step3--->");
            console.log(employee);
            console.log(req.cookies.companyId);
            if (!employee) {
              employeeRegister
                .create({
                  CompanyDetailId: req.cookies.companyId,
                  email: req.body.signupEmail,
                  password: encrypted,
                  RoleId: 2,
                  activated: false,
                  img: "https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg"
                }, { transaction: t }).then((result) => {
                  console.log("signupEmployee step4--->");
                  console.log(result);
                  var adminEmail;
                  employeeRegister.findOne({
                    where: {
                      CompanyDetailId: result.dataValues.CompanyDetailId,
                      RoleId: 1
                    },
                    raw: true
                  }, { transaction: t }).then((admin) => {
                    if (admin) {
                      adminEmail = admin.email
                      const dataObj = result.get({ plain: true })
                      var html = '<html>' +
                        '<body>' +
                        '<div>' +
                        '<p>Hi,</br>' +
                        'Thank You! For Signup HRM.</br></br>' +
                        '<b>Please Click on link to activate account.</b></br></br>' +
                        '<a href="' + process.env.BASE_URL + '/company/login?domain=' + req.body.companyUrl + '&id=' + dataObj.id + '">' + process.env.BASE_URL + '/company/login?domain=' + req.body.companyUrl + '&id=' + dataObj.id + '</a>' +
                        '</br></br>' +
                        'Thanks' +
                        '</div>' +
                        '</body>' +
                        '</html>';
                      const mailOptions = {
                        from: "demologin@athenalogics.com",
                        to: adminEmail,
                        subject: 'welcome to HRM',
                        html: html
                      };
                      req.mailoptions = mailOptions;
                      sendEmail.sendMail(mailOptions, res, function (error, info) {
                        if (error) {
                          console.log('error in sending email');
                          console.log(error);
                          res.send({ "error": true, "emailExist": false, "rollBackError": true, "message": "There are Some Issues, Please Contact Admininstrator." });
                        } else {
                          console.log('Message sent: ' + info.response);
                          t.commit();
                          res.send({ "error": false, "emailExist": false, "message": "", "company": req.cookies.company });
                        }
                      });
                    } else {
                      res.send({ "error": true, "emailExist": false, "rollBackError": false, "message": "There are Some Issues, Please Contact Admininstrator." });
                    }
                  })
                    .catch(function (err) {
                      res.send({ "error": true, "emailExist": false, "rollBackError": true, "message": "There are Some Issues, Please Contact Admininstrator." });
                    })
                })
                .catch(function (err) {
                  res.send({ "error": true, "emailExist": false, "rollBackError": true, "message": "There are Some Issues, Please Contact Admininstrator." });
                });
            }
            else {
              res.send({ "error": true, "emailExist": true, "rollBackError": false, "message": "Email already Registered." });
            }
          })
          .catch(function (err) {
            res.send({ "error": true, "emailExist": false, "rollBackError": true, "message": "There are Some Issues, Please Contact Admininstrator." });
          });
      });
    })
  }

}
