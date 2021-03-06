var logs = require('../model/logsModel');
var employeeTable = require('../model/employeeModel');
var roles = require('../model/roleModel');
const Op = require('sequelize').Op

exports.addNotification = function (notificationJson) {
    logs.create({
        notificationJson
    })
}

exports.testApi = function (req, res) {
    console.log('::::::::' + JSON.stringify(req.query));
    res.send(':::::::::' + JSON.stringify(req.query));
}

exports.getNotifications = function (req, res) {
    employeeTable.findOne({
        where: [{ email: req.user.email }, {CompanyDetailId: req.user.CompanyDetailId}]
    }).then((employee) => {
        employee.getNotificationLogs({ where: { isNew: true } })
            .then((notif) => {
                res.send(notif);
            })


    })
}

exports.noCache = function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
}

//  --------- TO BE PLACED IN ROLES CONTROLLER LATER -----------
/* exports.getRolesTable = async function (req, res) {
    var data = req.query;
    const { docs, pages, total } = await roles.paginate({
        page: data.pageNumber,
        paginate: data.recPerPage,
        order: [[(data.orderBy) ? data.orderBy: 'id', (data.orderHow) ? data.orderHow : 'asc']],
        where: {
            roleName: { [Op.substring]: (data.searchString) ? data.searchString : '' }
        }
    });
    res.send(JSON.stringify(docs));
} */