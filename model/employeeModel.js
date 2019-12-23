var Sequelize = require("sequelize");
var sequelize = require('../config/sequelizeCon').sequelize;
var roles = require('../model/roleModel');
var sequelizePaginate = require('sequelize-paginate');

var employee = sequelize.define("Employees", {
  firstName: Sequelize.STRING,
  lastName: Sequelize.STRING,
  email: Sequelize.STRING,
  password : Sequelize.STRING,
});
employee.belongsTo(roles, {as: 'Role', foreignKey: {allowNull: false} });
roles.hasMany(employee, {as: 'Employees'});
employee.belongsTo(employee, {as: 'ReportingManager', allowNull: true});
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