// ✅ Generic fragment loader

// Enhanced fragment loader with error handling
function loadFragment(id, file, callback) {
  fetch(file)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.getElementById(id).innerHTML = data;
      if (callback) callback();
    })
    .catch(error => {
      console.error("Error loading fragment:", error);
      console.error("Error loading fragment id:", id);
      document.getElementById(id).innerHTML = `
            <div class="error">
              Failed to load ${file}
            </div>
          `;
    });
}


// Load all fragments
loadFragment("header", "fragments/header.html", initHeader);
loadFragment("footer", "fragments/footer.html");
loadFragment("login", "fragments/login.html");
loadFragment("main", "fragments/main.html");
loadFragment("dialer", "fragments/dialer.html");
loadFragment("agent", "fragments/agent.html");
loadFragment("transfer", "fragments/transfer.html", initTransfer);