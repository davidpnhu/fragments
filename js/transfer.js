function initTransfer() {


    //  Search filter (resets pages)
      document.getElementById("searchBox").addEventListener("input", searchContact);


}


document.getElementById("rowsSelect")
    .addEventListener("change", handleRowsChange);

function handleRowsChange(event) {
    const value = event.target.value;

    if (value === "all") {
        perPage = filtered.length;   // show all
    } else {
        perPage = parseInt(value);   // set selected page size
    }

    currentPage = 1;

    renderList();
    renderPagination();
}