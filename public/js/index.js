
import { renderTravelList, editTravel, deleteTravel,filterTravels,clearSearch } from './travel.js';

//add travel button event listener
document.getElementById('addTravel')?.addEventListener('click',()=>{
    window.location.href='form.html'
})

// Assign global functions for travel actions
window.editTravel = editTravel;
window.deleteTravel = deleteTravel;
window.filterTravels = filterTravels;
window.clearSearch = clearSearch;

// Ensure renderTravelList() runs after the page loads, then render travel list on page load
document.addEventListener("DOMContentLoaded", renderTravelList);


