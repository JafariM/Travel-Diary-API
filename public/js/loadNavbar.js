
document.addEventListener("DOMContentLoaded", async function () {
    const navbarContainer = document.getElementById("navbar-container");

    try {
        // Fetch navbar.html and insert it into the page
        const response = await fetch("../navbar.html");
        const navbarHtml = await response.text();
        navbarContainer.innerHTML = navbarHtml;

        // Modify navbar based on user status
        updateNavbar();
    } catch (error) {
        console.error("Error loading navbar:", error);
    }
});

// Function to update navbar based on login status and page
function updateNavbar() {
    const navLinks = document.getElementById("nav-links");
    const token = localStorage.getItem("token");
    const currentPage = window.location.pathname;

    // Clear existing links
    navLinks.innerHTML = "";

      if (token) {
        // If user is logged in, show Logout button
        navLinks.innerHTML = `
            <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
            <li class="nav-item"><a class="nav-link" href="#" id="logout">Logout</a></li>
        `;

        // Add logout functionality
        document.getElementById("logout").addEventListener("click", function () {
            localStorage.removeItem("token");
            window.location.href = "login.html"; // Redirect to login
        });
    } else {
        // If user is NOT logged in, show Login & Register links
        navLinks.innerHTML = `
            <li class="nav-item" id="authLink"><a class="nav-link" href="login.html">Login</a></li>
            <li class="nav-item"><a class="nav-link" href="register.html">Register</a></li>
        `;
    }
}