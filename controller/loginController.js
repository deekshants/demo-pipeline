var employeeTable = require('../model/employeeModel');
var util = require('./utilityController');
exports.authorizeUser = function (req, res) {
    employeeTable.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(employee => {
            if (employee == null) {
                res.send('NO user');
            }
            else {
                if (employee.password == req.body.password) {
                    req.session.loggedIn = true;
                    employee.getRole()
                        .then((role) => {
                            req.session.user = {
                                firstName: employee.firstName,
                                lastName: employee.lastName,
                                email: employee.email,
                                role: role.dataValues
                            }
                            res.redirect('/');
                        })
                }
                else {
                    res.send('pass NO')
                }
            }
        })
    
}

exports.logout = function (req, res) {
    req.session.destroy();
    res.redirect('/company/login');
}

exports.signup = function (req, res) {
    employeeTable
        .findAll({
            where: {
                email: req.body.email
            }
        })
        .then(users => {
            if (users.length == 0) {
                createUser();
            } else {
                res.send('User already exists');
            }
        });

    function createUser() {
        employeeTable
            .create({
                email: req.body.email,
                password: req.body.password,
                RoleId: req.body.role
            })
            .then(() => res.redirect('/company/login'));
    }
}
