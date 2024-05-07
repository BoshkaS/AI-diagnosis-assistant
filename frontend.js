document.addEventListener("DOMContentLoaded", async () => {
    const blogSection = document.getElementById("blog-section");
    try {
        const response = await fetch("/posts");
        const posts = await response.json();
        posts.forEach(post => {
            const article = document.createElement("article");
            article.innerHTML = `
                <h2>${post.title}</h2>
                <p>Date: ${post.date}</p>
                <p>Author: ${post.author}</p>
                <p>${post.content}</p>
            `;
            blogSection.appendChild(article);
        });
    } catch (error) {
        console.error("Error fetching posts:", error);
    }
});
