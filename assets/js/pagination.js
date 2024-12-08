function loadPage(page, posts) {
    const postsPerPage = window.innerWidth <= 768 ? 10 : 20; // 10 for mobile, 20 for desktop
    const start = page * postsPerPage;
    const end = Math.min(start + postsPerPage, posts.length);
    loadRecipes(posts.slice(start, end)); // Load recipes for current page
    createPaginationButtons(page, posts, postsPerPage); // Pass postsPerPage to pagination
}

function loadRecipes(posts) {
    const lazyLoadImages = [
        '/assets/img/tofu-forno-batata-pimento-180px.webp',
        '/assets/img/tofu-na-cerveja-180px.webp',
        '/assets/img/tofu-sticky-180px.webp',
        '/assets/img/sopa-feijão-couve-180px.webp',
        '/assets/img/guisado-soja-180px.webp',
        '/assets/img/caldo-verde-180px.webp',
        '/assets/img/assado-batata-grao-180px.webp',
        '/assets/img/arroz-tomate-com-panados-180px.webp',
        '/assets/img/arroz-sem-pato-180px.webp',
        '/assets/img/sandes-grão-bico-180px.webp',
        '/assets/img/tofu-mexido-180px.webp',
        '/assets/img/soja-alentejana-180px.webp'
    ];

    const $postContainer = $('#post-container');

    if ($postContainer.children().length > 0) {
        return; // Prevent re-rendering if the content is already loaded
    }
    

    // Add a placeholder card with a green spinner for each post
    posts.forEach(post => {
        const $loadingCard = $(`
            <div class="card loading-card">
                <div class="card__spinner">
                    <div class="spinner"></div>
                </div>
            </div>
        `);

        $postContainer.append($loadingCard);

        // Preload the image
        const imagePath = post.image.replace(/\.(webp|png|jpg|jpeg)$/, '-180px.$1');
        const img = new Image();
        img.src = imagePath;

        img.onload = () => {
            // Ensure the spinner is only removed once
            if ($loadingCard.parent().length) {
                const lazyLoadAttribute = lazyLoadImages.includes(imagePath) ? 'loading="lazy"' : '';

                const $postElement = $(`
                    <a href="${post.url}" class="card">
                        <div class="card__overlay">
                            <p>${post.description}</p>
                        </div>
                        <div class="card__img-container">
                            <img src="${imagePath}" class="card__img" alt="${post.title}" ${lazyLoadAttribute}>
                        </div>
                        <div class="card__footer">
                            <span class="title-card">${post.title.toUpperCase()}</span>
                        </div>
                    </a>
                `);

                $loadingCard.replaceWith($postElement);
            }
        };

        img.onerror = () => {
            // Handle image loading error
            if ($loadingCard.parent().length) {
                $loadingCard.replaceWith(`
                    <div class="card error-card">
                        <p>Failed to load the recipe image.</p>
                    </div>
                `);
            }
        };
    });

    // Add spinner styles
    const spinnerStyles = `
        <style>
            .loading-card {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 270px; /* Adjust height as per your card design */
                border: 1px solid #ddd; /* Optional for card outline */
                margin: 10px;
                width:200px;
            }
            .card__spinner {
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100%;
                width: 100%;
            }
            .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(84, 130, 76, 0.2); /* Light green border */
                border-top: 4px solid #54824c; /* Solid green for spinning */
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                from {
                    transform: rotate(0deg);
                }
                to {
                    transform: rotate(360deg);
                }
            }
        </style>
    `;
    $('head').append(spinnerStyles);
}


function createPaginationButtons(currentPage, posts, postsPerPage) {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    $('#pagination-container').empty();

    const $firstPage = $('<button>').text('PRIMEIRA PÁGINA').addClass('pagination-button').on('click', () => {
        loadPage(0, posts);
        $(window).scrollTop(0); // Scroll to top
    });
    const $lastPage = $('<button>').text('ÚLTIMA PÁGINA').addClass('pagination-button').on('click', () => {
        loadPage(totalPages - 1, posts);
        $(window).scrollTop(0); // Scroll to top
    });
    const $prevPage = $('<button>').text('←').addClass('pagination-button').on('click', () => {
        loadPage(Math.max(0, currentPage - 1), posts);
        $(window).scrollTop(0); // Scroll to top
    });
    const $nextPage = $('<button>').text('→').addClass('pagination-button').on('click', () => {
        loadPage(Math.min(totalPages - 1, currentPage + 1), posts);
        $(window).scrollTop(0); // Scroll to top
    });

    $('#pagination-container').append($firstPage, $prevPage);

    if (currentPage > 2) $('#pagination-container').append($('<span>').text('1').addClass('pagination-button').on('click', () => loadPage(0, posts)));
    if (currentPage > 3) $('#pagination-container').append($('<span>').text('...').addClass('pagination-ellipsis'));

    for (let i = Math.max(0, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        const $pageButton = $('<button>').text(i + 1).addClass('pagination-button');
        if (i === currentPage) $pageButton.addClass('active');
        $pageButton.on('click', () => {
            loadPage(i, posts);
            $('html, body').animate({ scrollTop: 0 }, 400, 'linear'); 
        });
        $('#pagination-container').append($pageButton);
    }

    if (currentPage < totalPages - 4) $('#pagination-container').append($('<span>').text('...').addClass('pagination-ellipsis'));
    if (currentPage < totalPages - 3) $('#pagination-container').append($('<span>').text(totalPages).addClass('pagination-button').on('click', () => loadPage(totalPages - 1, posts)));

    $('#pagination-container').append($nextPage, $lastPage);
}
