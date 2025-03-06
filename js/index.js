// Home click handler
document.getElementById("sidebar-header").addEventListener("click", function () {
    // Cargar la página de bienvenida en el iframe
    document.getElementById("content-frame").src = "bienvenida.html";
});

// Month list click handler
document.querySelectorAll('.month-list li').forEach(li => {
    li.addEventListener('click', function () {
        // Remove active class from all items
        document.querySelectorAll('.month-list li').forEach(item => item.classList.remove('active'));

        // Add active class to clicked item
        this.classList.add('active');

        // Load the corresponding page
        const page = this.getAttribute('data-page');
        document.getElementById('content-frame').src = page;
    });
});

// Year toggle handler
document.querySelectorAll('.year-toggle').forEach(toggle => {
    toggle.addEventListener('click', function () {
        const yearContent = this.nextElementSibling;
        const icon = this.querySelector('span');

        if (yearContent.classList.contains('active')) {
            yearContent.classList.remove('active');
            icon.textContent = '▶';
        } else {
            // Close all other year contents
            document.querySelectorAll('.year-content').forEach(content => {
                content.classList.remove('active');
            });
            document.querySelectorAll('.year-toggle span').forEach(span => {
                span.textContent = '▶';
            });

            // Open this year's content
            yearContent.classList.add('active');
            icon.textContent = '▼';
        }
    });
});