import { setAlert, showAlert } from './alertHandler.js';

export async function renderTravelList(page = 1) {
    const travelListContainer = document.getElementById('travel-list');
    const travelCountContainer = document.getElementById('travel-count');
    const paginationContainer = document.getElementById('pagination-container');

    if (!travelListContainer || !travelCountContainer || !paginationContainer) return;

    try {
        const token = localStorage.getItem('token');
        if (!token) {
            //show error message after redirecting
            setAlert('Please login to view the list of travels', 'warning');
            window.location.href = 'login.html';
            return;
        }

        const response = await fetch(`/api/v1/travels?page=${page}&limit=5`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            //show error message in the same page
            showAlert(errorData.msg || 'Failed to fetch travels', 'danger');
            return;
        }

        const { travels, totalTravels, totalPages, currentPage } = await response.json();

        travelCountContainer.innerHTML = `Total Travels: ${totalTravels}`;
        travelListContainer.innerHTML = '';

        travels.forEach(travel => {
            const listItem = document.createElement('div');
            const formattedDate = new Date(travel.visitDate).toISOString().split('T')[0];
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <div>
                    <h5 class="mb-1">${travel.placeName}</h5>
                    <p class="mb-1">Location: ${travel.location}</p>
                    <small>Visit Date: ${formattedDate}</small>
                    <p>Description : ${travel.description}</p>
                </div>
                <div>
                    <button class="btn btn-warning btn-sm me-2 edit-btn" data-id="${travel._id}")">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTravel('${travel._id}')">Delete</button>
                </div>
            `;
            travelListContainer.appendChild(listItem);
        });

        // Clear current pagination
        paginationContainer.innerHTML = '';

        /*** Pagination Section Starts ***/

        // Previous Page Button
        if (currentPage > 1) {
            const prevPageButton = document.createElement('button');
            prevPageButton.classList.add('btn', 'btn-primary', 'btn-sm', 'me-2');
            prevPageButton.innerHTML = '⟨ Prev';
            prevPageButton.addEventListener('click', () => renderTravelList(currentPage - 1));
            paginationContainer.appendChild(prevPageButton);
        }

        // Page Number Buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageButton = document.createElement('button');
            pageButton.classList.add('btn', 'btn-sm', 'me-1');

            if (i === Number(currentPage)) {  // Ensure currentPage is a number
                pageButton.classList.add('btn-dark', 'text-white', 'fw-bold');
            } else {
                pageButton.classList.add('btn-primary');
            }

            pageButton.innerHTML = i;
            pageButton.addEventListener('click', () => renderTravelList(i));
            paginationContainer.appendChild(pageButton);
        }

        // Next Page Button
        if (currentPage < totalPages) {
            const nextPageButton = document.createElement('button');
            nextPageButton.classList.add('btn', 'btn-primary', 'btn-sm', 'ms-2');
            nextPageButton.innerHTML = 'Next ⟩';
            nextPageButton.addEventListener('click', () => {
                renderTravelList(Number(currentPage) + 1);
            });
            paginationContainer.appendChild(nextPageButton);
        }

        /*** Pagination Section Ends ***/

    } catch (error) {
        console.error('Error fetching travels:', error);
        showAlert('An error occurred. Please try again later.', 'danger');
    }
}

//redirect to form page with travel id to edit the record
export function editTravel(id) {
    window.location.href = `form.html?id=${id}`;
}

export async function deleteTravel(id) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            showAlert('You must be logged in to delete a travel record.', 'danger');
            return;
        }

        const response = await fetch(`/api/v1/travels/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.msg || 'Failed to delete travel record');
        }

        // Show alert immediately
        showAlert('Travel record deleted successfully!', 'success');

        // Re-render the travel list
        await renderTravelList();
    } catch (error) {
        console.error('Error deleting travel record:', error);
        showAlert('An error occurred while deleting the travel record.', 'danger');
    }
}

//search for records by place name
export function filterTravels() {
    let searchValue = document.getElementById("search").value.toLowerCase().trim();
    let travels = document.querySelectorAll(".list-group-item");
    let clearButton = document.getElementById("clearSearch");
    let noRecordsMessage = document.getElementById("noRecordsMessage");

    // Show or hide clear button based on search input
    clearButton.style.display = searchValue ? "block" : "none";

    let matchesFound = false; // Flag to check if any item matches the search

    travels.forEach(travel => {
        let placeNameElement = travel.querySelector("h5"); // Get the place name

        if (placeNameElement) {
            let placeName = placeNameElement.innerText.toLowerCase().trim();

            // If search is empty, show all items
            if (searchValue === "") {
                travel.style.display = ""; // Show all when input is empty
            } 
            // If search value exists, match the place name
            else if (placeName.startsWith(searchValue)) {
                travel.style.display = ""; // Reset to default (show the item)
                matchesFound = true; // Found a match
            } 
            else {
                travel.style.display = "none"; // Hide non-matching items
            }
        }
    });

    // Show "No records found" message if no matches
    if (!matchesFound && searchValue !== "") {
        noRecordsMessage.style.display = "block";
    } else {
        noRecordsMessage.style.display = "none";
    }
}

//clear search input
export function clearSearch() {
    let searchInput = document.getElementById("search");
    let clearButton = document.getElementById("clearSearch");
    let noResultFound = document.getElementById('noRecordsMessage')
    let travels = document.querySelectorAll(".list-group-item");

    searchInput.value = ""; // Clear input
    clearButton.style.display = "none"; // Hide clear button
    noResultFound.style.display = 'none'

    // Show all travels again
    travels.forEach(travel => {
        travel.style.display = ""; 
    });
}
// edit button event listener
document.getElementById('travel-list')?.addEventListener('click', (event) => {
    if (event.target.classList.contains('edit-btn')) {
        const travelId = event.target.dataset.id;
        window.location.href = `form.html?edit=${travelId}`; 
    }
});