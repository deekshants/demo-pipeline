function dummyLogin(){
    showLoader('#siteLoader');
    setTimeout(function(){
        window.location.href = "/";
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