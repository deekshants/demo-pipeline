const nodemailer = require('nodemailer');
var cron = require('node-cron');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'deeksharma02@gmail.com',
        pass: 'deekshant'
    }
  });
//   testmailforemail@tutanota.com
//   deekshant@123
exports.sendMail = (req, res, next) => {
    console.log('sendMail')
    console.log(req)
    return transporter.sendMail(req, function(error, info){
        if(error){
            next(error,null);
        }else{
            next(null,info);
        }
    });

};

cron.schedule('*/1 * * * *', (req,res) => {
    /*console.log('schedule');
    const mailOptions = {
        from: "demologin@athenalogics.com",
        to: "chetna.vadhyani@athenalogics.com",
        subject: 'welcome to HRM',
        html: "Hello"
      };
    //req.mailoptions = mailOptions;
    return transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log("send error");
            console.log(error);
        }else{
            console.log("send");
        }
    });*/
});