/*--------------start function------------------*/
$(document).ready(function(){
    activeSideMenuParentLink();
    activeSideMenuChildLink()
    InitRadioExtraView();
    InitCheckboxExtraView();
});
$('.hm-tab-link').click(function(){
   hmTab();
});
$('[hm-direct-step="wizard"]').click(function(){
   hmWizardDirectStep();
});
$('.hm-side-menu-link').click(function(){
   hmSideMenuLink();
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
function showLoader(Id){
    $(Id).removeClass('hide');
}
function hideLoader(Id){
    $(Id).addClass('hide');
}


/*------------------------------------tost js -----------------------------------*/
function showToast(option){
    var wrapper = $(option.eleWrapper);
    var toast = createToast(option);
    toast = $(toast).hide().fadeIn(750);
    if(option.autoClose){
        var outTime  = option.autoCloseTime || 3500;
        if(outTime < 1000){
            outTime =  1000;
        }
        var watch = setTimeout(function(){
            toast.animate({ 'margin-top' : '-50px' , 'opacity': '0'},500, function(){
                this.remove();
                if(option.afterClose){
                    option.afterClose();
                }
            })
        }, outTime);
    }

    $(wrapper).on('click', '.hm-close', function(){
    $(this).closest('.hm-toast').remove();
    //clearTimeout(watch);
    if(option.afterClose){
        option.afterClose();
    }  
});

    $(wrapper).append(toast);
    if(option.afterShow){
        option.afterShow();
    }
}

function createToast(option){
    var final = toastCaseValidation(option);
    var html = `
    <div class="hm-toast hm-theme-`+(option.theme).toLowerCase()+`">
    <div class="hm-toast-inner">                
    <div class="hm-toast-icons">
    `+final.icon+`
    </div>
    <div class="hm-toast-msg">
    `+final.msg+`
    </div>
    <div class="hm-toast-action">
    `+final.close+`
    </div>
    </div>
    </div>`;
    return html;
}

function toastCaseValidation(option){
    var finalOption={};
    var toastmsg;
    var themeIco;
    var closeBtn =  '<button type="button" class="hm-close">&#10006;</button>';
    switch(option.theme) {
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
    if(option.closeButton == false){
        closeBtn = '';
    }

    if(option.msg == undefined ){ 
        toastmsg = 'No Message';
    }
    else{
        if(option.msg.length != 1  && typeof option.msg === "object" ){ 
            toastmsg = '<ul>';            
            option.msg.forEach(function(val,index){                     
                toastmsg = toastmsg + '<li>'+val+'</li>';
            });                
            toastmsg = toastmsg +'</ul>';     
        }
        else{                                
            toastmsg =option.msg;             
        }
    }
    finalOption.icon = themeIco;
    finalOption.close = closeBtn;
    finalOption.msg = toastmsg;
    return finalOption;
}

/*------------------------------------hmtab js -----------------------------------*/
function hmTab(){
    var tabNav = $(event.target).closest('.hm-tab-nav-wrapper');
    var tab = $(event.target).closest('.hm-tab-link').attr('hmtab');
    var tabContents = $('[hmtab='+tab+'].hm-tab-content').closest('.hm-tab-content-wrapper');
    $('>.hm-tab-content', tabContents).removeClass('active');
    $('>.hm-tab-link', tabNav).removeClass('active');
    $('[hmtab='+tab+'].hm-tab-content').addClass('active');
    $('[hmtab='+tab+'].hm-tab-link').addClass('active');
}

/*------------------------------------sidemenu js -----------------------------------*/
function hmSideMenuLink(){
    var link  = $(event.target).closest('.hm-side-menu-link').attr('hm-link');
    if(link){
        window.location.href = link;
    }
    var parent = $(event.target).closest('.hm-side-menu-outer');
    $('.hm-side-menu-link', parent).removeClass('focus');
    $(event.target).closest('.hm-side-menu-link').addClass('focus');
}

function activeSideMenuParentLink(){
    var path = location.pathname;
    if(path === "/"){
        $('[hm-url="/"]').addClass('active');
    }
    else{
        var parent = path.split('/')[1];
        var ele = '[hm-url="'+parent+'"]'
        $(ele).addClass('active');
    }
}
function activeSideMenuChildLink(){
    $('.hm-side-menu-outer .hm-side-submenu-item').removeClass('active');
    var path = location.pathname;
    var ele = $('.hm-side-menu-outer [href="'+path+'"]');
    $(ele).addClass('active');
}

        

        

/*------------------------------------side panel js -----------------------------------*/        
function openSidePanel(id){
    $(id).fadeIn(100).promise().then(function() {
        $(id).addClass('active');
        $('body').css('overflow', 'hidden');
    });
}

function closeSidePanel(id){
    $(id).removeClass('active');
    $(id).hide();
    $('body').css('overflow', 'auto');
}

/*------------------------------------wizard js -----------------------------------*/ 



function hmWizardDirectStep(){
    var eleCurrent = $(event.target).closest('.hm-wizard-step');
    var currentStep = eleCurrent.attr('hm-step');
    var parent = eleCurrent.closest('.hm-wizard-wrapper').attr('id');
    var parent = '#'+parent;
    hmWizardJumpStep({
        wrapperId : parent,
        step : currentStep
    });
}

function hmWizardJumpStep(option){
    var stepCount = $(option.wrapperId+" .hm-wizard-step-wrapper").first().find('[hm-step="'+option.step+'"]');
    var stepContent = $(option.wrapperId+" .hm-wizard-content-wrapper").first().find('[hm-step-content="'+option.step+'"]');
    $(option.wrapperId+" .hm-wizard-step-wrapper").first().find('.hm-wizard-step').removeClass('active');
    $(option.wrapperId+" .hm-wizard-step-wrapper").first().find('.hm-wizard-step').removeClass('done');
    $(option.wrapperId+" .hm-wizard-content-wrapper").first().find('.hm-step-content').removeClass('active');
    $(stepCount).addClass('active');
    $(stepContent).addClass('active');
    if($(option.wrapperId).hasClass('hm-wizard-with-mark-done')){
        $(stepCount).prevAll().addClass('done');  
    }
}

/*------------------------------------extra view radio checkbox js -----------------------------------*/
function InitRadioExtraView(){
    var view = $('[hm-watch="radio"]:checked').attr('hm-extra-view');
    $(view).removeClass('hide');
    $('[hm-watch="radio"]').change(function(){
      radioExtraView();
    });
}
function radioExtraView(){
    var name = $(event.target).attr('name');
    $('[name="'+name+'"]').each(function(){
        var otherView = $(this).attr('hm-extra-view');
        if(otherView){
            $(otherView).addClass('hide');
        }
    });
    
    var  currentView = $('[name="'+name+'"]:checked').attr('hm-extra-view');
    $(currentView).removeClass('hide');
}

function InitCheckboxExtraView(){
    var view = $('[hm-watch="checkbox"]:checked').attr('hm-extra-view');
    $(view).removeClass('hide');
    $('[hm-watch="checkbox"]').change(function(){
      checkboxExtraView();
    });
}
function checkboxExtraView(){
    var view = $(event.target).attr('hm-extra-view');
    if($(event.target).is(':checked')){
        $(view).removeClass('hide');
    }
    else{
       $(view).addClass('hide'); 
    }
}

/*--------------Toggle view js--------------*/
function hmToggleView(id1, id2){
    $(id1).add(id2).toggleClass('hide');
}