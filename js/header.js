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
$("#userMenu").hide();
}


function getURL() {
  var url = $('#api').val() || "https://canbs-ccx-pub.internal.bloodservices.ca:8445/finesse/api/";
  return url;
}

function getAuth() {
  if (cred)
    return cred;
  //otherwise
  var auth;
  if ($('#pwd')) {
    auth = btoa($(ui_username).val() + ":" + $(ui_pwd).val()); // Base64 encode
    cred = auth;
  }
  return auth;
}

function getAgentId() {
  return loginId;
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

function handleLogOut(id) {
  debugger;
  var xmlBody;
  var url = getURL() + "User/" + $(ui_username).val();
  xmlBody = `<User><state>LOGOUT</state><reasonCodeId>${id}</reasonCodeId></User>`;
  callFinesse(url, "PUT", xmlBody, successLogOut, errorMessage);
}

function successLogOut() {
  showLogIn();
}

function showLogIn() {
  $(uiHome).hide();
  $(userMenu).hide();
  $(ui_username).val("");
  $(ui_pwd).val("");
  $(ui_ext).val("");
  $(uiLogIn).show();
}