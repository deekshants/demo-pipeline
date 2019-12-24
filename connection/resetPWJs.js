var nodemailer = require("nodemailer");
var EmailTemplate = require('email-templates');
var path = require("path");

var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // upgrade later with STARTTLS
  auth: {
    user: "",
    pass: ""
  }
});

const emailT = new EmailTemplate({
  transport: transporter,
  send: true,
  preview: false,
  views: {
    options: {
      extension: 'ejs'// <---- HERE          
    }
  }
});


exports.sendPasswordReset = function (email, username, domain, next) {
  emailT.send({
    template: "password",
    message: {
      from: 'demologin@athenalogics.com',
      to: email
    },
    locals: {
      name: username,
      token: domain,
    }
  }).then((data) => {
    if (data.accepted.length != 0) {
      next(false, data);
    }
    else {
      next(true, null);
    }
  })
    .catch(console.error);


};