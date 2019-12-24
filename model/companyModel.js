var Sequelize = require("sequelize");
var sequelize = require("../config/sequelizeCon").sequelize;
var employees = require('./employeeModel');

var Company = sequelize.define("CompanyDetails", {
  company: Sequelize.STRING,
  companyURL: Sequelize.STRING,
  logo:Sequelize.STRING
});

Company.hasMany(employees, {as: 'Employees', constraints: false});
Company.belongsTo(Company, {as: 'ParentCompany'});
sequelize.sync();
module.exports = Company; 