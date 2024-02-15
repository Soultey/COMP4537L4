document.getElementById("searchForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const searchTerm = document.getElementById("searchInput").value.trim();
  
    if (!searchTerm) {
      document.getElementById("result").innerText = "Please enter a search term.";
      return;
    }
  
    try {
      const response = await fetch(`/api/definitions?word=${encodeURIComponent(searchTerm)}`);
      if (response.status === 404) {
        document.getElementById("result").innerText = `Word '${searchTerm}' not found in the dictionary.`;
        return;
      }
      const data = await response.json();
      document.getElementById("result").innerHTML = `<p><strong>${data.word}</strong>: ${data.definition}</p>`;
    } catch (error) {
      console.error('Error:', error);
      document.getElementById("result").innerText = "An error occurred. Please try again.";
    }
  });
  