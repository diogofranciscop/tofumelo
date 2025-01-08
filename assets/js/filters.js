/****************************************************************************
 *  GLOBAL VARIABLES FOR FILTERING AND SORTING
 ****************************************************************************/
let originalOrder = [];
let filteredPosts = [];
let selectedRoles = [];
let selectedDiets = [];
let searchTerm = "";
let selectedTitleSort = "";
let selectedTimeSort = "";

/****************************************************************************
 *  ON DOCUMENT READY
 ****************************************************************************/
$(document).ready(function () {
    // Store a deep copy of allPosts for filtering
    originalOrder = JSON.parse(JSON.stringify(allPosts));
    filteredPosts = [...originalOrder]; // Start with all posts as filtered list

    // Setup event handlers for filters, sorts, and search
    setupFilterButton();
    setupRoleSelection();
    setupDietSelection();
    setupSorting();
    setupSearch();

    // Trigger initial pagination load
    loadPaginatedPosts(1, filteredPosts);
});
window.addEventListener('resize', () => {
    const isMobile = window.innerWidth <= 768;
    const postsPerPage = isMobile ? 10 : 20;
    const currentPage = 1; // Reset to the first page on resize
    loadPaginatedPosts(currentPage, filteredPosts);
});


/****************************************************************************
 *  FILTER & SORT LOGIC
 ****************************************************************************/
function filterAndSortPosts() {
    // Reset to the full list before filtering
    filteredPosts = [...originalOrder];

    // STEP 1: FILTER
    filteredPosts = filteredPosts.filter(post => {
        const matchesRole =
            selectedRoles.length === 0 || selectedRoles.some(role => post.type.includes(role));
        const matchesDiet =
            selectedDiets.length === 0 || selectedDiets.every(diet => post.diet.includes(diet));
        const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm);

        return matchesRole && matchesDiet && matchesSearchTerm;
    });

    // STEP 2: SORT
    if (selectedTitleSort) {
        filteredPosts.sort((a, b) => {
            return selectedTitleSort === "toggleOrdemAZ"
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
    } else if (selectedTimeSort) {
        filteredPosts.sort((a, b) => {
            return selectedTimeSort === "toggleTempoMenor"
                ? parseInt(a.time) - parseInt(b.time)
                : parseInt(b.time) - parseInt(a.time);
        });
    }

    // STEP 3: Display the first page of filtered and sorted posts
    loadPaginatedPosts(1, filteredPosts);
}

/****************************************************************************
 *  LOAD PAGINATED POSTS
 ****************************************************************************/
function loadPaginatedPosts(page, posts) {
    const isMobile = window.innerWidth <= 768;
    const postsPerPage = isMobile ? 10 : 20;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    const paginatedPosts = posts.slice(startIndex, endIndex);
    const postContainer = $("#post-container");

    postContainer.empty(); // Clear current posts

    paginatedPosts.forEach(post => {
        const imagePath = post.image.replace(/\.(webp|png|jpg|jpeg)$/, "-180px.$1");

        const cardHTML = `
            <a href="${post.url}" class="card" data-index="${posts.indexOf(post) + 1}">
             <div class="skeleton skeleton-card"></div>
                <div class="card__img-container">
                    <img src="${imagePath}" class="card__img" alt="${post.title}" style="display: none;">
                </div>
                ${post.new === "yes" ? '<div class="new-tape" style="display:none">Nova Receita</div>' : ""}
                <div class="card__overlay"><p>${post.description}</p></div>
                <div class="card__footer">
                    <span class="title-card" style="display: none;">${post.title.toUpperCase()}</span>
                </div>
            </a>
        `;
        postContainer.append(cardHTML);

        // Attach load event to the image
        const imageElement = postContainer.find(`img[src="${imagePath}"]`);
        imageElement.on("load", function () {
            const card = $(this).closest(".card");
            card.find(".skeleton-card").addClass("hidden"); // Hide the skeleton
            $(this).fadeIn(); // Show the image
            card.find(".title-card").removeClass("hidden").fadeIn(); // Show the title
            card.find(".new-tape").removeClass("hidden").fadeIn(); // Show the title
        });
    });

    updatePaginationButtons(page, posts.length, postsPerPage);

    // Ensure scrolling to the top after DOM update
    setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, 0);
}

function loadPosts(page) {
    const isMobile = window.innerWidth <= 768;
    const postsPerPage = isMobile ? 10 : 20;
    const startIndex = (page - 1) * postsPerPage;
    const endIndex = startIndex + postsPerPage;

    const paginatedPosts = filteredPosts.slice(startIndex, endIndex);
    const postContainer = document.getElementById("post-container");
    postContainer.innerHTML = ""; // Clear existing posts

    paginatedPosts.forEach(post => {
        const cardHTML = `
            <a href="${post.url}" class="card">
             <div class="skeleton skeleton-card"></div> 
                ${post.new === "yes" ? '<div class="new-tape">Nova Receita</div>' : ""}
                <div class="card__overlay"><p>${post.description}</p></div>
                <div class="card__img-container">
                    <img src="${post.image}" class="card__img" alt="${post.title}">
                </div>
                <div class="card__footer">
                    <span class="title-card">${post.title.toUpperCase()}</span>
                </div>
            </a>
        `;
        postContainer.insertAdjacentHTML("beforeend", cardHTML);
    });

    updatePaginationButtons(page, filteredPosts.length, postsPerPage);
}

/****************************************************************************
 *  UPDATE PAGINATION BUTTONS
 ****************************************************************************/
function updatePaginationButtons(currentPage, totalPosts, postsPerPage) {
    const totalPages = Math.ceil(totalPosts / postsPerPage);
    const paginationContainer = document.getElementById("pagination-container");
    paginationContainer.innerHTML = ""; // Clear existing buttons

    // Create and add "First Page" button
    const firstPageButton = document.createElement("button");
    firstPageButton.textContent = "PRIMEIRA PÁGINA";
    firstPageButton.classList.add("pagination-button");
    firstPageButton.addEventListener("click", () => {
        loadPaginatedPosts(1, filteredPosts);
    });
    paginationContainer.appendChild(firstPageButton);

    // Add page number buttons
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
        const pageButton = document.createElement("button");
        pageButton.textContent = i;
        pageButton.classList.add("pagination-button");
        if (i === currentPage) {
            pageButton.classList.add("active");
        }
        pageButton.addEventListener("click", () => {
            loadPaginatedPosts(i, filteredPosts);
        });
        paginationContainer.appendChild(pageButton);
    }

    // Create and add "Last Page" button
    const lastPageButton = document.createElement("button");
    lastPageButton.textContent = "ÚLTIMA PÁGINA";
    lastPageButton.classList.add("pagination-button");
    lastPageButton.addEventListener("click", () => {
        loadPaginatedPosts(totalPages, filteredPosts);
    });
    paginationContainer.appendChild(lastPageButton);
}

/****************************************************************************
 *  SETUP EVENT HANDLERS
 ****************************************************************************/
function setupFilterButton() {
    $(".filter-button").on("click", function (event) {
        event.stopPropagation();
        $("#filterBox").toggle();
        positionFilterBox(this);
    });
    function positionFilterBox(button) {
        const buttonPosition = $(button).offset();
        const buttonHeight = $(button).outerHeight();
        $('#filterBox').css({
            top: buttonPosition.top + buttonHeight + 10 + 'px',
            left: buttonPosition.left + 'px',
            position: 'absolute'
        });
    }

    $(document).on("click", function (event) {
        const filterBox = $("#filterBox");
        const filterButton = $(".filter-button");
        if (
            !filterBox.is(event.target) &&
            filterBox.has(event.target).length === 0 &&
            !filterButton.is(event.target)
        ) {
            filterBox.hide();
        }
    });
}

function setupRoleSelection() {
    $(".button-4").on("click", function () {
        const role = $(this).data("role");
        toggleSelection(role, "role");

        // Update the `selected` class
        $(this).toggleClass("selected", selectedRoles.includes(role));

        filterAndSortPosts();
    });
}

function setupDietSelection() {
    $("#filterBox input[data-diet]").on("change", function () {
        const diet = $(this).data("diet") || "";
        toggleSelection(diet, "diet");

        filterAndSortPosts();
    });
}

function setupSorting() {
    $('input[type="checkbox"][name="sort"]').on("change", function () {
        const id = $(this).attr("id");

        // Update sorting selection
        if (!$(this).is(":checked")) {
            if (id === "toggleOrdemAZ" || id === "toggleOrdemZA") {
                selectedTitleSort = "";
            } else if (id === "toggleTempoMenor" || id === "toggleTempoMaior") {
                selectedTimeSort = "";
            }
        } else {
            selectedTitleSort = id.startsWith("toggleOrdem") ? id : "";
            selectedTimeSort = id.startsWith("toggleTempo") ? id : "";

            // Uncheck other sort options
            $('input[type="checkbox"][name="sort"]').not(this).prop("checked", false);
        }

        filterAndSortPosts();
    });
}

function setupSearch() {
    $(".searchTerm").on("input", function () {
        searchTerm = $(this).val().toLowerCase();
        filterAndSortPosts();
    });
}

/****************************************************************************
 *  UTILITY FUNCTIONS
 ****************************************************************************/
function toggleSelection(value, type) {
    const array = type === "role" ? selectedRoles : selectedDiets;
    const index = array.indexOf(value);

    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
}

