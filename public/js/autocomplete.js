document.getElementById('location').addEventListener('input', async (event) => {
    const text = event.target.value;
    if (text.length < 3) return; // Start fetching after 3 characters

    try {
        const response = await fetch(`/api/location/autocomplete?text=${text}`);
        const data = await response.json();

        // Clear previous suggestions
        const suggestionList = document.getElementById('suggestions');
        suggestionList.innerHTML = '';

        // Check if there are any features
        if (data.features && data.features.length > 0) {
            // Show suggestions list
            suggestionList.style.display = 'block';

            data.features.forEach((feature) => {
                // Create a new list item for each suggestion
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item', 'suggestion');
                listItem.textContent = feature.properties.formatted;

                // Append the list item to the suggestions list
                suggestionList.appendChild(listItem);

                // Add event listener to each suggestion to handle selection
                listItem.addEventListener('click', () => {
                    document.getElementById('location').value = feature.properties.formatted;
                    suggestionList.innerHTML = ''; // Clear suggestions after selection
                    suggestionList.style.display = 'none'; // Hide suggestions
                });
            });
        } else {
            // Hide suggestions if no data is found
            suggestionList.style.display = 'none';
        }
    } catch (error) {
        console.error('Error fetching suggestions:', error);
    }
});