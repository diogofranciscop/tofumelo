$(document).ready(function () {
    $(".informação-nutricional").click(function () {
        $(".InformationBox").toggle();
    });

    $(document).on('click', function (event) {
        const infoBox = $('.InformationBox');
        const button = $('.informação-nutricional');
        if (!infoBox.is(event.target) && infoBox.has(event.target).length === 0 && !button.is(event.target)) {
            infoBox.hide();
        }
    });

    function handleBurgerMenu() {
        if ($(window).width() <= 768) {
            $('.burger-menu').show();
            $('#burger-toggle').click(() => $('#nav-links').toggleClass('active'));
        } else {
            $('#nav-links').show();
            $('.burger-menu').hide();
        }
    }

    handleBurgerMenu();
    $(window).resize(handleBurgerMenu);
});

function adjustVisibility() {
    const $ingredientsContainer = $('.container-ingredients2');
    const $directionsContainer = $('.container-directions2');

    if ($(window).width() <= 768) {
        const $ingredientsButton = $('.ingredient-title').addClass('toggle-button ingredients-btn');
        const $instructionsButton = $('.instruction-title').addClass('toggle-button instructions-btn');
        $('.content2').append($ingredientsButton).append($instructionsButton);

        $ingredientsContainer.addClass('visible');
        $directionsContainer.removeClass('visible');

        $ingredientsButton.click(() => {
            $ingredientsContainer.addClass('visible');
            $directionsContainer.removeClass('visible');
        });

        $instructionsButton.click(() => {
            $directionsContainer.addClass('visible');
            $ingredientsContainer.removeClass('visible');
        });
    } else {
        $ingredientsContainer.addClass('visible').css('height', 'auto');
        $directionsContainer.addClass('visible').css('height', 'auto');
        $('.toggle-button').remove();
    }
}

$(document).ready(adjustVisibility);
$(window).resize(adjustVisibility);
