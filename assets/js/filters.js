// Variables for filtering and sorting
let originalOrder = [];
let selectedRoles = [];
let selectedDiets = [];
let searchTerm = "";
let selectedTitleSort = "";
let selectedTimeSort = "";

$(document).ready(function () {
    loadOriginalPosts();
    setupFilterButton();
    setupRoleSelection();
    setupDietSelection();
    setupSorting();
    setupSearch();
});

function loadOriginalPosts() {
    originalOrder = allPosts; // Save the original order of posts
    loadPage(0, originalOrder); // Load the original posts
}

function setupFilterButton() {
    $('.filter-button').on('click', function (event) {
        event.stopPropagation();
        $('#filterBox').toggle();
        positionFilterBox(this);
    });

    $(document).on('click', function (event) {
        const filterBox = $('#filterBox');
        const filterButton = $('.filter-button');
        if (!filterBox.is(event.target) && filterBox.has(event.target).length === 0 && !filterButton.is(event.target)) {
            filterBox.hide();
        }
    });
}

function positionFilterBox(button) {
    const buttonPosition = $(button).offset();
    const buttonHeight = $(button).outerHeight();
    $('#filterBox').css({
        top: buttonPosition.top + buttonHeight + 10 + 'px',
        left: buttonPosition.left + 'px',
        position: 'absolute'
    });
}

function setupRoleSelection() {
    $('.button-4').on('click', function () {
        const role = $(this).data('role');
        toggleSelection(role, 'role');
        $(this).toggleClass('selected', selectedRoles.includes(role));
        filterAndSortPosts();
    });
}

function setupDietSelection() {
    $('#filterBox input[data-diet]').on('change', function () {
        const diet = $(this).data('diet') ? $(this).data('diet') : '';
        toggleSelection(diet, 'diet');
        filterAndSortPosts();
    });
}

function setupSorting() {
    $('#toggleOrdemAZ, #toggleOrdemZA, #toggleTempoMenor, #toggleTempoMaior').on('change', function () {
        const id = $(this).attr('id');
        selectedTitleSort = id === 'toggleOrdemAZ' || id === 'toggleOrdemZA' ? id : '';
        selectedTimeSort = id === 'toggleTempoMenor' || id === 'toggleTempoMaior' ? id : '';
        $('input[type="checkbox"][name="sort"]').not(this).prop('checked', false);
        filterAndSortPosts();
    });
}

function setupSearch() {
    $('.searchTerm').on('input', function () {
        searchTerm = $(this).val().toLowerCase();
        filterAndSortPosts();
    });
}

function toggleSelection(value, type) {
    const array = type === 'role' ? selectedRoles : selectedDiets;
    const index = array.indexOf(value);
    if (index === -1) array.push(value);
    else array.splice(index, 1);
}

function filterAndSortPosts() {
    const noFiltersOrSorting = selectedRoles.length === 0 &&
        selectedDiets.length === 0 &&
        searchTerm === "" &&
        !selectedTitleSort &&
        !selectedTimeSort;

    if (noFiltersOrSorting) {
        loadPage(0, originalOrder);
        return;
    }

    let filteredPosts = originalOrder.filter(post => {
        const matchesRole = selectedRoles.length === 0 || selectedRoles.some(role => post.type.includes(role));
        const matchesDiet = selectedDiets.length === 0 || selectedDiets.every(diet => post.diet.includes(diet));
        const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm);
        return matchesRole && matchesDiet && matchesSearchTerm;
    });

    if (selectedTitleSort) {
        filteredPosts.sort((a, b) =>
            selectedTitleSort === 'toggleOrdemAZ' ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
        );
    } else if (selectedTimeSort) {
        filteredPosts.sort((a, b) =>
            selectedTimeSort === 'TempoMenor' ? parseInt(a.time) - parseInt(b.time) : parseInt(b.time) - parseInt(a.time)
        );
    }

    loadPage(0, filteredPosts);
}
