var sequelize = require('../config/sequelizeCon').sequelize;
var Sequelize = require('sequelize');
var sequelizePaginate = require('sequelize-paginate');

var roles = sequelize.define('Roles', {
    roleName: {type: Sequelize.STRING},
    canView: {type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: ['']},
    canViewAndEdit: {type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: ['']},
    cannotAccess: {type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: ['']},
});

sequelizePaginate.paginate(roles);
sequelize.sync();
module.exports = roles;

/* roles.create({
    roleName: 'admin',
    canView: ['widgets', 'wid1', 'wid2', 'wid3', 'admin', 'companySettings', 'leaveAndHolidays', 'approvalNotification', 'employeeSettings', 'jobTitles', 'departments', 'employeeDefaults', 'employeeNumber', 'documents', 'noticePeriods', 'onboardingAndExit', 'attendance', 'workShifts', 'weekOffs', 'timeTrackingPolicies', 'workFromHome', 'otPolicies', 'ipNetworks', 'rolesAndPermissions', 'myTeam', 'organization', 'dashboard', 'employees', 'orgStructure', 'exitDetails', 'documents', 'engage', 'assets', 'helpdesk', 'projects'],
    canViewAndEdit: ['admin' ,'attendance', 'org']
});
roles.create({
    roleName: 'developer',
    canView: ['widgets', 'wid1', 'wid2'],
    canViewAndEdit: [''],
});
roles.create({
    roleName: 'manager',
    canView: ['widgets', 'wid1', 'wid2', 'wid3', 'admin', 'companySettings', 'leaveAndHolidays', 'empoyeeSettings', 'jobTitles', 'departments', 'employeeDefaults', 'documents', 'onboardingAndExit', 'attendance', 'workShifts', 'weekOffs', 'timeTrackingPolicies', 'workFromHome', 'otPolicies', 'myTeam', 'organization', 'dashboard', 'employees', 'orgStructure', 'exitDetails', 'documents', 'engage', 'assets', 'helpdesk', 'projects'],
    canViewAndEdit: [''],
}); */
