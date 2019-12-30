/*--------------start function------------------*/




$(document).ready(function () {
    getNotifications();
    activeSideMenuParentLink();
    activeSideMenuChildLink();
    InitRadioExtraView();
    InitCheckboxExtraView();
    singleDonutChart();
    multiValDonutChart();
});
$('[hm-hook="click"]').click(function (e) {
    var hmFn = $(e.target).closest('[hm-action]').attr('hm-action');
    window[hmFn]();
});

$('[data-toggle="tooltip"]').tooltip();

$('.datepicker').datetimepicker({
    format: 'DD/MM/YYYY',
    icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
    }
});

$('.timepicker').datetimepicker({
    format: 'LT',
    icons: {
        time: "fa fa-clock-o",
        date: "fa fa-calendar",
        up: "fa fa-chevron-up",
        down: "fa fa-chevron-down",
        previous: 'fa fa-chevron-left',
        next: 'fa fa-chevron-right',
        today: 'fa fa-screenshot',
        clear: 'fa fa-trash',
        close: 'fa fa-remove'
    }
});

/*------------------------------------loder js -----------------------------------*/
function showLoader(Id) {
    $(Id).removeClass('hide');
}
function hideLoader(Id) {
    $(Id).addClass('hide');
}


/*------------------------------------tost js -----------------------------------*/
function showToast(option) {
    var wrapper = $(option.eleWrapper);
    var toast = createToast(option);
    toast = $(toast).hide().fadeIn(750);
    if (option.autoClose) {
        var outTime = option.autoCloseTime || 3500;
        if (outTime < 1000) {
            outTime = 1000;
        }
        var watch = setTimeout(function () {
            toast.animate({ 'margin-top': '-50px', 'opacity': '0' }, 500, function () {
                this.remove();
                if (option.afterClose) {
                    option.afterClose();
                }
            })
        }, outTime);
    }

    $(wrapper).on('click', '.hm-close', function () {
        $(this).closest('.hm-toast').remove();
        //clearTimeout(watch);
        if (option.afterClose) {
            option.afterClose();
        }
    });

    $(wrapper).append(toast);
    if (option.afterShow) {
        option.afterShow();
    }
}

function createToast(option) {
    var final = toastCaseValidation(option);
    var html = `
    <div class="hm-toast hm-theme-`+ (option.theme).toLowerCase() + `">
    <div class="hm-toast-inner">                
    <div class="hm-toast-icons">
    `+ final.icon + `
    </div>
    <div class="hm-toast-msg">
    `+ final.msg + `
    </div>
    <div class="hm-toast-action">
    `+ final.close + `
    </div>
    </div>
    </div>`;
    return html;
}

function toastCaseValidation(option) {
    var finalOption = {};
    var toastmsg;
    var themeIco;
    var closeBtn = '<button type="button" class="hm-close">&#10006;</button>';
    switch (option.theme) {
        case 'error':
            themeIco = '<svg aria-hidden="true" focusable="false"  xmlns="http://www.w3.org/2000/svg" width="1.875em" height="1.875em" viewBox="0 0 30 30"> <circle fill="none" stroke="#fff" stroke-width="2"  cx="50%" cy="50%" r="13" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.9s" /> </circle> <line fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"  x1="10.5" y1="10.5" x2="19.5" y2="19.5" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="4s" /> </line> <line fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round"  x1="19.5" y1="10.5" x2="10.5" y2="19.5" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="4s" /> </line> </svg>';
            break;
        case 'success':
            themeIco = '<svg aria-hidden="true" focusable="false"  xmlns="http://www.w3.org/2000/svg" width="1.875em" height="1.875em" viewBox="0 0 30 30"> <circle fill="none" stroke="#fff" stroke-width="2" cx="50%" cy="50%" r="13" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.9s" /> </circle> <polyline fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" points="8,17 13,21 22,10" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="4s" /> </polyline> </svg>';
            break;
        case 'warning':
            themeIco = '<svg aria-hidden="true" focusable="false"  xmlns="http://www.w3.org/2000/svg" width="1.875em" height="1.875em" viewBox="0 0 30 30" > <path  d="M 13 2 Q 15,0 17,2 L 26,23 Q 26,26 23,26 L 6,26 Q 2,26 3,22 L 13,2" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="0.9s" /> </path> <line  fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" x1="15" y1="9" x2="15" y2="17" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="5s" /> </line> <line  fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" x1="15" y1="21" x2="15" y2="22" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="5s" /> </line> </svg>';
            break;
        default:
            themeIco = '<svg aria-hidden="true" focusable="false"  xmlns="http://www.w3.org/2000/svg" width="1.875em" height="1.875em" viewBox="0 0 30 30"> <circle fill="none" stroke="#fff" stroke-width="2" cx="50%" cy="50%" r="13" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset" from="100" to="0" dur="0.9s" /> </circle> <line fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" x1="15" y1="9" x2="15" y2="9" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="6s" /> </line> <line fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" x1="15" y1="15" x2="15" y2="22" stroke-dasharray="100"> <animate attributeName="stroke-dashoffset"  from="100" to="0" dur="6s" /> </line> </svg>';
    }
    if (option.closeButton == false) {
        closeBtn = '';
    }

    if (option.msg == undefined) {
        toastmsg = 'No Message';
    }
    else {
        if (option.msg.length != 1 && typeof option.msg === "object") {
            toastmsg = '<ul>';
            option.msg.forEach(function (val, index) {
                toastmsg = toastmsg + '<li>' + val + '</li>';
            });
            toastmsg = toastmsg + '</ul>';
        }
        else {
            toastmsg = option.msg;
        }
    }
    finalOption.icon = themeIco;
    finalOption.close = closeBtn;
    finalOption.msg = toastmsg;
    return finalOption;
}

/*------------------------------------hmtab js -----------------------------------*/
function hmTab() {
    var tabNav = $(event.target).closest('.hm-tab-nav-wrapper');
    var tab = $(event.target).closest('.hm-tab-link').attr('hmtab');
    var tabContents = $('[hmtab=' + tab + '].hm-tab-content').closest('.hm-tab-content-wrapper');
    $('>.hm-tab-content', tabContents).removeClass('active');
    $('>.hm-tab-link', tabNav).removeClass('active');
    $('[hmtab=' + tab + '].hm-tab-content').addClass('active');
    $('[hmtab=' + tab + '].hm-tab-link').addClass('active');
}

/*------------------------------------sidemenu js -----------------------------------*/
function hmSideMenuLink() {
    var link = $(event.target).closest('.hm-side-menu-link').attr('hm-link');
    if (link) {
        window.location.href = link;
    }
    var parent = $(event.target).closest('.hm-side-menu-outer');
    $('.hm-side-menu-link', parent).removeClass('focus');
    $(event.target).closest('.hm-side-menu-link').addClass('focus');
}

function activeSideMenuParentLink() {
    var path = location.pathname;
    if (path === "/") {
        $('[hm-url="/"]').addClass('active');
    }
    else {
        var parent = path.split('/')[1];
        var ele = '[hm-url="' + parent + '"]'
        $(ele).addClass('active');
    }
}
function activeSideMenuChildLink() {
    $('.hm-side-menu-outer .hm-side-submenu-item').removeClass('active');
    var path = location.pathname;
    var ele = $('.hm-side-menu-outer [href="' + path + '"]');
    $(ele).addClass('active');
}





/*------------------------------------side panel js -----------------------------------*/
function openSidePanel(id) {
    $(id).fadeIn(100).promise().then(function () {
        $(id).addClass('active');
        $('body').css('overflow', 'hidden');
    });
}

function closeSidePanel(id) {
    $(id).removeClass('active');
    $(id).hide();
    $('body').css('overflow', 'auto');
}

/*------------------------------------wizard js -----------------------------------*/

function hmWizardDirectStep() {
    var eleCurrent = $(event.target).closest('.hm-wizard-step');
    var currentStep = eleCurrent.attr('hm-step');
    var parent = eleCurrent.closest('.hm-wizard-wrapper').attr('id');
    var parent = '#' + parent;
    hmWizardJumpStep({
        wrapperId: parent,
        step: currentStep
    });
}

function hmWizardJumpStep(option) {
    var stepCount = $(option.wrapperId + " .hm-wizard-step-wrapper").first().find('[hm-step="' + option.step + '"]');
    var stepContent = $(option.wrapperId + " .hm-wizard-content-wrapper").first().find('[hm-step-content="' + option.step + '"]');
    $(option.wrapperId + " .hm-wizard-step-wrapper").first().find('.hm-wizard-step').removeClass('active');
    $(option.wrapperId + " .hm-wizard-step-wrapper").first().find('.hm-wizard-step').removeClass('done');
    $(option.wrapperId + " .hm-wizard-content-wrapper").first().find('.hm-step-content').removeClass('active');
    $(stepCount).addClass('active');
    $(stepContent).addClass('active');
    if ($(option.wrapperId).hasClass('hm-wizard-with-mark-done')) {
        $(stepCount).prevAll().addClass('done');
    }
}

/*------------------------------------extra view radio checkbox js -----------------------------------*/
function InitRadioExtraView() {
    var view = $('[hm-watch="radio"]:checked').attr('hm-extra-view');
    $(view).removeClass('hide');
    $('[hm-watch="radio"]').change(function () {
        radioExtraView();
    });
}
function radioExtraView() {
    var name = $(event.target).attr('name');
    $('[name="' + name + '"]').each(function () {
        var otherView = $(this).attr('hm-extra-view');
        if (otherView) {
            $(otherView).addClass('hide');
        }
    });

    var currentView = $('[name="' + name + '"]:checked').attr('hm-extra-view');
    $(currentView).removeClass('hide');
}

function InitCheckboxExtraView() {
    var view = $('[hm-watch="checkbox"]:checked').attr('hm-extra-view');
    $(view).removeClass('hide');
    $('[hm-watch="checkbox"]').change(function () {
        checkboxExtraView();
    });
}
function checkboxExtraView() {
    var view = $(event.target).attr('hm-extra-view');
    if ($(event.target).is(':checked')) {
        $(view).removeClass('hide');
    }
    else {
        $(view).addClass('hide');
    }
}

/* -------------Get Notifications------------------ */

function getNotifications() {
    $.ajax({
        url: '/getNotifications',
        cache: false,
        dataType: 'json',
        success: appendNotifications,
        error: (error)=> console.log('Notification Error: '+error)
    })

    function appendNotifications(notifications) {
        if (notifications.length > 0) {
            $('.notification-badge').show();
        }
        notifications.forEach((notif)=>{
            $('.notification-dropdown')
            .append(`<a href="${notif.onClickLink}"><div class="hm-grid-inline">
                        <div class="pr-2">
                            <img class="hm-name-circle" src="${notif.imgUrl }" height="32">
                        </div>
                        <div class="hm-col hm-text-height-normal hm-tpd-2">
                        <div class="text-truncate hm-max-w-200 hm-text-size-13">
                     ${notif.title } 
                    </div>
                        <div class="hm-select-text-dull hm-text-size-11">
                             ${notif.details } 
                        </div>
                        </div>
                    </div></a>`)
        })
        
    }
}
/*--------------Toggle view js--------------*/
function hmToggleView(id1, id2) {
    $(id1).add(id2).toggleClass('hide');
}

/*--------------chart js--------------*/
/* attribute can pass
    "radius": 50
    "color": 'red'
    "percent": 10
    "centerLabel": "Available"
    "centerValue": 2
    "centervalueSize": 2
    "labelSize": 2
    "labelYPos": 2
   */
function singleDonutChart() {
var array1 = [];
var eleArr = $('[hm-chart-type="singleValueDonut"]');
for (i = 0; i < eleArr.length; i++) {
    if(eleArr[i].childElementCount > 0) continue;           //Continue if div already has a chart.
    var ctData = JSON.parse(($(eleArr[i]).attr('hm-chart-data')));
    var r = ctData.radius;
    var w = r*2;
    var h = w;
    var insideradius = r - ((ctData.thickness == undefined) ? r / 4 : ctData.thickness);
    var centerTxtValueSize = (ctData.centervalueSize == undefined) ? w / 4 : ctData.centervalueSize;
    var centerTxtLabelSize = (ctData.labelSize == undefined) ? w / 8 : ctData.labelSize;
    var centerTxtLabelYaxis = (ctData.labelYPos == undefined) ? w / 6 : ctData.labelYPos;
    var color = d3.scaleOrdinal([ctData.color, '#ddd']);
    var dataset = [{ title: "percent", value: ctData.percent }, { title: "remain", value: (100 - ctData.percent) }];
    
    var dountPie = d3.pie(dataset)
        .value(function (d) {
            return d.value;
        }).sort(null);

    var donutArc = d3.arc()
        .innerRadius(insideradius) // NEW
        .outerRadius(r);

    var donutSVG = d3.select(eleArr[i])
        .append('svg')
        .attr('width', w)
        .attr('height', w)
        .append('g')
        .attr('transform', 'translate(' + (w / 2) + ',' + (h / 2) + ')');

    var donutPath = donutSVG.selectAll('path')
        .data(dountPie(dataset))
        .enter()
        .append('path')
        .attr('d', donutArc)
        .attr('fill', function (d, i) { return color(d.data.title) });

    if (ctData.centerLabel) {
        donutSVG.append("text")
            .attr("text-anchor", "middle")
            .attr('font-size', centerTxtLabelSize)
            .attr('y', centerTxtLabelYaxis)
            .text(ctData.centerLabel);
    }
    if (ctData.centerValue) {
        donutSVG.append("text")
            .attr("text-anchor", "middle")
            .attr('font-size', centerTxtValueSize)
            .text(ctData.centerValue);
    }

    donutAnimate(donutPath, donutArc);
}
}


/*
attribute can pass
    "options": [{"name": "Lorem ipsum","value": 50,"percent": 50}]
    "color": ["red", "green", "blue"] / "schemePaired"
    "tipTemplateFn": "functionName"
    "radius": 100 
    "centerTxtSize": 14
    "legendRectSize": 16                                  
    "legendSpacing": 10
    "thickness": 30
*/
function multiValDonutChart(){
  var eleArr = $('[hm-chart-type="multiValueDonut"]');
  
    for (i = 0; i < eleArr.length; i++) {
        var totalValue = 0;
        var donutColor = d3.schemePaired;
        var width = $(eleArr[i]).parent().width(); 
        var ctData = JSON.parse(($(eleArr[i]).attr('hm-chart-data')));
        var donutData = ctData[0];
            var radius = (donutData.radius == undefined) ? width / 4 : donutData.radius;
        var height = (radius*2)+20;
        var centerTxtSize = (donutData.valueSize == undefined) ? radius / 4 : donutData.valueSize;
        var legendRectSize = donutData.legendRectSize == undefined ? 16 : donutData.legendRectSize;                                  
        var legendSpacing = donutData.legendSpacing == undefined ? 10 : donutData.legendSpacing; 
        var thickness = donutData.thickness != undefined ? donutData.thickness: radius/4;
        var allLegendHeight = donutData.options.length*(legendRectSize+legendSpacing);
        var donutPOS = radius+10;
        var tipDiv = d3.select("body").append("div").attr("class", "hm-donut-tooltip");
        
        for(var j=0 ; j < donutData.options.length ; j++ ){
            totalValue = totalValue + donutData.options[j].value;   
        } 

        if(allLegendHeight >= height){
          height = allLegendHeight+20; 
        }
        
        if(donutData.color != undefined && !($.isArray(donutData.color))){
            donutColor = d3[donutData.color];
        }
        else if(donutData.color != undefined && $.isArray(donutData.color)){
            donutColor = donutData.color;
        }
      
        var color = d3.scaleOrdinal(donutColor);

        var svg = d3.select(eleArr[i])
        .append('svg')
        .attr('class', 'pie')
        .attr('width', width)
        .attr('height', height);
        
        var g = svg.append('g')
          .attr('transform', 'translate(' + donutPOS + ',' + donutPOS + ')');

        var arc = d3.arc()
          .innerRadius(radius - thickness)
          .outerRadius(radius);

        var pie = d3.pie()
          .value(function(d) { 
            d.totalValue = totalValue;
            return d.percent;
          }).sort(null);

        /*--------create arc and assign tip fn and hover fn--------------*/
        var path = g.selectAll('path')
          .data(pie(donutData.options))
          .enter()
          .append("g")
          .on("mouseover", showDonutTip)
          .on("mouseout", function(d) {
            d3.selectAll(".hm-donut-center-txt").text('')
          })
          .append('path')
          .attr('d', arc)
          .attr('radius', radius)
          .attr('thickness', thickness)
          .attr('tipTemplate',function(d,i){
              if(donutData.tipTemplateFn === undefined){
                  return '';
              }
              else{
                  return donutData.tipTemplateFn;
              }
          })   
          .attr('hasTooltip', true)
          .attr('fill', (d,i) => color(i))
          
          .on("mouseover",  function(d) {
            d3.select(this)
            .transition()
            .duration(100)
            .attr('d', function (d) {
              const radius = parseFloat($(this).attr('radius'));
              const thickness = parseFloat($(this).attr('thickness'));
              d.radius = radius;
              d.thickness = thickness;
              return arcOver(d);;
            })
          })
          
          .on("mouseout",  function(d) {
            d3.select(this)
            .transition()
            .duration(100)
            .attr('d',function (d) {
              const radius = parseFloat($(this).attr('radius'));
              const thickness = parseFloat($(this).attr('thickness'));
              d.radius = radius;
              d.thickness = thickness;
              return arcOut(d);
            })
            tipDiv.style("display", "none");
          })

        var arcOver =  d3.arc().innerRadius((d,i) => {
             return (d.radius - d.thickness)
        }).outerRadius((d) => {return (d.radius + 5)})

        var arcOut = d3.arc()
        .innerRadius((d,i) => {
          return (d.radius - d.thickness)
        }).outerRadius((d) => {return (d.radius)})

        /*--------center text--------------*/
        g.append('text')
        .attr('text-anchor', 'middle')
        .attr('class', 'hm-donut-center-txt')
        .attr('font-size', centerTxtSize)
        .attr('dy', centerTxtSize/3);

        /*--------create tooltip--------------*/
        d3.selectAll('[hasTooltip="true"]').on("mousemove", function(d) {
          var fn = $(this).attr('tipTemplate');
          if(fn === ''){
            var clr = $(event.target).attr('fill');
            tipDiv.html('<div><span style="color:'+clr+';">&#9679;</span> <span>'+(d.data.name)+"</span></div><div> <small>"+(d.data.value) + " out of "+ d.data.totalValue+"</small></div>");
          }
          else{
              var html = window[fn](d);
              tipDiv.html(html);
          }
          tipDiv.style("left", d3.event.pageX+10+"px");
          tipDiv.style("top", d3.event.pageY-25+"px");
          tipDiv.style("display", "inline-block");
        });
        
        donutAnimate(path, arc);
        
        /*--------create legends--------------*/
        var horz = 2*radius+50; 
        var legend = svg.selectAll('.legend')                    
          .data(donutData.options)                         
          .enter()                                               
          .append('g')                                           
          .attr('class', 'legend')
          .attr('title','title')                                
          .attr('transform', function(d, i) {                     
            var height = legendRectSize + legendSpacing;
            var vert = (i * height)+20;      
            return 'translate(' + horz + ',' + vert + ')';        
          });                                                     

        legend.append('rect')                                     
          .attr('width', legendRectSize)                          
          .attr('height', legendRectSize)                         
          .style('fill', (d,i) => color(i))                       
          .style('stroke',(d,i) => color(i));                     
          
        legend.append('text')                                     
          .attr('x', legendRectSize + 5)              
          .attr('y', (legendRectSize/2 + 5))
          .attr('font-size','13')              
          .text(function(d) { return d.name; }); 
      }
  }

  function showDonutTip(d, i){
      $(this).parent().find('.hm-donut-center-txt').text(d.data.percent + "%");
  }

function donutAnimate(path, arc){
path.transition()
  .duration(1000)
  .attrTween('d', function(d) {
  var interpolate = d3.interpolate({startAngle: 0, endAngle: 0}, d);
  return function(t) {
    return arc(interpolate(t));
  };
});
}

// ================
function getParameterByName(name) {
    var url = window.location;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function checkValidDomain(domain,callback){
    var format = /^[a-zA-Z0-9][a-zA-Z0-9-.]{1,61}[a-zA-Z0-9]$/;
    if(format.test(domain)){
        return callback(true);
    } else {
        return callback(false);
    }
}

function checkValidEmail(email){
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    if(emailReg.test(email)){
        return true;
    }
    else{
        return false;
    }
}

function hideErrorMessage(ele){
    if($(ele).closest(".hm-main-view").hasClass("hm-has-error") == true ){
        $(ele).closest(".hm-main-view").removeClass("hm-has-error"); 
        $('.input-group').siblings('.hm-input-error-msg').text(''); 
    }
}

function createJSONForForm(formId) {
    var formData = {};
    $(formId + " [getData]").each(function () {
        var eleType = $(this).prop('nodeName');
        var fieldName = $(this).attr('id');
        if(eleType == "INPUT" && $('#'+fieldName).val().trim() == ''){
            $("#"+fieldName).closest('.bmd-form-group').addClass(' hm-has-error');
            $("#"+fieldName).closest('.bmd-form-group').find('.hm-input-error-msg').text('Required Field!');
            return false;
        }
        else{ 
            formData[fieldName] = $('#'+fieldName).val().trim();         
            $("#"+fieldName).closest('.bmd-form-group').removeClass(' hm-has-error');
        }
    });
    return formData;
}

function resetForm(formId){
        $(formId + " [reset]").each(function () {
            var eleType = $(this).prop('nodeName');
            var fieldName = $(this).attr('id');
            if(eleType == "INPUT" && $('#'+fieldName).val().trim() == ''){
                $("#"+fieldName).closest('.bmd-form-group').addClass(' hm-has-error');
                $("#"+fieldName).closest('.bmd-form-group').find('.hm-input-error-msg').text('Required Field!');
                return false;
            }
            else{ 
                formData[fieldName] = $('#'+fieldName).val().trim();         
                $("#"+fieldName).closest('.bmd-form-group').removeClass(' hm-has-error');
            }
        });
}

function startTimer(){
    console.log('Time In');
    $.ajax({
        type: 'GET',
        url: '/getTimeInfo',
        contentType: 'application/json',
        dataType: "JSON",
        success: function (response) {
            if(response != undefined && response.currentTime != null){
                $('#timeId').html('Last Time In : '+response.currentTime);
                //$("#timeInId").attr("disabled",true);
                //$("#timeOutId").attr("disabled",false);
            }   
        },
        error: function (response) {
            hideLoader('#siteLoader');
            console.log(response);
        }
    });        
}

function stopTimer(){
    $.ajax({
        type: 'GET',
        url: '/getTimeOutInfo',
        contentType: 'application/json',
        dataType: "JSON",
        success: function (response) {
            console.log(response);
            if(response != undefined && response.currentTime != null){
                $('#timeId').html('Last Time Out : '+response.currentTime);
                //$("#timeInId").attr("disabled",false);
                //$("#timeOutId").attr("disabled",true);
            }            
        },
        error: function (response) {
            hideLoader('#siteLoader');
            console.log(response);
        }
    });   
}

// =================