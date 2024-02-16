document.addEventListener("DOMContentLoaded", function() {
  const searchForm = document.getElementById("searchForm");
  const searchInput = document.getElementById("searchInput");
  const result = document.getElementById("result");

  searchForm.addEventListener("submit", function(event) {
      event.preventDefault();
      const searchTerm = searchInput.value.trim();
    
      if (!searchTerm) {
          result.innerText = "Please enter a search term.";
          return;
      }
    
      // Send AJAX request
      fetch(`/labs/4/api/definitions/?word=${encodeURIComponent(searchTerm)}`)
          .then(response => {
              if (response.status === 404) {
                  result.innerText = `Word '${searchTerm}' not found in the dictionary.`;
                  return;
              }
              return response.json();
          })
          .then(data => {
              result.innerHTML = `<p><strong>${data.word}</strong>: ${data.definition}</p>`;
          })
          .catch(error => {
              console.error('Error:', error);
              result.innerText = "An error occurred. Please try again.";
          });
  });
});
