var Sequelize = require("sequelize");
var sequelize = require('../config/sequelizeCon').sequelize;
var employee = require('./employeeModel');
var sequelizePaginate = require('sequelize-paginate');

var logs = sequelize.define('Logs', {
    title: Sequelize.STRING,
    details: Sequelize.STRING,
    imgUrl: Sequelize.STRING,
    onClickLink: Sequelize.STRING,
    isNew: Sequelize.BOOLEAN
});

sequelizePaginate.paginate(logs);

sequelize.sync();

/* logs.create({
    title: 'Leave Approved',
    details: 'Leave applied by you has been approved by Hemant Sen.',
    imgUrl: 'https://s3.amazonaws.com/uifaces/faces/twitter/calebogden/128.jpg',
    onClickLink: '/me/my-leaves',
    isNew: true,
    EmployeeId: 1
}); */

module.exports = logs;