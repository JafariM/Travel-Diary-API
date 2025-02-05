import { renderTravelList } from './travel.js';
import { showAlert } from './index.js';

let formContainer, formTitle, submitButton, travelListContainer;
let editingTravelId = null;

export function toggleForm(view, travelId = null) {
    formContainer = document.getElementById('form-container');
    formTitle = document.getElementById('form-title');
    submitButton = document.getElementById('submit-button');
    travelListContainer = document.getElementById('travel-list');

    document.getElementById('addTravel').style.display = 'none';
    document.getElementById('travelHeader').style.display = 'none';

    if (view === 'add') {
        formTitle.innerText = 'Add Travel';
        submitButton.innerText = 'Add Travel';
        resetFormInputs();
        editingTravelId = null;  // Reset editingTravelId when adding
    } else if (view === 'edit') {
        formTitle.innerText = 'Edit Travel';
        submitButton.innerText = 'Update Travel';
        editingTravelId = travelId; // Set editingTravelId to the passed ID
    }

    formContainer.style.display = 'flex';
    travelListContainer.style.display = 'none';
}


export function cancelForm() {
    formContainer.style.display = 'none';
    travelListContainer.style.display = 'block';
    document.getElementById('addTravel').style.display = 'inline-block';
    document.getElementById('travelHeader').style.display = 'block';

    // Reset the editingTravelId
    editingTravelId = null;
}


export async function handleSubmit(event) {
    event.preventDefault();

    const placeName = document.getElementById('placeName').value;
    const location = document.getElementById('location').value;
    const visitDate = document.getElementById('visitDate').value;

    const token = localStorage.getItem('token');
    if (!token) {
        showAlert('You must be logged in to add or update a travel record.','warning');
        return;
    }

    const travelData = {
        placeName,
        location,
        visitDate,
    };

    try {
        let response;

        // Check if we are editing an existing travel 
        if (editingTravelId) { 
            response = await fetch(`/api/v1/travels/${editingTravelId}`, {
                method: 'PATCH', 
                headers: {
                    'Authorization': `Bearer ${token}`, // Send token for authentication
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelData),
            });
        } else {
            // Adding a new travel
            response = await fetch('/api/v1/travels', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`, // Send token for authentication
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(travelData),
            });
        }

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to save travel record');
        }

        const result = await response.json();

        cancelForm(); // Hide the form
        await renderTravelList(); // Re-fetch the updated travel list from the server
    } catch (error) {
        console.error('Error saving travel:', error);
        showAlert('An error occurred while saving the travel record.','warning');
    }
}


function resetFormInputs() {
    document.getElementById('placeName').value = '';
    document.getElementById('location').value = '';
    document.getElementById('visitDate').value = '';
}
