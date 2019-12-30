var Sequelize = require("sequelize");
var sequelize = require('../config/sequelizeCon').sequelize;
var logs = require('../model/logsModel');
var sequelizePaginate = require('sequelize-paginate');
var attendance = require('./attendanceModel');

var employee = sequelize.define("EmployeeDetails", {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password : Sequelize.STRING,
  userType : Sequelize.STRING,
  department : Sequelize.STRING,
  location : Sequelize.STRING,
  img :  Sequelize.STRING,
  jobTitle : Sequelize.STRING,
  activated : Sequelize.BOOLEAN 
});

// ------- Associations ----------
employee.hasMany(logs, { as: 'NotificationLogs', constraints: false, foreignKey: { allowNull: false } });
employee.belongsTo(employee, {as: 'ReportingManager', allowNull: true});
employee.hasMany(attendance, {as: 'Attendance'});
sequelize.sync();

sequelizePaginate.paginate(employee);

module.exports = employee;



/* employee.create({
  firstName: 'Deekshant',
  lastName: 'Sharma',
  email: 'deek@gmail.com',
  password: '121212',
  RoleId: '1'
})
employee.create({
  firstName: 'Jhon',
  lastName: 'Doe',
  email: 'dev@gmail.com',
  password: '111',
  RoleId: '2'
});
employee.create({
  firstName: 'Manager',
  lastName: 'Nig',
  email: 'manager@gmail.com',
  password: '1111',
  RoleId: '3'
}); */