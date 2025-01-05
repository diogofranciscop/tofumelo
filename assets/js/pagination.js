document.addEventListener("DOMContentLoaded", () => {
    const isMobile = window.innerWidth <= 768;
    const postsPerPage = isMobile ? 20 : 10; // Number of posts per page
    const postContainer = document.getElementById("post-container");
    const paginationContainer = document.getElementById("pagination-container");

    const loadPosts = (page = 1) => {
        const start = (page - 1) * postsPerPage;
        const end = start + postsPerPage;
        const currentPosts = allPosts.slice(start, end);
    
        postContainer.innerHTML = ""; // Clear current posts
        currentPosts.forEach((post, index) => {
            const card = `
                <a href="${post.url}" class="card" data-index="${allPosts.indexOf(post) + 1}">
                <div class="card loading-card">
                <div class="card__spinner">
                    <div class="spinner"></div>
                </div>
            </div>
                    ${post.new === "yes" ? '<div class="new-tape">Nova Receita</div>' : ""}
                    <div class="card__overlay"><p>${post.description}</p></div>
                    <div class="card__img-container">
                        <div class="spinner-container" id="spinner-${allPosts.indexOf(post)}">
                            <div class="spinner"></div>
                        </div>
                        <picture>
                            <source srcset="${post.image.replace('.webp', '-126px.webp')}" media="(max-width: 768px)" width="126" height="140">
                            <source srcset="${post.image.replace('.webp', '-180px.webp')}" media="(max-width: 1500px)" width="180" height="200">
                            <img 
                                src="${post.image}" 
                                class="card__img" 
                                alt="${post.title}" 
                                loading="auto"
                                onload="hideSpinner(${allPosts.indexOf(post)})"
                                onerror="hideSpinner(${allPosts.indexOf(post)}, true)"
                            >
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

// Functions to handle spinner visibility
function hideSpinner(index, isError = false) {
    const spinner = document.getElementById(`spinner-${index}`);
    if (spinner) {
        spinner.style.display = "none";
        if (isError) {
            spinner.insertAdjacentHTML('afterend', '<div class="error-placeholder">Image failed to load</div>');
        }
    }
}
