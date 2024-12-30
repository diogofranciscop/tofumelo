document.addEventListener("DOMContentLoaded", () => {
    const postsPerPage = 20; // Number of posts per page
    const postContainer = document.getElementById("post-container");
    const paginationContainer = document.getElementById("pagination-container");

    const loadPosts = (page = 1) => {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const currentPosts = allPosts.slice(start, end);

        postContainer.innerHTML = ""; // Clear current posts
        currentPosts.forEach(post => {
            const card = `
                <a href="${post.url}" class="card" data-index="${allPosts.indexOf(post) + 1}">
                    ${post.new === "yes" ? '<div class="new-tape">Nova Receita</div>' : ""}
                    <div class="card__overlay"><p>${post.description}</p></div>
                    <div class="card__img-container">
                        <picture>
                            <source srcset="${post.image.replace('.webp', '-126px.webp')}" media="(max-width: 768px)" width="126" height="140">
                            <source srcset="${post.image.replace('.webp', '-180px.webp')}" media="(max-width: 1500px)" width="180" height="200">
                            <img src="${post.image}" class="card__img" alt="${post.title}" loading="auto">
                        </picture>
                    </div>
                    <div class="card__footer">
                        <span class="title-card">${post.title.toUpperCase()}</span>
                    </div>
                </a>
            `;
            postContainer.insertAdjacentHTML("beforeend", card);
        });

        // Reapply filter functionality
        if (typeof initializeFilters === "function") {
            initializeFilters();
        }
    };

    const createPaginationButtons = () => {
        const totalPages = Math.ceil(allPosts.length / postsPerPage);
        paginationContainer.innerHTML = ""; // Clear existing buttons

        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement("button");
            button.textContent = i;
            button.classList.add("pagination-button");
            button.addEventListener("click", () => {
                loadPosts(i);
                window.scrollTo({ top: 0, behavior: "smooth" }); // Scroll to top
            });
            paginationContainer.appendChild(button);
        }
    };

    // Initial load
    loadPosts(1);
    createPaginationButtons();
});
