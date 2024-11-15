function loadPage(page, posts) {
    const postsPerPage = 20;
    const start = page * postsPerPage;
    const end = Math.min(start + postsPerPage, posts.length);
    loadRecipes(posts.slice(start, end));
    createPaginationButtons(page, posts);
}

function loadRecipes(posts) {
    $('#post-container').empty();
    posts.forEach(post => {
        const $postElement = $('<a>')
            .attr('href', post.url)
            .addClass('card')
            .html(`
                <div class="card__overlay"><p>${post.description}</p></div>
                <div class="card__img-container">
                    <img src="${post.image}" class="card__img" alt="Recipe Image">
                </div>
                <div class="card__footer">
                    <span class="title-card">${post.title.toUpperCase()}</span>
                </div>
            `);
        $('#post-container').append($postElement);
    });
}

function createPaginationButtons(currentPage, posts) {
    const totalPages = Math.ceil(posts.length / 20);
    $('#pagination-container').empty();

    const createButton = (text, onClick) => $('<button>').text(text).addClass('pagination-button').on('click', onClick);

    $('#pagination-container').append(createButton('PRIMEIRA PÁGINA', () => loadPage(0, posts)));
    if (currentPage > 0) $('#pagination-container').append(createButton('←', () => loadPage(currentPage - 1, posts)));

    for (let i = Math.max(0, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        const $pageButton = createButton(i + 1, () => loadPage(i, posts));
        if (i === currentPage) $pageButton.addClass('active');
        $('#pagination-container').append($pageButton);
    }

    if (currentPage < totalPages - 1) $('#pagination-container').append(createButton('→', () => loadPage(currentPage + 1, posts)));
    $('#pagination-container').append(createButton('ÚLTIMA PÁGINA', () => loadPage(totalPages - 1, posts)));
}
