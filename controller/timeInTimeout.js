var sequelize = require("../config/sequelizeCon").sequelize;
var registerModel = require("../model/companyModel");
var employeeRegister = require("../model/employeeModel");
var attendanceDetail = require("../model/attendanceModel");

let moment = require("moment-timezone");

exports.getTimeInfo = function(req, res){  
    console.log('getTimeinfo step1---->'); 
    console.log(req.user);
    let now = moment();    
    let dateFormatted = now.format("h:mm a");
    console.log("getTimeinfo step2---->");
    console.log(now.format());
    console.log(dateFormatted);
    console.log(moment.tz.guess());
    var utctime = moment.utc(now.format()).format();
    console.log("getTimeinfo step3---->");
    console.log(utctime); 
    console.log(req.user.id);
    console.log(now.format('YYYY-MM-DD'));
    console.log(utctime);
    console.log("userId");
    console.log(req.user);
    attendanceDetail
    .create({
        userId : req.user[0].id,
        Date : now.format('YYYY-MM-DD'),
        timeIn : utctime        
    }).then((detail) =>{
        console.log("getTimeinfo step4---->");
        console.log(detail);
    });
    
    // var local_date= moment.utc(utctime).local().format('YYYY-MM-DD HH:mm:ss');
    // console.log('local_date');
    // console.log(local_date);
    // console.log(new Date(utctime).toUTCString());
     res.send({"currentTime":dateFormatted});
     res.end();
}

exports.getTimeOutInfo = function(req, res){   
    console.log('getTimeOutInfo step1---->'); 
    console.log(req.user);
    let now = moment();    
    let dateFormatted = now.format("h:mm a");
    console.log("getTimeinfo step2---->");
    console.log(now.format());
    console.log(dateFormatted);
    console.log(moment.tz.guess());
    var utctime = moment.utc(now.format()).format();
    console.log("getTimeinfo step3---->");
    console.log(utctime); 
    console.log(req.user.id);
    console.log(now.format('YYYY-MM-DD'));
    console.log(utctime);

    sequelize.query(
        'Select "id", "timeIn" FROM "AttendanceDetails" where "userId" = '+ req.user[0].id +' order by "createdAt" desc limit 1;',
        {raw:false}
    ).then((displayRecord) => {
        console.log("displayRecord");
        console.log(displayRecord[0][0]);
        var start_date = moment(displayRecord[0][0].timeIn, 'YYYY-MM-DD HH:mm:ss');
        var end_date = moment(utctime, 'YYYY-MM-DD HH:mm:ss');
        var duration = moment.duration(end_date.diff(start_date));
        /*var timeDiff = moment(localTimeOut).diff(moment(localTiemIn));
        var totalHour = moment(timeDiff).format('HH:mm:ss');*/
        console.log("totalHour");
        console.log(convertMS(duration._milliseconds));
        attendanceDetail
        .update(
            { timeOut : utctime ,
              totalHours : convertMS(duration._milliseconds)},
            { returning : true,
            where: { id : displayRecord[0][0].id }},
            {raw : false}
        ).then((data) => {
            console.log("response");
            console.log(data);
            console.log(data[1][0].dataValues);
            res.send({"currentTime":dateFormatted});
        })
    })

    // var local_date= moment.utc(utctime).local().format('YYYY-MM-DD HH:mm:ss');
    // console.log('local_date');
    // console.log(local_date);
    // console.log(new Date(utctime).toUTCString());
}

function convertMS(ms) {
    var d, h, m, s;
    s = Math.floor(ms / 1000);
    m = Math.floor(s / 60);
    s = s % 60;
    h = Math.floor(m / 60);
    m = m % 60;
    d = Math.floor(h / 24);
    h = h % 24;
    h += d * 24;
    return h + ':' + m + ':' + s;
}