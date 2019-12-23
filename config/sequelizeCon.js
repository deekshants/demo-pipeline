var Sequelize = require('sequelize');

exports.sequelize = new Sequelize('postgres', 'postgres', 'deeksh123', {
    host: 'localhost',
    dialect: 'postgres'
});