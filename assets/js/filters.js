/****************************************************************************
 *  GLOBAL VARIABLES FOR FILTERING AND SORTING
 ****************************************************************************/
let originalOrder = [];
let selectedRoles = [];
let selectedDiets = [];
let searchTerm = "";
let selectedTitleSort = "";
let selectedTimeSort = "";

// A flag to track whether we've reset filters. 
// (Only needed if you want to do something special right after a reset.)
let filtersReset = false;

/****************************************************************************
 *  ON DOCUMENT READY
 ****************************************************************************/
$(document).ready(function () {
    // 1) Remove any automatic calls to resetFilters() or loadOriginalPosts().
    //    We do NOT want to overwrite the Jekyll-rendered posts on initial load.

    // 2) Load a deep copy of allPosts (so we have them stored for filtering):
    //    We do NOT call loadPage(0, originalOrder) here – just keep them in memory.
    originalOrder = JSON.parse(JSON.stringify(allPosts));

    // 3) Set up click handlers for filters and sorts.
    setupFilterButton();
    setupRoleSelection();
    setupDietSelection();
    setupSorting();
    setupSearch();

    // 4) If the user navigates away and returns via browser's back button,
    //    reapply filters (but only if something was actually selected).
    $(window).on('pageshow', function () {
        reapplyFilters();
    });
});

/****************************************************************************
 *  REAPPLY FILTERS
 *  Only reload if something is actually filtered/sorted/searchTerm is present.
 ****************************************************************************/
function reapplyFilters() {
    // If there is any filter or sort, re-filter & re-sort the posts
    if (selectedRoles.length > 0 ||
        selectedDiets.length > 0 ||
        searchTerm ||
        selectedTitleSort ||
        selectedTimeSort) 
    {
        filterAndSortPosts();
    }
    // Else do nothing:
    // The Jekyll-rendered original posts remain as they are.
}

/****************************************************************************
 *  RESET FILTERS (CALL THIS ONLY IF USER CLICKS A "RESET" BUTTON)
 ****************************************************************************/
function resetFilters() {
    // Mark filters as reset (if you need to do something in other code)
    filtersReset = true;

    // Reset variables
    selectedRoles = [];
    selectedDiets = [];
    searchTerm = "";
    selectedTitleSort = "";
    selectedTimeSort = "";

    // Reset UI elements
    $('.button-4').removeClass('selected'); 
    $('#filterBox input[data-diet]').prop('checked', false);
    $('#toggleOrdemAZ, #toggleOrdemZA, #toggleTempoMenor, #toggleTempoMaior').prop('checked', false);
    $('.searchTerm').val('');

    // If you want to reload the original posts once the user clicks "Reset", do so here:
    loadPage(0, originalOrder);

    // Reset the flag after reloading posts
    setTimeout(() => {
        filtersReset = false;
    }, 0);
}

/****************************************************************************
 *  FILTER & SORT LOGIC
 ****************************************************************************/
function filterAndSortPosts() {
    const noSortSelected = !selectedTitleSort && !selectedTimeSort;

    // Start with the original list
    let filteredPosts = [...originalOrder];

    // STEP 1: FILTER
    // (Only if user has selected roles, diets, or entered a searchTerm)
    filteredPosts = filteredPosts.filter(post => {
        const matchesRole = selectedRoles.length === 0 || 
                            selectedRoles.some(role => post.type.includes(role));
        const matchesDiet = selectedDiets.length === 0 || 
                            selectedDiets.every(diet => post.diet.includes(diet));
        const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm);
        return matchesRole && matchesDiet && matchesSearchTerm;
    });

    // STEP 2: SORT (Only if a sort checkbox is selected)
    if (selectedTitleSort) {
        // Sort by title
        filteredPosts.sort((a, b) => {
            return (selectedTitleSort === 'toggleOrdemAZ')
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title);
        });
    } else if (selectedTimeSort) {
        // Sort by time
        filteredPosts.sort((a, b) => {
            return (selectedTimeSort === 'toggleTempoMenor')
                ? parseInt(a.time) - parseInt(b.time)
                : parseInt(b.time) - parseInt(a.time);
        });
    }
    
    // STEP 3: Display via loadPage()
    loadPage(0, filteredPosts);
}

/****************************************************************************
 *  LOAD ORIGINAL POSTS (IF YOU WANT IT TIED TO A BUTTON, ETC.)
 *  We do NOT call this on initial load automatically.
 ****************************************************************************/
function loadOriginalPosts() {
    originalOrder = JSON.parse(JSON.stringify(allPosts)); 
    // You can call loadPage(0, originalOrder) here ONLY if you want
    // to reset or forcibly re-render the original list. 
}

/****************************************************************************
 *  SETUP FILTER BUTTON
 ****************************************************************************/
function setupFilterButton() {
    $('.filter-button').on('click', function (event) {
        event.stopPropagation();
        $('#filterBox').toggle();
        positionFilterBox(this);
    });

    $(document).on('click', function (event) {
        const filterBox = $('#filterBox');
        const filterButton = $('.filter-button');
        if (!filterBox.is(event.target) &&
            filterBox.has(event.target).length === 0 &&
            !filterButton.is(event.target)) 
        {
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

/****************************************************************************
 *  SETUP ROLE SELECTION
 ****************************************************************************/
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

        // Now apply filters/sorting
        filterAndSortPosts();
    });
}

/****************************************************************************
 *  SETUP DIET SELECTION
 ****************************************************************************/
function setupDietSelection() {
    $('#filterBox input[data-diet]').on('change', function () {
        const diet = $(this).data('diet') || '';
        toggleSelection(diet, 'diet');
        filterAndSortPosts();
    });
}

/****************************************************************************
 *  SETUP SORTING
 ****************************************************************************/
function setupSorting() {
    $('#toggleOrdemAZ, #toggleOrdemZA, #toggleTempoMenor, #toggleTempoMaior').on('change', function () {
        const id = $(this).attr('id');
        
        // If this checkbox is being de-selected:
        if (!$(this).is(':checked')) {
            if (id === 'toggleOrdemAZ' || id === 'toggleOrdemZA') {
                selectedTitleSort = "";
            } else if (id === 'toggleTempoMenor' || id === 'toggleTempoMaior') {
                selectedTimeSort = "";
            }
        } 
        else {
            // If selected, update the sort state and uncheck other sorting options
            selectedTitleSort = (id === 'toggleOrdemAZ' || id === 'toggleOrdemZA') ? id : "";
            selectedTimeSort  = (id === 'toggleTempoMenor' || id === 'toggleTempoMaior') ? id : "";

            // Uncheck other checkboxes
            $('input[type="checkbox"][name="sort"]').not(this).prop('checked', false);
        }

        filterAndSortPosts();
    });
}

/****************************************************************************
 *  SETUP SEARCH
 ****************************************************************************/
function setupSearch() {
    $('.searchTerm').on('input', function () {
        searchTerm = $(this).val().toLowerCase();
        filterAndSortPosts();
    });
}

/****************************************************************************
 *  TOGGLE SELECTION
 ****************************************************************************/
function toggleSelection(value, type) {
    const array = (type === 'role') ? selectedRoles : selectedDiets;
    const index = array.indexOf(value);
    if (index === -1) {
        array.push(value);
    } else {
        array.splice(index, 1);
    }
}
