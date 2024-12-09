// Variables for filtering and sorting
let originalOrder = [];
let selectedRoles = [];
let selectedDiets = [];
let searchTerm = "";
let selectedTitleSort = "";
let selectedTimeSort = "";

$(document).ready(function () {
    resetFilters(); 
    loadOriginalPosts();
    setupFilterButton();
    setupRoleSelection();
    setupDietSelection();
    setupSorting();
    setupSearch();
    $(window).on('pageshow', function () {
        reapplyFilters(); // Reapply the filters when returning to the page
    });
});

function reapplyFilters() {
    if (selectedRoles.length > 0 || selectedDiets.length > 0 || searchTerm || selectedTitleSort || selectedTimeSort) {
        // If filters are selected, reapply the filtering logic
        filterAndSortPosts();
    } else {
        // If no filters are selected, reset to original order
        loadPage(0, originalOrder);
    }
}


function resetFilters() {
    // Reset variables
    selectedRoles = [];
    selectedDiets = [];
    searchTerm = "";
    selectedTitleSort = "";
    selectedTimeSort = "";

    // Reset UI elements
    $('.button-4').removeClass('selected'); // Deselect all role buttons
    $('#filterBox input[data-diet]').prop('checked', false); // Uncheck all diet checkboxes
    $('#toggleOrdemAZ, #toggleOrdemZA, #toggleTempoMenor, #toggleTempoMaior').prop('checked', false); // Uncheck sorting checkboxes
    $('.searchTerm').val(''); // Clear search input

    // Reload original posts
    loadPage(0, originalOrder);
}
function loadOriginalPosts() {
    originalOrder = JSON.parse(JSON.stringify(allPosts)); // Create a deep copy of the original posts
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

        // Update the `selected` class
        if (selectedRoles.includes(role)) {
            $(this).addClass('selected');
        } else {
            $(this).removeClass('selected');
        }

        // Force focus removal by recreating the button
        const button = $(this).detach(); // Remove from DOM
        $(button).appendTo('.filter-buttons'); // Reattach to DOM

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
        
        // Check if the current checkbox is being deselected
        if (!$(this).is(':checked')) {
            if (id === 'toggleOrdemAZ' || id === 'toggleOrdemZA') {
                selectedTitleSort = ""; // Clear title sort
            } else if (id === 'toggleTempoMenor' || id === 'toggleTempoMaior') {
                selectedTimeSort = ""; // Clear time sort
            }
        } else {
            // If selected, update the sort state and uncheck other sorting options
            selectedTitleSort = id === 'toggleOrdemAZ' || id === 'toggleOrdemZA' ? id : "";
            selectedTimeSort = id === 'toggleTempoMenor' || id === 'toggleTempoMaior' ? id : "";
            $('input[type="checkbox"][name="sort"]').not(this).prop('checked', false);
        }

        console.log("Selected Sorts:", selectedTitleSort, selectedTimeSort); // Debugging log
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
    const noSortSelected = !selectedTitleSort && !selectedTimeSort;

    console.log("No Sort Selected:", noSortSelected); // Debugging log
    console.log("Selected Sorts:", selectedTitleSort, selectedTimeSort);

    // If no sort is selected, reset to the original order
    if (noSortSelected) {
        console.log("Restoring Original Order");
        let filteredPosts = originalOrder;

        // Apply filters if needed
        if (selectedRoles.length > 0 || selectedDiets.length > 0 || searchTerm) {
            filteredPosts = filteredPosts.filter(post => {
                const matchesRole = selectedRoles.length === 0 || selectedRoles.some(role => post.type.includes(role));
                const matchesDiet = selectedDiets.length === 0 || selectedDiets.every(diet => post.diet.includes(diet));
                const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm);
                return matchesRole && matchesDiet && matchesSearchTerm;
            });
        }

        loadPage(0, filteredPosts);
        return;
    }

    // Filter and sort logic as before
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
            selectedTimeSort === 'toggleTempoMenor' ? parseInt(a.time) - parseInt(b.time) : parseInt(b.time) - parseInt(a.time)
        );
    }

    loadPage(0, filteredPosts);
}
