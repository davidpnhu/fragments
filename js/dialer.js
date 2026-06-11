function initDialer() {
    document.querySelectorAll(".btn-dial").forEach(btn => {
        btn.addEventListener("click", () => {
            display.value += btn.textContent;
        });
    });

}

function backspace() {
    let num = $("#display").val().slice(0, -1);
    $("#display").val(num);
}

function call() {
    alert("Calling " + $("#display").val());
}