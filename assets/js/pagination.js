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