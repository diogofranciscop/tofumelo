/****************************************************************************
 * 1) SPINNER STYLES ADDED ON DOM CONTENT LOADED
 ****************************************************************************/
document.addEventListener("DOMContentLoaded", function () {
    // Add spinner styles once
    if (!$('#spinner-styles').length) {
        const spinnerStyles = `
            <style id="spinner-styles">
                .loading-card {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    height: 270px; /* Adjust height as per your card design */
                    border: 1px solid #ddd;
                    margin: 10px;
                    width: 200px;
                }
                @media(max-width: 800px) {
                    .loading-card {
                        height: 190px;
                        width: 140px;
                    }
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
                    border: 4px solid rgba(84, 130, 76, 0.2);
                    border-top: 4px solid #54824c;
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

    // Decide how many posts per page based on screen size
    const postsPerPage = window.innerWidth <= 768 ? 10 : 20;
    const totalPages = Math.ceil(allPosts.length / postsPerPage);

    // If there is more than one page of posts, display pagination
    if (totalPages > 1) {
        createPaginationButtons(0, allPosts, postsPerPage);
    }

    // IMPORTANT: We do NOT call loadPage(0, allPosts) here.
    // The first page is already rendered server-side (limited to 10 or 20 posts),
    // so we avoid double-loading those posts.

    // If you need a loader element:
    // const loader = document.getElementById("loader"); 
});

/****************************************************************************
 * 2) LOAD PAGE (CALLED ONLY BY PAGINATION OR FILTER ACTIONS)
 ****************************************************************************/
function loadPage(page, posts) {
    const postsPerPage = window.innerWidth <= 768 ? 10 : 20;
    const start = page * postsPerPage;
    const end = Math.min(start + postsPerPage, posts.length);
    const newPosts = posts.slice(start, end);

    // Clear the current content in #post-container
    $('#post-container').empty();

    // Load the new set of recipes for the selected page
    loadRecipes(newPosts);

    // Update pagination buttons
    createPaginationButtons(page, posts, postsPerPage);

    // Scroll to top for better UX
    $(window).scrollTop(0);
}

/****************************************************************************
 * 3) LOAD RECIPES (SETS UP SPINNERS AND SWAPS IN LOADED IMAGES)
 ****************************************************************************/
function loadRecipes(posts) {
    const $postContainer = $('#post-container');
    $postContainer.empty();

    // Decide how many images will skip lazy loading
    // If width ≤ 768 → skip first 4, else skip first 8
    const skipLazyCount = window.innerWidth <= 768 ? 4 : 8;

    // Loop through posts and set up preloading
    posts.forEach((post, index) => {
        // Create a placeholder "loading card"
        const $loadingCard = $(`
            <div class="card loading-card">
                <div class="card__spinner">
                    <div class="spinner"></div>
                </div>
            </div>
        `);
        $postContainer.append($loadingCard);

        // Preload the 180px version of the image
        const imagePath = post.image.replace(/\.(webp|png|jpg|jpeg)$/, '-180px.$1');
        const img = new Image();
        img.src = imagePath;

        img.onload = () => {
            if ($loadingCard.parent().length) {
                // Disable lazy loading for the first "skipLazyCount" images
                let lazyLoadAttribute = 'loading="lazy"';
                if (index < skipLazyCount) {
                    lazyLoadAttribute = '';
                }

                const newTape = post.new === "yes"
                  ? '<div class="new-tape">Nova Receita</div>'
                  : '';

                const $postElement = $(`
                    <a href="${post.url}" class="card">
                        ${newTape}
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
            if ($loadingCard.parent().length) {
                $loadingCard.replaceWith(`
                    <div class="card error-card">
                        <p>Failed to load the recipe image.</p>
                    </div>
                `);
            }
        };
    });
}

/****************************************************************************
 * 4) CREATE PAGINATION BUTTONS (INVOKES loadPage() ONLY ONCE CLICKED)
 ****************************************************************************/
function createPaginationButtons(currentPage, posts, postsPerPage) {
    const totalPages = Math.ceil(posts.length / postsPerPage);
    $('#pagination-container').empty();

    // PAGINATION NAVIGATION CONTROLS
    const $firstPage = $('<button>')
        .text('PRIMEIRA PÁGINA')
        .addClass('pagination-button')
        .on('click', () => loadPage(0, posts));

    const $lastPage = $('<button>')
        .text('ÚLTIMA PÁGINA')
        .addClass('pagination-button')
        .on('click', () => loadPage(totalPages - 1, posts));

    const $prevPage = $('<button>')
        .text('←')
        .addClass('pagination-button')
        .on('click', () => loadPage(Math.max(0, currentPage - 1), posts));

    const $nextPage = $('<button>')
        .text('→')
        .addClass('pagination-button')
        .on('click', () => loadPage(Math.min(totalPages - 1, currentPage + 1), posts));

    $('#pagination-container').append($firstPage, $prevPage);

    // Shortcut link for the first page / ellipsis
    if (currentPage > 2) {
        $('#pagination-container').append(
            $('<span>')
                .text('1')
                .addClass('pagination-button')
                .on('click', () => loadPage(0, posts))
        );
    }
    if (currentPage > 3) {
        $('#pagination-container').append(
            $('<span>').text('...').addClass('pagination-ellipsis')
        );
    }

    // Page number buttons around the current page
    for (let i = Math.max(0, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        const $pageButton = $('<button>')
            .text(i + 1)
            .addClass('pagination-button');

        if (i === currentPage) {
            $pageButton.addClass('active');
        }

        $pageButton.on('click', () => loadPage(i, posts));
        $('#pagination-container').append($pageButton);
    }

    if (currentPage < totalPages - 4) {
        $('#pagination-container').append(
            $('<span>').text('...').addClass('pagination-ellipsis')
        );
    }
    if (currentPage < totalPages - 3) {
        $('#pagination-container').append(
            $('<span>')
                .text(totalPages)
                .addClass('pagination-button')
                .on('click', () => loadPage(totalPages - 1, posts))
        );
    }

    $('#pagination-container').append($nextPage, $lastPage);
}
