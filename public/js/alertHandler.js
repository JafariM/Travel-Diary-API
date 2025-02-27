

// Function to store alert message in localStorage
export function setAlert(message, type) {
    localStorage.setItem('alertMessage', message);
    localStorage.setItem('alertType', type);
}

// Function to check and display stored alert messages
export function handleStoredAlerts() {
    // setTimeout(() => {
        const alertMessage = localStorage.getItem('alertMessage');
        const alertType = localStorage.getItem('alertType');

        if (alertMessage) {
            showAlert(alertMessage, alertType);
            localStorage.removeItem('alertMessage');
            localStorage.removeItem('alertType');
        }
    // }, 500); // Delay to ensure localStorage is updated before checking
}

export function showAlert(message, type) {
    const alertContainer = document.getElementById('alert-container');
    if (alertContainer) {
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert', `alert-${type}`, 'alert-dismissible', 'fade', 'show');
        alertElement.innerHTML = `
            <strong>${type === 'success' ? 'Success' : 'Error'}:</strong> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        alertContainer.appendChild(alertElement);

        // Automatically remove the alert after 5 seconds
        setTimeout(() => {
            alertElement.remove();
        }, 5000);
    }
}

// Automatically check alerts on page load
document.addEventListener('DOMContentLoaded', handleStoredAlerts);