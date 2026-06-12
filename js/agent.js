function selectItem(el) {
    const button = document.getElementById("dropdownBtn");

    // ✅ Set selected item (icon + text)
    button.innerHTML = el.innerHTML;

    // ✅ Highlight selected item
    document.querySelectorAll(".dropdown-item").forEach(item => {
        item.classList.remove("active");
    });

    el.classList.add("active");

    handleState(el.getAttribute("data-value"));
}

function handleAnswer() {
  debugger;
  // get Dialog first
  getDialogs();

}


function successAnswer(data) {
  debugger;
  var parameters = {
    Type: "CALL",
    EventType: "INBOUND",
    Action: $('#action').val(),
    ANI: ANI,


  };
  var payload = formXMLPayload(parameters);
  handlePostMessage(payload, "XML");
  showEnd();
  successMessage("Answered call from " + ANI);
}

function getDialogs() {
  // get Dialog
  debugger;
  dialog = "";
  var agentId = getAgentId();
  var url = getURL() + "User/" + agentId + "/Dialogs";

  callFinesse(url, "GET", "", successDialogs, errorMessage, "Failed to get dialogs");

}

function successDialogs(data) {
  console.log(data);
  ANI = formatInternationalWithDashes($(data).find("Dialog > fromAddress").text()) || noDialog;
  console.log("From Address is", ANI);
  $(callerId).val(ANI);
  dialog = $(data).find("Dialog > id").text();
  debugger;
  if (dialog) {
    // Accept call
    var agentId = getAgentId();
    var url = getURL() + "Dialog/" + dialog;
    var xmlBody = "<Dialog><targetMediaAddress>" + extension + "</targetMediaAddress><requestedAction>ANSWER</requestedAction></Dialog>";
    callFinesse(url, "PUT", xmlBody, successAnswer, errorMessage, "Failed to answer call");
  }
  successMessage("Received call from " + ANI);
}


function formatInternationalWithDashes(phone) {
  //console.log(formatInternationalWithDashes("6138091652"));
  // +1 613-809-1652
  const digits = phone.replace(/\D/g, "");

  // Assume North America if 10 digits
  if (digits.length === 10) {
    return `+1 ${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  }

  // If already includes country code (11 digits starting with 1)
  if (digits.length === 11 && digits.startsWith("1")) {
    return `+1 ${digits.slice(1, 4)}-${digits.slice(4, 7)}-${digits.slice(7)}`;
  }

  return phone; // fallback if unknown format
}


function handlePostMessage(payload, type) {
  try {
    console.log("Sending Payload to Parent Window:", payload);
    window.parent.postMessage(payload, "*");

    // Receive message from parent
    window.addEventListener("message", function (event) {
      debugger;
      console.log(event);
    });

    displayPayloadMessage(payload);
  } catch (error) {
    console.error("Error Posting Message to Parent Window:", error);

  }
}

function displayPayloadMessage(payload) {
  $(uiPayload).text(payload);
}

function formXMLPayload(parameters) {
  var sPayload = "<?xml version=\"1.0\" encoding=\"utf-8\"?><payload>";
  Object.entries(parameters).forEach(([key, value]) => {
    // If Action is "ACCEPT", leave the Action field empty
    //if (key === "Action" && value === "ACCEPT") {
    if (key === "Action" && value === "TALKING") {
      value = ""; // Set to empty string
    }
    if (value && value.trim() !== "") {
      var tag = `<${key}>${value}</${key}>`;
      sPayload += tag;
    }
  });
  sPayload += "</payload>";
  console.log("Constructed Payload:", sPayload);
  return sPayload;
}


function showControls() {
  $(uiControls).show();
  $(btnAccept).show();
  $(btnEnd).hide();
  $(callerId).val("");
  // $(uiPayload).text("");
}

function showEnd() {
  if ($(callerId).val() !== noDialog) {
    $(btnEnd).show();
    $(btnAccept).hide();
  }
}


function successEnd() {
  debugger;
  var parameters = {
    Type: "CALL",
    EventType: "INBOUND",
    Action: "END",
    ANI: ANI,


  };
  var payload = formXMLPayload(parameters);
  handlePostMessage(payload, "XML");
  dialog = "";
  successMessage("Ended call with " + ANI);
  showControls();
}


function removeOptionFromMenu(value,menuId) {
  const menu = document.getElementById(menuId);

  const item = menu.querySelector(`.dropdown-item[data-value="${value}"]`);

  if (item) {
    item.parentElement.remove(); //remove <li> wrapper
  }
}



function handleState(sel) {
  // Set State
  debugger;
  var xmlBody;
  var url = getURL() + "User/" + getAgentId();
  var selState = sel;
  currState = selState;
  if (selState === "READY") {
    xmlBody = "<User><state>READY</state></User>";
  }
  else {
    xmlBody = "<User><state>NOT_READY</state><reasonCodeId>" + selState + "</reasonCodeId></User>";
  }
  callFinesse(url, "PUT", xmlBody, successState, errorMessage, "Failed to update state");

}

function successState() {
  var selState = currState;
  if (selState === "READY") {
    showControls();
    removeOptionFromMenu("","menuState");
  }
  else {
    $(uiControls).hide();
  }
  successMessage("State changed to " + selState);
}