
import { renderTravelList, editTravel, deleteTravel } from './travel.js';
import { toggleForm, cancelForm, handleSubmit } from './formHandler.js';
import { setupAuth, registerUser, loginUser } from './auth.js';

// Setup authentication
setupAuth();

// Register form event listeners
document.getElementById('registerForm')?.addEventListener('submit', registerUser);
document.getElementById('loginForm')?.addEventListener('submit', loginUser);
document.getElementById('travel-form')?.addEventListener('submit', handleSubmit);

// Assign global functions for travel actions
window.editTravel = editTravel;
window.deleteTravel = deleteTravel;
window.toggleForm = toggleForm; // Expose toggleForm to the global scope
window.cancelForm = cancelForm; // Expose cancelForm to the global scope
// window.handleSubmit = handleSubmit;
// Render travel list on page load
renderTravelList();

export function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('alert-box');
    
    if (!alertBox) {
        console.error('Error: alert-box element not found in DOM.');
        return;
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.role = 'alert';
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    alertBox.appendChild(alertDiv);

    setTimeout(() => {
        alertDiv.remove();
    }, 5000);
}
