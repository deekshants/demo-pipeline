var Sequelize = require("sequelize");
var sequelize = require("../config/sequelizeCon").sequelize;
var Company = require('./companyModel');

var email = sequelize.define("EmailTemplate", {
  html: Sequelize.TEXT
});
email.belongsTo(Company, {as: 'EmailTemplates'});
sequelize.sync();
module.exports = email;
