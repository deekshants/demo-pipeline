$(document).ready(function(){
  dummyNoAjaxSingleSelection();
  dummyNoAjaxMultiSelection();
  

});


function dummyLogin(){
    showLoader('#siteLoader');
    setTimeout(function(){
        window.location.href = "/";
    }, 1500);
}

function dummyRedirect(page){
    showLoader('#siteLoader');
    setTimeout(function(){
        window.location.href = page;
    }, 1500);
}   

function dummyPanelSave(toastMsg, toastTheme, panelId){
    closeSidePanel(panelId);
    showToast(
      { 
        eleWrapper: '#siteToast',
        msg: toastMsg,
        theme: toastTheme,
        autoClose: true
      } 
    );
}

function dummyRegistration(){
    showToast(
      { 
        eleWrapper: '#siteToast',
        msg: 'We sent you an activation mail. Please check mail and activate account to login',
        theme: 'success'
      } 
    );
}

function dummyEmployeeSignup(){
    showToast(
      { 
        eleWrapper: '#siteToast',
        msg: 'Thank you! for registering at XYZ Company. We will notify you on your email once your account is approved by the company admin.',
        theme: 'success'
      } 
    );
}

function dummySuccessToast(msg){
    showToast(
      { 
        eleWrapper: '#siteToast',
        msg: msg,
        theme: 'success'
      } 
    );
}


/*-------------------------------single select-------------------------*/
  function dummyNoAjaxSingleSelection(){
    $.ajax({
      type:"GET",
      url:'https://reqres.in/api/users',
      success: function(data) {
        var htmlData = [];
        var arr = data.data
        $.each(arr, function(index, value) {
          var html = {};
          html.id = arr[index].id;
          html.text = arr[index].first_name +'&nbsp;'+ arr[index].last_name;
          html.html = `<div class="hm-grid-inline">
                        <div class="pr-2">
                          <img class="hm-name-circle" src="`+arr[index].avatar+`" height="32">
                        </div>
                        <div class="hm-col hm-text-height-normal hm-tpd-2">
                          <div class="text-truncate hm-max-w-200 hm-text-size-13">`
                            +arr[index].first_name +'&nbsp;'+ arr[index].last_name+
                          `</div>
                          <div class="hm-select-text-dull hm-text-size-11">
                            `+arr[index].email+`
                          </div>
                        </div>
                      </div>`;
          html.title = arr[index].first_name +'&nbsp;'+ arr[index].last_name;
          htmlData.push(html);
        });
        var placeholder = {};
        placeholder.id = 'noValue';
        placeholder.text = 'Select';
        placeholder.html = `Select`;
        placeholder.title = '';
        htmlData.unshift(placeholder);
        $(".singleSelect").select2({
          data: htmlData,
          escapeMarkup: function(markup) {
            return markup;
          },
          templateResult: function(data) {
            return data.html;
          },
          templateSelection: function(data) {
            return data.html;
          }
        })
      },
      error: function() {

      }
    });
  }

  /*-------------------------------multy select-------------------------*/
  function dummyNoAjaxMultiSelection(){
    $.ajax({
      type:"GET",
      url:'https://reqres.in/api/users',
      success: function(data) {
        var htmlData = [];
        var arr = data.data
        $.each(arr, function(index, value) {
          var html = {};
          html.id = arr[index].id;
          html.text = arr[index].first_name +'&nbsp;'+ arr[index].last_name;
          html.html = `<div class="hm-grid-inline">
                        <div class="pr-2">
                          <img class="hm-name-circle" src="`+arr[index].avatar+`" height="32">
                        </div>
                        <div class="hm-col hm-text-height-normal hm-tpd-2">
                          <div class="text-truncate hm-max-w-200 hm-text-size-13">`
                            +arr[index].first_name +'&nbsp;'+ arr[index].last_name+
                          `</div>
                          <div class="hm-select-text-dull hm-text-size-11">
                            `+arr[index].email+`
                          </div>
                        </div>
                      </div>`;
          html.title = arr[index].first_name +'&nbsp;'+ arr[index].last_name;
          htmlData.push(html);
        });
        var placeholder = {};
        placeholder.id = 'noValue';
        placeholder.text = 'Select';
        placeholder.html = `Select`;
        placeholder.title = '';
        htmlData.unshift(placeholder);
        $(".multiSelect").select2({
          data: htmlData,
          escapeMarkup: function(markup) {
            return markup;
          },
          templateResult: function(data) {
            return data.html;
          },
          templateSelection: function(data) {
            return data.html;
          }
        }).val(2).trigger('change');

      },
      error: function() {

      }
    });
  }