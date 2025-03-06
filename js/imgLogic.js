document.addEventListener("DOMContentLoaded", () => {
    const mediaElements = document.querySelectorAll(".blog-media");
    const viewer = document.createElement("div");
    viewer.classList.add("image-viewer");
    viewer.innerHTML = `
        <span class="close-btn">&times;</span>
        <button class="prev-btn">&#10094;</button>
        <img src="" alt="Imagen ampliada">
        <video src="" controls></video>
        <button class="next-btn">&#10095;</button>
        <button class="zoom-in-btn">+</button>
        <button class="zoom-out-btn">-</button>
    `;
    document.body.appendChild(viewer);

    const viewerImg = viewer.querySelector("img");
    const viewerVideo = viewer.querySelector("video");
    const closeBtn = viewer.querySelector(".close-btn");
    const prevBtn = viewer.querySelector(".prev-btn");
    const nextBtn = viewer.querySelector(".next-btn");
    const zoomInBtn = viewer.querySelector(".zoom-in-btn");
    const zoomOutBtn = viewer.querySelector(".zoom-out-btn");

    let mediaList = [];
    let currentIndex = 0;

    mediaElements.forEach((media, index) => {
        // Mostrar solo las primeras tres imágenes o videos
        if (index >= 3) {
            media.style.display = "none";
        }

        media.addEventListener("click", () => {
            mediaList = Array.from(media.closest(".entry").querySelectorAll(".blog-media"));
            currentIndex = mediaList.indexOf(media);
            showMedia(currentIndex);
        });

        // Si hay más de una imagen, añadir el contador
        if (index === 0 && media.closest(".entry").querySelectorAll(".blog-media").length > 3) {
            const overlay = document.createElement("div");
            overlay.classList.add("image-overlay");
            overlay.textContent = `+${media.closest(".entry").querySelectorAll(".blog-media").length - 3}`;
            media.parentElement.style.position = "relative";
            media.parentElement.appendChild(overlay);
        }
    });

    function showMedia(index) {
        const media = mediaList[index];
        if (media.tagName === "IMG") {
            viewerImg.src = media.src;
            viewerVideo.style.display = "none";
            viewerImg.style.display = "block";
        } else if (media.tagName === "VIDEO") {
            viewerVideo.src = media.src;
            viewerImg.style.display = "none";
            viewerVideo.style.display = "block";
        }
        viewer.classList.add("active");
    }

    closeBtn.addEventListener("click", () => {
        viewer.classList.remove("active");
    });

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex > 0) ? currentIndex - 1 : mediaList.length - 1;
        showMedia(currentIndex);
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex < mediaList.length - 1) ? currentIndex + 1 : 0;
        showMedia(currentIndex);
    });

    zoomInBtn.addEventListener("click", () => {
        const currentMedia = mediaList[currentIndex];
        if (currentMedia.tagName === "IMG") {
            viewerImg.style.transform = "scale(1.2)";
        } else if (currentMedia.tagName === "VIDEO") {
            viewerVideo.style.transform = "scale(1.2)";
        }
    });

    zoomOutBtn.addEventListener("click", () => {
        const currentMedia = mediaList[currentIndex];
        if (currentMedia.tagName === "IMG") {
            viewerImg.style.transform = "scale(1)";
        } else if (currentMedia.tagName === "VIDEO") {
            viewerVideo.style.transform = "scale(1)";
        }
    });

    viewer.addEventListener("click", (e) => {
        if (e.target === viewer) viewer.classList.remove("active");
    });
});
