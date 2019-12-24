var Sequelize = require("sequelize");
var sequelize = require('../config/sequelizeCon').sequelize;

var Attendance = sequelize.define("AttendanceDetail", {
  Date: Sequelize.STRING,
  timeIn: Sequelize.STRING,
  timeOut: Sequelize.STRING,
  totalHours: Sequelize.STRING,
  log: Sequelize.STRING
});

sequelize.sync();
module.exports = Attendance;
