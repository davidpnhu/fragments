var uiLogIn = "#uiLogIn";
var uiControls = "#uiControls";
var btnEnd = "#End";
var btnAccept = "#Accept";
var callerId = "#callerID";
var uiPayload = "#uiPayload";
var cred = "";
var extension = "";
var noDialog = "no dialog currently.";
var dialog;
var ANI;
var menu_user = "#menu-user";
var ui_username = "#username";
var ui_pwd = "#pwd";
var ui_ext = "#ext";
var loginId;
var userMenu = "#userMenu";
var uiHome = "#uiHome";
var currState;


function initHeader() {
 //init header

}


function callFinesse(url, method, xmlBody, successHandler, errorHandler) {

  var auth = getAuth();
  $('#api').text(url);
  $.ajax({
    url: url,
    method: method,
    contentType: "application/xml",
    data: xmlBody,
    headers: {
      "Authorization": "Basic " + auth
    },
    success: successHandler,
    error: errorHandler
  });
}


function successMessage() {
 // showAutoCloseDialog("Success!", 500);
}

function errorMessage() {
  showAutoCloseDialog("Failed!", 500);
}