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
    // Create a new XMLHttpRequest object
    const xhr = new XMLHttpRequest();

    // Configure the request
    xhr.open("POST", "/labs/4/api/definitions", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    // Define a callback function to handle the response
    xhr.onload = function () {
      if (xhr.status === 200) {
        // Parse the JSON response
        const responseData = JSON.parse(xhr.responseText);

        // Update the feedback element with the message returned from the server
        document.getElementById("feedback").innerText = responseData.message;
      } else {
        // Display a generic error message if the request fails
        document.getElementById("feedback").innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
      }
    };

    // Handle network errors
    xhr.onerror = function () {
      console.error('Error:', xhr.statusText);
      document.getElementById("feedback").innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
    };

    // Send the request with the JSON payload
    xhr.send(JSON.stringify({ word, definition }));
  } catch (error) {
    // Log any errors to the console
    console.error('Error:', error);

    // Display a generic error message if an error occurs
    document.getElementById("feedback").innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
  }
});
