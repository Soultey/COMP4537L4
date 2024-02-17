// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Get references to the search form, search input, and result elements
    const searchForm = document.getElementById("searchForm");
    const searchInput = document.getElementById("searchInput");
    const result = document.getElementById("result");
  
    // Add an event listener to the search form
    searchForm.addEventListener("submit", function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();
  
        // Get the value of the search input and trim any leading/trailing whitespace
        const searchTerm = searchInput.value.trim();
      
        // Check if the search term is empty
        if (!searchTerm) {
            // Display an error message if the search term is empty
            result.innerText = "Please enter a search term.";
            return;
        }
      
        // Send an AJAX request to retrieve the definition for the search term
        fetch(`/labs/4/api/definitions/?word=${encodeURIComponent(searchTerm)}`)
            .then(response => {
                // Check if the response status is 404 (Not Found)
                if (response.status === 404) {
                    // Display a message indicating that the word was not found in the dictionary
                    result.innerText = `Word '${searchTerm}' not found in the dictionary.`;
                    return;
                }
                // Parse the JSON response
                return response.json();
            })
            .then(data => {
                // Display the word and its definition in the result element
                result.innerHTML = `<p><strong>${data.word}</strong>: ${data.definition}</p>`;
            })
            .catch(error => {
                // Log any errors to the console
                console.error('Error:', error);
                // Display a generic error message if an error occurs
                result.innerText = "An error occurred. Please try again.";
            });
    });
  });
  