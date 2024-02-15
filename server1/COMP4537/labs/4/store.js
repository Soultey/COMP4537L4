document.getElementById("storeForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    const word = document.getElementById("wordInput").value.trim();
    const definition = document.getElementById("definitionInput").value.trim();
  
    if (!word || !definition) {
      document.getElementById("feedback").innerText = "Please fill in both fields.";
      return;
    }
  
    try {
      const response = await fetch('/api/definitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ word, definition })
      });
      const data = await response.json();
      document.getElementById("feedback").innerText = data.message;
    } catch (error) {
      console.error('Error:', error);
      document.getElementById("feedback").innerText = "An error occurred. Please try again.";
    }
  });
  