// ✅ Generic fragment loader
function loadFragment(id, file, callback) {
  fetch(file)
    .then(res => res.text())
    .then(html => {
      document.getElementById(id).innerHTML = html;

      // ✅ run init function if provided
      if (callback) callback();
    });
}

// ✅ Load all fragments
loadFragment("header", "fragments/header.html", initHeader);
loadFragment("footer", "fragments/footer.html");
loadFragment("login", "fragments/login.html", initLogin);
loadFragment("main", "fragments/main.html");
loadFragment("dialer", "fragments/dialer.html");
loadFragment("agent", "fragments/agent.html");
loadFragment("transfer", "fragments/transfer.html", initTransfer);