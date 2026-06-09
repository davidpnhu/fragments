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