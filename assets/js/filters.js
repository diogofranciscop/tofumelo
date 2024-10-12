$(document).ready(function() {
    // Filter posts based on button selections
    function filterPosts() {
        var selectedRoles = [];
        $('.button-4.selected').each(function() {
            selectedRoles.push($(this).data('role'));
        });

        // Get the search term
        var searchTerm = $('.searchTerm').val().toLowerCase();

        $('.card').each(function() {
            var types = $(this).data('type').split(','); // Get the types of the current post
            var title = $(this).find('.card__footer span:first').text().toLowerCase(); // Get the title of the post

            // Show posts if no buttons are selected and the search term is empty
            if (selectedRoles.length === 0 && searchTerm === '') {
                $(this).show(); // Show all posts
            } else if (selectedRoles.length === 0 && title.includes(searchTerm)) {
                $(this).show(); // Show posts matching the search term
            } else if (selectedRoles.some(role => types.includes(role)) && title.includes(searchTerm)) {
                $(this).show(); // Show posts matching selected roles and search term
            } else {
                $(this).hide(); // Hide the post if it does not match
            }
        });
    }

    // Button click handler
    $('.button-4').click(function() {
        $(this).toggleClass('selected');
        filterPosts(); // Call the filter function after toggling selection
    });

    // Search input handler
    $('.searchTerm').on('input', function() {
        filterPosts(); // Call the filter function on input change
    });
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
