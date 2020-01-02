var companyModel = require("../model/companyModel");
var employeeRegister = require("../model/employeeModel");
const passport = require('passport');
var bcrypt = require('bcrypt');
var ValidatePassword = require('validate-password');
var email =require('../connection/resetPWJs');
var crypto = require('crypto');

var options = {
  enforce: {
      lowercase: true,
      specialCharacters: true,
      numbers: true
  }
};

var validator = new ValidatePassword(options);

exports.sendResetPasswordMail = (req,res) => {
    employeeRegister
    .findAll({  
        where: {
          CompanyDetailId: req.cookies.companyId,
            email: req.body.email
        },
        raw:true
      }).then((company) => {
        console.log('sendResetPasswordMail');
        console.log(company);
            if(company.length == 0){
                res.send({"emailExist":false,"message":"Please Enter Valid Email"});                
            }
            else{
                if(company[0].activated){
                    var token= "http://localhost:8080/create-password?domain="+req.body.domain+"&id="+company[0].id;
                    var name= (company[0].lastName != null) ? company[0].firstName+' '+company[0].lastName : "";
                    email.sendPasswordReset(req.body.email, name, token,function(error, info) {
                        if (error) {                
                          res.send({"emailExist":true, "activated":true, "message":"There is some issue. Please Contact Administrator"});
                        } else {
                          res.send({"emailExist":true, "activated":true, "message":"Email Exist"});
                        }
                      });
                }
                else{
                  res.send({"emailExist":true, "activated":false, "message":"Your Account is not activated. Please check mail and activate account"});
                }
                
            }
      })
    
}

exports.showPasswordPage = (req, res) =>{
  console.log("showPasswordPage");
  console.log(req.query.domain);
  var mykey = crypto.createDecipher('aes-128-cbc', 'encryptUrl');
  var decryptUrl = mykey.update(req.query.domain, 'hex', 'utf8')
  decryptUrl += mykey.final('utf8');
  res.render('resetPass/page_CreatePass', {baseUrl: process.env.BASE_URL, domain: decryptUrl, encryptedURL: req.query.domain});
}

exports.createNewPassword = (req, res) =>{
    console.log("createNewPassword");  
    console.log(req.body);
    console.log(req.cookies);

    var passwordData = validator.checkPassword(req.body.newPassword);
    if(req.body.newPassword.length < 8){
        res.send({"error":true,"message":"password length minimum 8 required"});
        res.end();
    }else if(passwordData.isValid == false){
        res.send({"error":true,"message":passwordData.validationMessage});
        res.end();
    }

    bcrypt.hash(req.body.newPassword, 12, function(err, encrypted) {
      employeeRegister
        .update(
          {password : encrypted},
          {returning : true,
            where : {CompanyDetailId: req.cookies.companyId}}
        )
        .then((users) => {
          console.log("users createNew Password");
          console.log(users);
                if (users[0].length != 0) {
                  res.send({"error" : false, "message":"Password updated successfully!"});
                }
                else{
                  res.send({"error" : true, "message":"There is some issue. Please contact Administrator"});
                }
        })  
        });
}