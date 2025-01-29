let travelListContainer;
let placeNameInput, locationInput, visitDateInput;
let editingTravelId = null;
import { showAlert } from './index.js';

export async function renderTravelList() {
    travelListContainer = document.getElementById('travel-list');
    const travelCountContainer = document.getElementById('travel-count'); // container for the count display

    if (!travelListContainer || !travelCountContainer) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('Please login to view the list of travels','warning');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch('/api/v1/travels', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            showAlert(errorData.msg || 'Failed to fetch travels','danger');
            return;
        }

        const { travels } = await response.json();

        // Update the count display
        travelCountContainer.innerHTML = `Total Travels: ${travels.length}`;

        // Clear the container
        travelListContainer.innerHTML = '';

        // Populate the travel list
        travels.forEach(travel => {
            const listItem = document.createElement('div');
            const formattedDate = new Date(travel.visitDate).toISOString().split('T')[0];
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <div>
                    <h5 class="mb-1">${travel.placeName}</h5>
                    <p class="mb-1">Location: ${travel.location}</p>
                    <small>Visit Date: ${formattedDate}</small>
                </div>
                <div>
                    <button class="btn btn-warning btn-sm me-2" onclick="editTravel('${travel._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTravel('${travel._id}')">Delete</button>
                </div>
            `;
            travelListContainer.appendChild(listItem);
        });
    } catch (error) {
        console.error('Error fetching travels:', error);
        showAlert('An error occurred. Please try again later.','danger');
    }
}


//checks if user is logged in and the request record exists, put the values inside edit form input fields
export async function editTravel(id) {
    placeNameInput = document.getElementById('placeName');
    locationInput = document.getElementById('location');
    visitDateInput = document.getElementById('visitDate');

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('You must be logged in to delete a travel record.','danger');
            return;
        }
        const response = await fetch(`/api/v1/travels/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch travel data');
        }

        const data = await response.json();

        if (data.travel) {
            const formattedDate = new Date(data.travel.visitDate).toISOString().split('T')[0];
            placeNameInput.value = data.travel.placeName || '';
            locationInput.value = data.travel.location || '';
            visitDateInput.value = formattedDate || '';

            editingTravelId = id;
            
            toggleForm('edit',editingTravelId);
        } else {
            showAlert('No travel data found','warning');
        }
    } catch (error) {
        console.error('Error fetching travel:', error);
        showAlert('An error occurred while fetching travel details.','danger');
    }
}

export async function deleteTravel(id) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('You must be logged in to delete a travel record.','danger');
            return;
        }

        const response = await fetch(`/api/v1/travels/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`, // Send token for authentication
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to delete travel record');
        }

        showAlert('Travel record deleted successfully!','success');
        await renderTravelList(); // Refresh the travel list after deletion
    } catch (error) {
        console.error('Error deleting travel record:', error);
        showAlert('An error occurred while deleting the travel record.','warning');
    }
}

