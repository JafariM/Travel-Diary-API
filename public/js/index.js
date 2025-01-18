    // Sample data, replace with dynamic fetch if needed
    const travels = [
        { id: 1, placeName: "Paris", location: "France", visitDate: "2023-10-10" },
        { id: 2, placeName: "Tokyo", location: "Japan", visitDate: "2023-11-15" }
    ];

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
                window.location.href('login.html')
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
                    <button class="btn btn-warning btn-sm me-2" onclick="editTravel(${travel._id})">Edit</button>
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
    function editTravel(id) {
        const travel = travels.find(t => t.id === id);
        placeNameInput.value = travel.placeName;
        locationInput.value = travel.location;
        visitDateInput.value = travel.visitDate;
        editingTravelId = id;
        toggleForm('edit');
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

    // Handle form submission (Add or Edit)
    function handleSubmit(event) {
        event.preventDefault();
        const placeName = placeNameInput.value;
        const location = locationInput.value;
        const visitDate = visitDateInput.value;

        if (editingTravelId) {
            const travel = travels.find(t => t.id === editingTravelId);
            travel.placeName = placeName;
            travel.location = location;
            travel.visitDate = visitDate;
        } else {
            const newTravel = { id: travels.length + 1, placeName, location, visitDate };
            travels.push(newTravel);
        }

        cancelForm();
        renderTravelList();
    }

    //toggle login,logout
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
    

   
    // Initial render of travel list
    renderTravelList();
