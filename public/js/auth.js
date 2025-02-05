import { showAlert } from './index.js';

// Setup authentication link (login/logout toggle)
export function setupAuth() {
    document.addEventListener('DOMContentLoaded', () => {
        const authLink = document.getElementById('authLink');

        // Check if the user is logged in (based on token presence in local storage)
        const token = localStorage.getItem('token');

        if (token) {
            // If logged in, change the text to "Logout"
            authLink.innerHTML = `<a class="nav-link" href="#" id="logout">Logout</a>`;

            // Add logout functionality
            document.getElementById('logout').addEventListener('click', () => {
                localStorage.removeItem('token'); // Remove token from local storage
                window.location.href = 'login.html'; // Redirect to login page
            });
        }
    });
}

// Register user
export async function registerUser(event) {
    event.preventDefault(); // Prevent the default form submission

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/v1/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            showAlert(errorData.msg || 'Registration failed','danger');
            return;
        }

        const data = await response.json();
        showAlert(`Registration successful! Welcome, ${data.user.name}`,'success');
        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during registration:', error);
        showAlert('An error occurred. Please try again later.','warning');
    }
}

// Login user
export async function loginUser(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/v1/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
        
            const errorData = await response.json();
            showAlert(errorData.msg || 'Login failed', 'danger');
            return;
        }

        const data = await response.json();

        // Store the token in localStorage
        localStorage.setItem('token', data.token);

        window.location.href = 'index.html';
    } catch (error) {
        console.error('Error during login:', error);
        showAlert('An error occurred. Please try again later.','danger');
    }
}
