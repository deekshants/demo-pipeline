$(document).ready(function () {
  dummyNoAjaxSingleSelection();
  dummyNoAjaxMultiSelection();

  $('#multiselect1').on('change', ()=>{
    var data = $('#multiselect1').select2('data');
    var selection ='&nbsp;';
    data.forEach(element => {
      selection += element.text+'&nbsp; :: '
    });
    $('#selectionHtml').html(selection);
  })
});

function dummyWidgetLoader(widgetId, time) {
  setTimeout(function () {
    $('.hm-widget-loader', widgetId).add('.hm-widget-content', widgetId).toggleClass('hide');
  }, time);
}


function dummyLogin() {
  showLoader('#siteLoader');
  setTimeout(function () {
    window.location.href = "/";
  }, 1500);
}

function dummyRedirect(page) {
  showLoader('#siteLoader');
  setTimeout(function () {
    window.location.href = page;
  }, 1500);
}

function dummyPanelSave(toastMsg, toastTheme, panelId) {
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

function dummyRegistration() {
  showToast(
    {
      eleWrapper: '#siteToast',
      msg: 'We sent you an activation mail. Please check mail and activate account to login',
      theme: 'success'
    }
  );
}

function dummyEmployeeSignup() {
  showToast(
    {
      eleWrapper: '#siteToast',
      msg: 'Thank you! for registering at XYZ Company. We will notify you on your email once your account is approved by the company admin.',
      theme: 'success'
    }
  );
}

function dummySuccessToast(msg) {
  showToast(
    {
      eleWrapper: '#siteToast',
      msg: msg,
      theme: 'success'
    }
  );
}

function dummySuccessToastAuto(msg) {
  showToast(
    {
      eleWrapper: '#siteToast',
      msg: msg,
      theme: 'success',
      autoClose: true
    }
  );
}


/*-------------------------------single select-------------------------*/
function dummyNoAjaxSingleSelection() {
  //var jsonData = JSON.parse($('.singleSelect').attr('hm-select-data'));
  $.ajax({
    type: "GET",
    url: 'https://reqres.in/api/users',
    success: function (data) {
      var htmlData = [];
      var arr = data.data
      $.each(arr, function (index, value) {
        var html = {};
        html.id = arr[index].id;
        html.indData = arr[index];
        html.text = arr[index].first_name + '&nbsp;' + arr[index].last_name;
        html.title = arr[index].first_name + '&nbsp;' + arr[index].last_name;
        htmlData.push(html);
      });

      $(".singleSelect").select2({
        data: htmlData,
        escapeMarkup: function (markup) {
          return markup;
        },
        templateResult: template1,
        templateSelection: template1
      })
    },
    error: function () {

    }
  });
}

/*-------------------------------multi select-------------------------*/

function dummyNoAjaxMultiSelection(id) {
  var selectElement = (id == null || id == undefined || id == '') ? $('select[hm-select="select2"]') : $('#'+id) ;
  if (selectElement.length == 0) {
    return;
  }
  var jsonData = JSON.parse( selectElement.attr('hm-select-data') );
  $.ajax({
    type: "GET",
    url: jsonData.url,
    success: function (data) {
      var htmlData = [];
      var arr = data.data
      $.each(arr, function (index, value) {
        var html = {};
        html.id = arr[index].id;
        html.indData = arr[index];
        html.text = arr[index].first_name + '&nbsp;' + arr[index].last_name;
        html.title = arr[index].first_name + '&nbsp;' + arr[index].last_name;
        htmlData.push(html);
      });

      selectElement.select2({
        data: [{
          children: htmlData
        }],
        escapeMarkup: function (markup) {
          return markup;
        },
        templateResult: window[jsonData.resultTemplate],
        templateSelection: window[jsonData.selectionTemplate]
      });

    },
    error: function () {

    }
  });
}



function template1(data) {
  if (data.indData == null || data.indData == undefined) {
    return data.text;
  }
  var html = `<div class="hm-grid-inline">
      <div class="pr-2">
        <img class="hm-name-circle" src="`+ data.indData.avatar + `" height="32">
      </div>
      <div class="hm-col hm-text-height-normal hm-tpd-2">
        <div class="text-truncate hm-max-w-200 hm-text-size-13">`
    + data.indData.first_name + '&nbsp;' + data.indData.last_name +
    `</div>
        <div class="hm-select-text-dull hm-text-size-11">
          `+ data.indData.email + `
        </div>
      </div>
    </div>`
  return html;
}

function template2(data) {
  return `<u><b>${data.text}</b><u>`
}


/*
  DATA ATTRIBUTES FOR SELECT2:

    hm-temp-selection="function"
    hm-temp-result="function"
    hm-select="single/multiple"
*/