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

function successContactList(data) {
  debugger;
  var rowsContent
  $(data).find("PhoneBook").each(function () {

    let phoneBook = $(this).find("name").text();

    $(this).find("Contact").each(function () {
      let fname = $(this).find("firstName").text();
      let lname = $(this).find("lastName").text();
      let description = $(this).find("description").text();
      let phoneNumber = $(this).find("phoneNumber").text();

        debugger;
      // add to list
      groupedList.push({
        group: phoneBook,
        name: `${lname} ${fname}`,
        desc: description,
        phone: phoneNumber
      });

    });




  });

  debugger;
  //  Sort by group
  groupedList.sort((a, b) => a.group.localeCompare(b.group));

  filtered = [...groupedList];

  renderList();
  renderPagination();

}