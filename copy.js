import { setupAuth, registerUser, loginUser } from './auth.js';
setupAuth()
document.getElementById('registerForm')?.addEventListener('submit', registerUser);
document.getElementById('loginForm')?.addEventListener('submit', loginUser);

    const travelListContainer = document.getElementById('travel-list');
    const formContainer = document.getElementById('form-container');
    const formTitle = document.getElementById('form-title');
    const submitButton = document.getElementById('submit-button');
    const placeNameInput = document.getElementById('placeName');
    const locationInput = document.getElementById('location');
    const visitDateInput = document.getElementById('visitDate');
    let editingTravelId = null;

    // Render the travel list
    async function renderTravelList() {
        if(!travelListContainer) return;

        try {
            const token = localStorage.getItem('token')
            if(!token){
                alert('Please login to view the list of travels')
                window.location.href = 'login.html';
                return
            }
            
            const response = await fetch('/api/v1/travels',{
                method: 'GET',
                headers:{
                    'Authorization': `Bearer ${token}`, // Send the token in the Authorization header
                    'Content-Type': 'application/json'
                }
                
            })
            
            if(!response.ok){
                const errorData = await response.json();
                alert(errorData.msg || 'Failed to fetch travels');
                return;
            }
            const {travels}= await response.json()
             // Clear the container
        travelListContainer.innerHTML = '';

        // Populate the travel list
        travels.forEach(travel => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            listItem.innerHTML = `
                <div>
                    <h5 class="mb-1">${travel.placeName}</h5>
                    <p class="mb-1">Location: ${travel.location}</p>
                    <small>Visit Date: ${travel.visitDate}</small>
                </div>
                <div>
                    <button class="btn btn-warning btn-sm me-2" onclick="editTravel('${travel._id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteTravel(${travel._id})">Delete</button>
                </div>
            `;
            travelListContainer.appendChild(listItem);
        });
        } catch (error) {
            console.error('Error fetching travels:', error);
            alert('An error occurred. Please try again later.');
        }
        
    }

    // Edit travel
    async function editTravel(id) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`/api/v1/travels/${id}`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`, // Send token for authentication
                    'Content-Type': 'application/json'
                }
            });
    
            if (!response.ok) {
                throw new Error('Failed to fetch travel data');
            }
    
            const data = await response.json();  // Parse response as JSON
    
            if (data.travel) {
                // Convert the ISO date format to 'YYYY-MM-DD'
                const dateObject = new Date(data.travel.visitDate);
                const formattedDate = dateObject.toISOString().split('T')[0];  // Extract YYYY-MM-DD part
                console.log('place ',data.travel);
                
                placeNameInput.value = data.travel.placeName || '';
                locationInput.value = data.travel.location || '';
                visitDateInput.value = formattedDate || '';
                
                editingTravelId = id;
                toggleForm('edit');
            } else {
                alert('No travel data found');
            }
    
        } catch (error) {
            console.error('Error fetching travel:', error);
            alert('An error occurred while fetching travel details.');
        }
    }
    
    

    // Delete travel
    function deleteTravel(id) {
        const index = travels.findIndex(t => t.id === id);
        travels.splice(index, 1);
        renderTravelList();
    }

    // Show and hide the form
    function toggleForm(view) {
        document.getElementById('addTravel').style.display = 'none';
        document.getElementById('travelHeader').style.display = 'none';
        if (view === 'add') {
            formTitle.innerText = 'Add Travel';
            submitButton.innerText = 'Add Travel';
            placeNameInput.value = '';
            locationInput.value = '';
            visitDateInput.value = '';
            editingTravelId = null;
        } else if (view === 'edit') {
            formTitle.innerText = 'Edit Travel';
            submitButton.innerText = 'Update Travel';
        }

        // Toggle the form and the travel list
        formContainer.style.display = 'flex';
        travelListContainer.style.display = 'none';
    }

    // Cancel form and show the list again
    function cancelForm() {
        formContainer.style.display = 'none';
        travelListContainer.style.display = 'block';
        document.getElementById('addTravel').style.display = 'inline-block';
        document.getElementById('travelHeader').style.display = 'block';
    }

    //Handle form submittion (add or edit)
    async function handleSubmit(event) {
        event.preventDefault();
    
        const placeName = placeNameInput.value;
        const location = locationInput.value;
        const visitDate = visitDateInput.value;
    
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to add or update a travel record.');
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
                        'Authorization': `Bearer ${token}`,  // Send token for authentication
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(travelData)
                });
            } else {
                // Adding a new travel
                response = await fetch('/api/v1/travels', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,  // Send token for authentication
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(travelData)
                });
            }
    
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.msg || 'Failed to save travel record');
            }
    
            const result = await response.json();
    
            cancelForm(); // Hide the form
            renderTravelList(); // Re-fetch the updated travel list from the server
        } catch (error) {
            console.error('Error saving travel:', error);
            alert('An error occurred while saving the travel record.');
        }
    }
    
   
    // Initial render of travel list
    renderTravelList();
