$(document).ready(function() {
    var originalOrder = $('.card').toArray(); // Cache the original order of posts on page load

    // Function to filter and sort posts
    function filterAndSortPosts() {
        var selectedRoles = [];
        var selectedDiets = [];
        var selectedTitleSort = '';
        var selectedTimeSort = '';

        // Get selected roles from buttons
        $('.button-4.selected').each(function() {
            selectedRoles.push($(this).data('role'));
        });

        // Get selected diets from checkboxes
        $('input[type="checkbox"]:checked').each(function() {
            var diet = $(this).data('diet');
            if (diet) selectedDiets.push(diet);
        });

        // Check for title sorting
        if ($('#toggleOrdemAZ').is(':checked')) {
            selectedTitleSort = 'AZ';
        } else if ($('#toggleOrdemZA').is(':checked')) {
            selectedTitleSort = 'ZA';
        }

        // Check for time sorting
        if ($('#toggleTempoMenor').is(':checked')) {
            selectedTimeSort = 'menor';
        } else if ($('#toggleTempoMaior').is(':checked')) {
            selectedTimeSort = 'maior';
        }

        // Get the search term
        var searchTerm = $('.searchTerm').val().toLowerCase();

        // Filter and show/hide posts
        var posts = $('.card');
        posts.each(function() {
            var types = $(this).data('type').split(',');
            var title = $(this).find('.card__footer span:first').text().toLowerCase();
            var diet = $(this).data('diet') ? $(this).data('diet').split(',') : [];
            var time = $(this).data('time'); // Extract the time value from the data attribute

            // Show posts if they match the selected filters and search term
            if (
                (selectedRoles.length === 0 || selectedRoles.some(role => types.includes(role))) &&
                (selectedDiets.length === 0 || selectedDiets.some(d => diet.includes(d))) &&
                title.includes(searchTerm)
            ) {
                $(this).show();
            } else {
                $(this).hide();
            }
        });

        // Sorting logic based on the selected options
        if (selectedTitleSort === 'AZ') {
            sortByTitle(posts, 'asc');
        } else if (selectedTitleSort === 'ZA') {
            sortByTitle(posts, 'desc');
        } else if (selectedTimeSort === 'menor') {
            sortByTime(posts, 'asc');
        } else if (selectedTimeSort === 'maior') {
            sortByTime(posts, 'desc');
        } else {
            // If no sorting is selected, reset to the original order
            restoreOriginalOrder();
        }
    }

    // Sort posts by title (A-Z or Z-A)
    function sortByTitle(posts, order) {
        posts.sort(function(a, b) {
            var titleA = $(a).find('.card__footer span:first').text().toLowerCase();
            var titleB = $(b).find('.card__footer span:first').text().toLowerCase();
            if (order === 'asc') {
                return titleA.localeCompare(titleB);
            } else {
                return titleB.localeCompare(titleA);
            }
        }).appendTo('.posts'); // Re-attach sorted posts to the DOM
    }

    // Sort posts by time (largest to smallest or smallest to largest)
    function sortByTime(posts, order) {
        posts.sort(function(a, b) {
            var timeA = parseInt($(a).data('time'), 10);
            var timeB = parseInt($(b).data('time'), 10);
            if (order === 'asc') {
                return timeA - timeB;
            } else {
                return timeB - timeA;
            }
        }).appendTo('.posts'); // Re-attach sorted posts to the DOM
    }

    // Restore the original order of the posts
    function restoreOriginalOrder() {
        $(originalOrder).appendTo('.posts'); // Re-attach the posts in the original order
    }

    // Button click handler for filtering
    $('.button-4').click(function() {
        $(this).toggleClass('selected');
        filterAndSortPosts(); // Call the function after toggling
    });

    // Checkbox change handler for sorting/filtering
    $('input[type="checkbox"]').on('change', function() {
        filterAndSortPosts(); // Call the function when checkboxes change
    });

    // Search input handler for filtering
    $('.searchTerm').on('input', function() {
        filterAndSortPosts(); // Call the function on search input change
    });

    // Trigger the function to initialize the sorting/filtering
    filterAndSortPosts();
    $('.posts').hide();   // Hide the container temporarily
    $('.posts').show();
});



$(document).ready(function() {
    // Toggle the filter box
    $('.filter-button').on('click', function(event) {
        event.stopPropagation(); // Prevent the click event from bubbling up
        $('#filterBox').toggle();
        const buttonPosition = $(this).offset();
        const buttonHeight = $(this).outerHeight();
        $('#filterBox').css({
            top: buttonPosition.top + buttonHeight + 10 + 'px', // 10px space
            left: buttonPosition.left + 'px',
            position: 'absolute'
        });
    });

    // Handle clicks outside the filter box to hide it
    $(document).on('click', function(event) {
        const filterBox = $('#filterBox');
        const filterButton = $('.filter-button');

        // Check if the clicked target is not the filter box or the filter button
        if (!filterBox.is(event.target) && filterBox.has(event.target).length === 0 && !filterButton.is(event.target)) {
            filterBox.hide(); // Hide the filter box
        }
    });

    // Handle the toggle switch state
    $('#toggleSwitch').on('change', function() {
        if ($(this).is(':checked')) {
            console.log('Toggle is ON');
            // Add the logic to apply the filter when toggled on
        } else {
            console.log('Toggle is OFF');
            // Add the logic to remove the filter when toggled off
        }
    });
});