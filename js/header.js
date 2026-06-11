let cSessionID = "sessionID";
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
let chia = "T9#vQ7!xL2@pR4mZ8$wFjC6&dHk1^sYgU3*";

function initHeader() {

  // check existing session
  checkSession();

  //init header
  $("#userMenu").hide();
}

function checkSession() {
  setCred(Cookies.get(cSessionID));
  if (cred) {
    handleLogIn();
  }
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
  delCookies();
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


function initCookies() {

  const data = getAuth();
  const sessionID = CryptoJS.AES.encrypt(
    JSON.stringify(data),
    chia
  ).toString();

  Cookies.set(cSessionID, sessionID);

}

function delCookies() {
  Cookies.remove(cSessionID);
}

function setCred(sessionID) {
  if (sessionID) {
    let bytes = CryptoJS.AES.decrypt(sessionID, chia);
    let data = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    cred = data;
  }
}