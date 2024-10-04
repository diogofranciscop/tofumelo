$(document).ready(function() {
    // Filter posts based on button selections
    function filterPosts() {
        var selectedRoles = [];
        $('.button-3.selected').each(function() {
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
    $('.button-3').click(function() {
        $(this).toggleClass('selected');
        filterPosts(); // Call the filter function after toggling selection
    });

    // Search input handler
    $('.searchTerm').on('input', function() {
        filterPosts(); // Call the filter function on input change
    });
});