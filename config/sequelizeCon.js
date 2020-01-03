var Sequelize = require('sequelize');

/* exports.sequelize = new Sequelize('postgres://rrixjzxtltkjpd:975f3678065314fff41158bb6e6aae9ffe9923d34fb34cdfc24e87e86b59f329@ec2-107-22-234-204.compute-1.amazonaws.com:5432/d3ftf5fm04o1pl');   */
console.log(':::'+process.env.DATABASE_URL);

exports.sequelize = new Sequelize(process.env.DATABASE_URL);  