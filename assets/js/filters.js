// Variables for filtering and sorting
let originalOrder = [];
let selectedRoles = [];
let selectedDiets = [];
let searchTerm = "";
let selectedTitleSort = "";
let selectedTimeSort = "";

// Initial setup and event listeners
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
    $('.filter-button').on('click', function(event) {
        event.stopPropagation();
        $('#filterBox').toggle();
        positionFilterBox(this);
    });
    
    $(document).on('click', function(event) {
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
    $('.button-4').on('click', function() {
        const role = $(this).data('role');
        toggleSelection(role, 'role');
        filterAndSortPosts(); // Re-filter and sort when role is toggled
    });
}

function setupDietSelection() {
    $('#filterBox input[data-diet]').on('change', function() {
        // Since data-diet can contain multiple values, split them on the comma
        const diet = $(this).data('diet') ? $(this).data('diet') : '';
        toggleSelection(diet, 'diet'); // Update the selection
        filterAndSortPosts(); // Re-filter and sort when diet is toggled
    });
}


function setupSorting() {
    $('#toggleOrdemAZ').on('change', function() {
        if ($(this).is(':checked')) {
            selectedTitleSort = 'toggleOrdemAZ'; // Set sort to ascending
        } else {
            selectedTitleSort = ""; // Reset if unchecked
        }
        filterAndSortPosts(); // Re-filter and sort
    });

    $('#toggleOrdemZA').on('change', function() {
        if ($(this).is(':checked')) {
            selectedTitleSort = 'toggleOrdemZA'; // Set sort to descending
        } else {
            selectedTitleSort = ""; // Reset if unchecked
        }
        filterAndSortPosts(); // Re-filter and sort
    });

    $('#toggleTempoMenor').on('change', function() {
        if ($(this).is(':checked')) {
            selectedTimeSort = 'TempoMenos'; // Set sort to shorter time
        } else {
            selectedTimeSort = ""; // Reset if unchecked
        }
        filterAndSortPosts(); // Re-filter and sort
    });

    $('#toggleTempoMaior').on('change', function() {
        if ($(this).is(':checked')) {
            selectedTimeSort = 'TempoMais'; // Set sort to longer time
        } else {
            selectedTimeSort = ""; // Reset if unchecked
        }
        filterAndSortPosts(); // Re-filter and sort
    });
    $('input[type="checkbox"][name="sort"]').on('change', function() {
        // Uncheck all other sorting checkboxes
        $('input[type="checkbox"][name="sort"]').not(this).prop('checked', false);
        
        // Call the function to filter and sort posts
        filterAndSortPosts();
    });
    
}

function setupSearch() {
    $('.searchTerm').on('input', function() {
        searchTerm = $(this).val().toLowerCase(); // Get current search term
        filterAndSortPosts(); // Re-filter and sort
    });
}

function toggleSelection(value, type) {
    if (type === 'role') {
        updateSelectionArray(selectedRoles, value);
    } else if (type === 'diet') {
        updateSelectionArray(selectedDiets, value);
    }
}

function updateSelectionArray(array, value) {
    const index = array.indexOf(value);
    if (index === -1) {
        array.push(value); // Add value if not present
    } else {
        array.splice(index, 1); // Remove value if present
    }
}

function filterAndSortPosts() {
    // Check if no filters or sorting options are active
    const noFiltersOrSorting =
        selectedRoles.length === 0 &&
        selectedDiets.length === 0 &&
        searchTerm === "" &&
        !selectedTitleSort &&
        !selectedTimeSort;

    if (noFiltersOrSorting) {
        // If no filters/sorting are applied, revert to original order
        loadPage(0, originalOrder); // Load original posts
        return; // Exit function
    }

    let filteredPosts = [...originalOrder]; // Start with original posts

    // Apply filters
    filteredPosts = filteredPosts.filter(post => {
        const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(post.type);

        // Modify the diet filter to check that all selected diets are present in post.diet
        const matchesDiet = selectedDiets.length === 0 || selectedDiets.every(diet => post.diet.includes(diet));

        const matchesSearchTerm = post.title.toLowerCase().includes(searchTerm);
        return matchesRole && matchesDiet && matchesSearchTerm;
    });
    
    // Apply sorting if any sort option is selected
    if (selectedTitleSort) {
        filteredPosts.sort((a, b) =>
            selectedTitleSort === 'toggleOrdemAZ'
                ? a.title.localeCompare(b.title)
                : b.title.localeCompare(a.title)
        );
    } else if (selectedTimeSort) {
        filteredPosts.sort((a, b) =>
            selectedTimeSort === 'TempoMenos'
                ? parseInt(a.time) - parseInt(b.time)
                : parseInt(b.time) - parseInt(a.time)
        );
    }

    loadPage(0, filteredPosts); // Load the first page of filtered/sorted posts
}


// Load and render posts
function loadPage(page, posts) {
    const postsPerPage = 20;
    const start = page * postsPerPage;
    const end = Math.min(start + postsPerPage, posts.length);
    loadRecipes(posts.slice(start, end)); // Load recipes for current page
    createPaginationButtons(page, posts); // Create pagination
}

function loadRecipes(posts) {
    $('#post-container').empty(); // Clear previous posts
    posts.forEach(post => {
        const $postElement = $('<a>')
            .attr('href', post.url)
            .addClass('card')
            .html(`
                <div class="card__overlay">
                    <p>${post.description}</p>
                </div>
                <div class="card__img-container">
                    <img src="${post.image}" class="card__img" alt="Recipe Image">
                </div>
                <div class="card__footer">
                    <span class="title-card">${post.title.toUpperCase()}</span>
                </div>
            `);
        $('#post-container').append($postElement); // Add post to container
    });
}

// Function to create pagination buttons based on the filtered list of posts
function createPaginationButtons(currentPage, posts) {
    const totalPages = Math.ceil(posts.length / 20);
    $('#pagination-container').empty();

    const $firstPage = $('<button>').text('PRIMEIRA PÁGINA').addClass('pagination-button').on('click', () => loadPage(0, posts));
    const $lastPage = $('<button>').text('ÚLTIMA PÁGINA').addClass('pagination-button').on('click', () => loadPage(totalPages - 1, posts));
    const $prevPage = $('<button>').text('←').addClass('pagination-button').on('click', () => loadPage(Math.max(0, currentPage - 1), posts));
    const $nextPage = $('<button>').text('→').addClass('pagination-button').on('click', () => loadPage(Math.min(totalPages - 1, currentPage + 1), posts));

    $('#pagination-container').append($firstPage, $prevPage);

    if (currentPage > 2) $('#pagination-container').append($('<span>').text('1').addClass('pagination-button').on('click', () => loadPage(0, posts)));
    if (currentPage > 3) $('#pagination-container').append($('<span>').text('...').addClass('pagination-ellipsis'));

    for (let i = Math.max(0, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        const $pageButton = $('<button>').text(i + 1).addClass('pagination-button');
        if (i === currentPage) $pageButton.addClass('active');
        $pageButton.on('click', () => loadPage(i, posts));
        $('#pagination-container').append($pageButton);
    }

    if (currentPage < totalPages - 4) $('#pagination-container').append($('<span>').text('...').addClass('pagination-ellipsis'));
    if (currentPage < totalPages - 3) $('#pagination-container').append($('<span>').text(totalPages).addClass('pagination-button').on('click', () => loadPage(totalPages - 1, posts)));

    $('#pagination-container').append($nextPage, $lastPage);
}
$(document).ready(function() {
    $(".informação-nutricional").click(function() {
        $(".InformationBox").toggle();  // Toggles visibility
    });
});
 // Handle clicks outside the filter box to hide it
 $(document).on('click', function(event) {
    const filterBox = $('.InformationBox');
    const filterButton = $('.informação-nutricional');

    // Check if the clicked target is not the filter box or the filter button
    if (!filterBox.is(event.target) && filterBox.has(event.target).length === 0 && !filterButton.is(event.target)) {
        filterBox.hide(); // Hide the filter box
    }
});
$(document).ready(function() {
    // Function to handle burger menu visibility
    function handleBurgerMenu() {
      if ($(window).width() <= 768) {
        // Ensure burger menu is shown
        $('.burger-menu').show();
  
        // Add click event to toggle 'active' class on the nav links
        $('#burger-toggle').click(function() {
          console.log('Burger menu clicked!'); // Debugging log
          $('#nav-links').toggleClass('active');  // Toggle visibility using CSS 'active' class
        });
      } else {
        // Ensure nav links are visible on larger screens and burger menu is hidden
        $('#nav-links').show();
        $('.burger-menu').hide();
      }
    }
  
    // Initial check
    handleBurgerMenu();
  
    // Re-check and update visibility on window resize
    $(window).resize(function() {
      handleBurgerMenu();
    });
  });
  