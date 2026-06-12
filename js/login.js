function initLogin() {
    //init login

}


function handleLogIn() {
    // LogIn
    debugger;
    var url = getURL() + "User/" + getAgentId(); 
    if (!extension) {
        extension = $('#ext').val();
    }
    var xmlBody = "<User><state>LOGIN</state><extension>" + extension + "</extension></User>";

    callFinesse(url, "PUT", xmlBody, successLogIn, errorLogIn, "");


}

function successLogIn(data) {
    initCookies();
    successMessage("Logged in as " + getAgentId());
    $(uiLogIn).hide();
    $(uiHome).show();
    $(userMenu).show();
    handleContactList();
}

function errorLogIn(err) {
    debugger;
    errorMessage("Login failed: " + err.statusText);
}


function handleContactList() {
    debugger;
    var xmlBody;
    var url = getURL() + "TeamResource/15/PhoneBooks";
    callFinesse(url, "GET", "", successContactList, errorMessage, "Failed to get contact list");
}
