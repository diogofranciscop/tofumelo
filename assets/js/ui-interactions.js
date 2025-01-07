$(document).ready(function () {
    // Toggle information box
    $(".informação-nutricional").click(function (event) {
        const infoBox = $(".InformationBox");
    
        // Toggle classes
        if (infoBox.hasClass("visible")) {
            infoBox.removeClass("visible").addClass("hidden");
        } else {
            infoBox.removeClass("hidden").addClass("visible");
        }
    
        // Prevent the event from propagating to document click
        event.stopPropagation();
    });
    


    // Close information box when clicking outside
    $(document).on('click', function (event) {
        const infoBox = $('.InformationBox');
        const button = $('.informação-nutricional');

        if (!infoBox.is(event.target) && infoBox.has(event.target).length === 0 && !button.is(event.target)) {
            infoBox.removeClass("visible").addClass("hidden");
        }
    });

    // Handle burger menu functionality
    function handleBurgerMenu() {
        if ($(window).width() <= 800) {
            $('.burger-menu').show(); // Ensure the div is shown for mobile
            $('#burger-toggle').off('click').on('click', function () {
                $('#nav-links').toggleClass('active'); // Toggle the active class
            });
        } else {
            $('#nav-links').removeClass('active').show(); // Reset menu
            $('.burger-menu').hide();
        }
    }

    handleBurgerMenu();

    if ($(window).width() <= 868) {
        // Ensure menu state remains consistent during resizing
        $(window).resize(handleBurgerMenu);

        // Prevent burger menu from closing unintentionally when scrolling
        $(window).scroll(function () {
            if ($('#nav-links').hasClass('active')) {
                $('#nav-links').css('position', 'fixed');
            } else {
                $('#nav-links').css('position', 'absolute');
            }
        });
    }
});


function adjustVisibility() {
    const $ingredientsContainer = $('.container-ingredients2');
    const $directionsContainer = $('.container-directions2');
    let $ingredientsButton = $('.ingredients-btn');
    let $instructionsButton = $('.instructions-btn');

    if ($(window).width() <= 768) {
        // Add toggle buttons if they don't exist
        if (!$ingredientsButton.length && !$instructionsButton.length) {
            $ingredientsButton = $('.ingredient-title').addClass('toggle-button ingredients-btn');
            $instructionsButton = $('.instruction-title').addClass('toggle-button instructions-btn');

            $('.content2').append($ingredientsButton).append($instructionsButton);

            // Attach click handlers
            $ingredientsButton.click((e) => {
                e.stopPropagation();
                e.preventDefault();
                $ingredientsContainer.addClass('visible');
                $directionsContainer.removeClass('visible');
                $ingredientsButton.addClass('shadow-effect-ingredients').removeClass('shadow-effect-ingredients2');
                $instructionsButton.addClass('shadow-effect-instructions2').removeClass('shadow-effect-instructions');
            });

            $instructionsButton.click((e) => {
                e.stopPropagation();
                e.preventDefault();
                $directionsContainer.addClass('visible');
                $ingredientsContainer.removeClass('visible');
                $instructionsButton.addClass('shadow-effect-instructions').removeClass('shadow-effect-instructions2');
                $ingredientsButton.addClass('shadow-effect-ingredients2').removeClass('shadow-effect-ingredients');
            });
        }

        // Set initial state
        if (!$ingredientsContainer.hasClass('visible') && !$directionsContainer.hasClass('visible')) {
            $ingredientsContainer.addClass('visible');
            $directionsContainer.removeClass('visible');
        }
    } else {
        // Reset for larger screens
        $ingredientsContainer.addClass('visible').css('height', 'auto');
        $directionsContainer.addClass('visible').css('height', 'auto');
        $('.toggle-button').remove(); // Remove buttons if screen is wider
    }
}

// Debounce resize events
let resizeTimeout;
$(window).resize(() => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(adjustVisibility, 100);
});

$(document).ready(adjustVisibility);


function updateHeights() {
    const navbar = document.getElementById('nav');
    const footer = document.getElementById('footer');

    // Get heights of navbar and footer
    const navbarHeight = navbar.offsetHeight + 'px'; // Height including padding and borders
    const footerHeight = footer.offsetHeight; // Height including padding and borders

    // Get computed margins of the footer
    const footerStyles = window.getComputedStyle(footer);
    const footerMargin = parseInt(footerStyles.marginTop) + parseInt(footerStyles.marginBottom);

    // Calculate total footer height (including margins)
    const totalFooterHeight = footerHeight + footerMargin + 'px';

    // Set CSS variables dynamically
    document.documentElement.style.setProperty('--navbar-height', navbarHeight);
    document.documentElement.style.setProperty('--footer-height', totalFooterHeight);
}

// Adjust heights on page load and window resize
window.addEventListener('load', updateHeights);
window.addEventListener('resize', updateHeights);

