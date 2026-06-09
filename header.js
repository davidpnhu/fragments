function initHeader() {
  const btn = document.getElementById("menuBtn");

  if (btn) {
    btn.addEventListener("click", () => {
      alert("Menu clicked!");
    });
  }
}