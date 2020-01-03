var sequelize = require("../config/sequelizeCon").sequelize;

exports.showOrgStructure = function(req, res){
    console.log("showOrgStructure");
    //console.log(req);
    //console.log(req.cookies);
    sequelize.query(
        'with recursive "employee_recursive" as'+
        '( select "id", "firstName", "ReportingManagerId" , "jobTitle", "department", "location", "img", 0 as level from "EmployeeDetails" where "ReportingManagerId" is NULL AND "CompanyDetailId" = '+req.user.CompanyDetailId+ 
        ' union all '+
        'select e."id", e."firstName", e."ReportingManagerId", e."jobTitle", e."department", e."location", e."img", level+1 from "employee_recursive" p join "EmployeeDetails" e on e."ReportingManagerId" = p.id) '+
        'select "id", "ReportingManagerId", "firstName", "jobTitle", "img", "location", "department", "level" from "employee_recursive";',
        {raw:false}
    ).then((displayRecord) => {
        var displayData = displayRecord[0];
        for(i=0; i < displayData.length; i++){
            if(displayData[i].img == ''){
                displayData[i].img = 'https://raw.githubusercontent.com/bumbeishvili/Assets/master/Projects/D3/Organization%20Chart/general.jpg';
            }
            if(req.user.id == displayData[i].id){
                displayData[i].isLoggedUser = true;
            }
            else{
                displayData[i].isLoggedUser = false;
            }
        }
        console.log('displayData--->');
        console.log(displayData);
        res.status(200).send(displayData);
        res.end();
    }).catch((err) =>{
        console.log(err);
        console.log('error');
    })
}


