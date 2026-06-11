function initLogin() {
 //init login

}


function handleLogIn() {
  // LogIn
  debugger;
  var url = getURL() + "User/" + $(ui_username).val();
  extension = $('#ext').val();
  var xmlBody = "<User><state>LOGIN</state><extension>" + extension + "</extension></User>";

  callFinesse(url, "PUT", xmlBody, successLogIn, errorLogIn);


}

function successLogIn(data) {
  debugger;
  loginId = $(ui_username).val();
  initCookies();
  successMessage();
  $(uiLogIn).hide();
  $(uiHome).show();
  $(userMenu).show();
  handleContactList();
}

function errorLogIn(err) {
  debugger;
  errorMessage();
}


function handleContactList() {
  debugger;
  var xmlBody;
  var url = getURL() + "TeamResource/15/PhoneBooks";
  callFinesse(url, "GET", "", successContactList, errorMessage);
}
