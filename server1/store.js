const { USER_MESSAGES } = require('./lang/en/en');

// Add an event listener to the form with the ID "storeForm"
document.getElementById("storeForm").addEventListener("submit", async function (event) {
  // Prevent the default form submission behavior
  event.preventDefault();

  // Extract and trim the values of the word and definition inputs
  const wordInput = document.getElementById("wordInput");
  const definitionInput = document.getElementById("definitionInput");
  const word = wordInput.value.trim();
  const definition = definitionInput.value.trim();

  // Check if either the word or definition input is empty
  if (!word || !definition) {
    // Display an error message if either field is empty
    document.getElementById("feedback").innerText = USER_MESSAGES.pleaseFillInBothFields;
    return;
  }

  try {
    // Prepare the request options for the AJAX call
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Set the content type as JSON
      },
      body: JSON.stringify({ word, definition }) // Convert the word and definition data to JSON
    };

    // Send an AJAX request to the '/api/definitions' endpoint
    const response = await fetch('/api/definitions', requestOptions);

    // Parse the JSON response
    const responseData = await response.json();

    // Update the feedback element with the message returned from the server
    document.getElementById("feedback").innerText = responseData.message;
  } catch (error) {
    // Log any errors to the console
    console.error('Error:', error);

    // Display a generic error message if an error occurs
    document.getElementById("feedback").innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
  }
});
