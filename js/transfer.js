let groupedList = [];
let filtered = [];
let currentPage = 1;
let perPage = 4; // show rows per page
let list = document.getElementById("listGroup");
let pagination = document.getElementById("pagination");

function initTransfer() {



    //  Search filter (resets pages)
    document.getElementById("searchBox").addEventListener("input", searchContact);

    document.getElementById("rowsSelect")
        .addEventListener("change", handleRowsChange);

}



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


function searchContact() {
    const val = this.value.toLowerCase();

    filtered = groupedList.filter(item =>
        item.group.toLowerCase().includes(val) ||
        item.name.toLowerCase().includes(val) ||
        item.desc.toLowerCase().includes(val) ||
        item.phone.toLowerCase().includes(val)
    );

    currentPage = 1;
    renderList();
    renderPagination();
}




function handleContactList() {
    var xmlBody;
    var url = getURL() + "TeamResource/15/PhoneBooks";
    callFinesse(url, "GET", "", successContactList, errorMessage, "Failed to get contact list");
}

function successContactList(data) {
    var rowsContent
    $(data).find("PhoneBook").each(function () {

        let phoneBook = $(this).find("name").text();

        $(this).find("Contact").each(function () {
            let fname = $(this).find("firstName").text();
            let lname = $(this).find("lastName").text();
            let description = $(this).find("description").text();
            let phoneNumber = $(this).find("phoneNumber").text();

            // add to list
            groupedList.push({
                group: phoneBook,
                name: `${lname} ${fname}`,
                desc: description,
                phone: phoneNumber
            });

        });




    });

    //  Sort by group
    groupedList.sort((a, b) => a.group.localeCompare(b.group));

    filtered = [...groupedList];

    renderList();
    renderPagination();

}

function renderList() {
 
    if (!list) {
        list = document.getElementById("listGroup");
        pagination = document.getElementById("pagination");
    }
    list.innerHTML = "";

    const start = (currentPage - 1) * perPage;
    const paginated = filtered.slice(start, start + perPage);

    let currentGroup = null;

    paginated.forEach(item => {

        if (item.group !== currentGroup) {
            const header = document.createElement("li");
            header.className = "list-group-item active";
            header.textContent = item.group;
            list.appendChild(header);

            currentGroup = item.group;
        }

        const li = document.createElement("li");
        li.className = "list-group-item";

        const row = document.createElement("div");
        row.className = "row";


        const nameSpan = document.createElement("span");
        nameSpan.className = "contactName";
        nameSpan.textContent = `${item.name || ""}`;

        const descSpan = document.createElement("span");
        descSpan.className = "contactDesc";
        descSpan.textContent = `${item.desc || ""}`;

        const nameCol = document.createElement("div");
        nameCol.className = "col-6 fw-bold";
        nameCol.appendChild(nameSpan);
        nameCol.appendChild(document.createElement("br"));
        nameCol.appendChild(descSpan);

        const phoneSpan = document.createElement("span");
        phoneSpan.className = "contactPhone";
        phoneSpan.textContent = `${item.phone || ""}`;

        const phoneI = document.createElement("i");
        phoneI.className = "bi bi-telephone-forward phone-transfer";
        phoneI.appendChild(phoneSpan);

        const phoneCol = document.createElement("div");
        phoneCol.className = "col-6 text-end";
        phoneCol.appendChild(phoneI);

        row.appendChild(nameCol);
        row.appendChild(phoneCol);
        li.appendChild(row);

        list.appendChild(li);



    });
}

function createBtn(text, page, disabled = false, active = false) {
    const li = document.createElement("li");
    li.className = "page-item";

    // ✅ add states
    if (disabled) li.classList.add("disabled");
    if (active) li.classList.add("active");

    const btn = document.createElement("button");
    btn.className = "page-link";
    btn.textContent = text;

    // ✅ click handler
    btn.addEventListener("click", function () {
        if (disabled || active) return;

        currentPage = page;

        renderList();
        renderPagination();
    });

    li.appendChild(btn);
    pagination.appendChild(li);
}

//  Render Pagination
function renderPagination() {
    pagination.innerHTML = "";

    const totalPages = Math.ceil(filtered.length / perPage) || 1;
    const isAll = perPage >= filtered.length;

    // ✅ hide page numbers if showing all
    if (isAll) {
        renderShowAllToggle();
        return;
    }

    const maxVisible = 5; // number of visible pages

    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);

    // adjust start if near end
    if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
    }

    // ✅ Prev
    createBtn("Prev", currentPage - 1, currentPage === 1);

    // ✅ First page + ellipsis
    if (start > 1) {
        createBtn(1, 1);

        if (start > 2) {
            createEllipsis();
        }
    }

    // ✅ Middle pages
    for (let i = start; i <= end; i++) {
        createBtn(i, i, false, i === currentPage);
    }

    // ✅ Last page + ellipsis
    if (end < totalPages) {
        if (end < totalPages - 1) {
            createEllipsis();
        }
        createBtn(totalPages, totalPages);
    }

    // ✅ Next
    createBtn("Next", currentPage + 1, currentPage === totalPages);

    // ✅ Show All toggle
    renderShowAllToggle();
}

function renderShowAllToggle() {
    const li = document.createElement("li");
    li.className = "page-item ms-3 d-flex align-items-center";

    const wrapper = document.createElement("div");
    wrapper.className = "form-check form-switch mb-0";

    const toggle = document.createElement("input");
    toggle.type = "checkbox";
    toggle.className = "form-check-input";

    const isAll = perPage >= filtered.length;
    toggle.checked = isAll;

    const label = document.createElement("label");
    label.className = "form-check-label ms-1";
    label.textContent = "All";

    toggle.addEventListener("change", function () {
        if (this.checked) {
            perPageBackup = perPage;
            perPage = filtered.length;
        } else {
            perPage = perPageBackup || 4;
        }

        currentPage = 1;
        renderList();
        renderPagination();
    });

    wrapper.appendChild(toggle);
    wrapper.appendChild(label);
    li.appendChild(wrapper);
    pagination.appendChild(li);
}

function createPageItem(text, page, disabled = false, active = false) {
    const li = document.createElement("li");
    li.className = "page-item " +
        (disabled ? "disabled " : "") +
        (active ? "active" : "");

    const btn = document.createElement("button");
    btn.className = "page-link";
    btn.textContent = text;

    btn.onclick = () => {
        if (!disabled) {
            currentPage = page;
            renderList();
            renderPagination();
        }
    };

    li.appendChild(btn);
    pagination.appendChild(li);
}

function createEllipsis() {
    const li = document.createElement("li");
    li.className = "page-item disabled";

    const span = document.createElement("span");
    span.className = "page-link";
    span.textContent = "...";

    li.appendChild(span);
    pagination.appendChild(li);
}

