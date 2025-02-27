import { setAlert, showAlert } from './alertHandler.js';

let formTitle = document.getElementById('form-title');
let submitButton = document.getElementById('submit-button');
let placeNameInput = document.getElementById('placeName');
let locationInput = document.getElementById('location');
let visitDateInput = document.getElementById('visitDate');
let descriptionInput = document.getElementById('description')

let editingTravelId = null;

// Event Listener for Form Submission
document.getElementById('travel-form')?.addEventListener('submit', handleSubmit);

//  Reset Form Inputs (Reuses Global Elements)
function resetFormInputs() {
    placeNameInput.value = '';
    locationInput.value = '';
    visitDateInput.value = '';
    descriptionInput.value = '';
}

// Fetch Travel Data for Editing
export async function loadTravelData(travelId) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            setAlert('Please login to edit the record', 'warning');
            return;
        }

        const response = await fetch(`/api/v1/travels/${travelId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            setAlert('Faild to fetch travel data','danger')
            return;
        }

        const result = await response.json();
        
        placeNameInput.value = result.travel.placeName;
        locationInput.value = result.travel.location;
        visitDateInput.value = new Date(result.travel.visitDate).toISOString().split('T')[0];
        descriptionInput.value = result.travel.description;
    } catch (error) {
        console.error('Error loading travel data:', error);
        setAlert('An error occurred while loading travel data','danger')
    }
}

// Toggle Between Add & Edit Form
export function toggleForm(view, travelId = null) {
    if (!formTitle || !submitButton) return; // Ensure elements exist

    if (view === 'add') {
        formTitle.innerText = 'Add Travel';
        submitButton.innerText = 'Add Travel';
        resetFormInputs();
        editingTravelId = null;
    } else if (view === 'edit' && travelId) {
        formTitle.innerText = 'Edit Travel';
        submitButton.innerText = 'Update Travel';
        editingTravelId = travelId;
        loadTravelData(travelId);
    }
}

// Handle Form Submission (Reuses Global Inputs)
export async function handleSubmit(event) {
    event.preventDefault();

    const placeName = placeNameInput.value.trim();
    const location = locationInput.value.trim();
    const visitDate = visitDateInput.value.trim();
    const description = descriptionInput.value ? descriptionInput.value.trim() : '';

    const token = localStorage.getItem('token');
    if (!token) {
        setAlert('You must be logged in to add or update a travel record.', 'warning');
        return;
    }

    const travelData = { placeName, location, visitDate, description };

    try {
        const isEditing = !!editingTravelId;
        let response;

        if (isEditing) {
            response = await fetch(`/api/v1/travels/${editingTravelId}`, {
                method: 'PATCH',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelData),
            });
        } else {
            response = await fetch('/api/v1/travels', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelData),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            setAlert(errorData.msg || 'Failed to save travel record','danger')
        }
        cancelForm();

        setAlert(isEditing ? 'Travel record updated successfully!' : 'New travel record added successfully!', 'success')

        // Redirect to the index page (this triggers the alert display)
            window.location.href = 'index.html';

    } catch (error) {
        console.error('Error saving travel:', error);

        setAlert(error.message || 'An error occurred while saving the travel record.', 'danger');
    }
}

// Handle Form Cancellation
export function cancelForm() {
    resetFormInputs();
    editingTravelId = null;

    if (window.location.pathname !== '/index.html') {
        window.location.href = 'index.html';
    }
}

// Auto-Load Form Based on URL Parameters
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const travelId = urlParams.get('edit');

    if (travelId) {
        toggleForm('edit', travelId);
    } else {
        toggleForm('add');
    }
});
