var Sequelize = require("sequelize");
var sequelize = require("../config/sequelizeCon").sequelize;
var employees = require('./employeeModel');
var roles  = require('./roleModel');
var emailTemplates = require('./emailTemplateModel');
var Company = sequelize.define("CompanyDetails", {
  company: Sequelize.STRING,
  companyURL: Sequelize.STRING,
  logo:Sequelize.STRING
});

// ------- Associations ----------
Company.hasMany(roles, {as: 'Roles', constraints: false});
Company.hasMany(employees, {as: 'Employees', constraints: false});
Company.hasMany(emailTemplates, {as: 'emailTemplates', constraints: false});
Company.belongsTo(Company, {as: 'ParentCompany'});
sequelize.sync();
module.exports = Company; 