import { USER_MESSAGES } from './lang/en/en.js';
const { searchEndpoint } = await getJSON('./config.json');

/** Used ChatGPT as a guide. */

// Add event listener for form submit.
document.addEventListener('submit', (event) => {
  event.preventDefault();
  handleStore();
});

/** Returns the data and status of a JSON file.
 * 
 * @param {string} url The path to the file.
 * @author ChatGPT
 * @returns 
 */
async function getJSON(path) {
  return new Promise((resolve, reject) => {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
      if (this.readyState === 4) {
        if (this.status === 200) {
          try {
            const data = JSON.parse(this.responseText);
            resolve(data);
          } catch (error) {
            reject(error);
          }
        } else {
          reject(new Error('Failed to load JSON, status code: ' + this.status));
        }
      }
    };
    xhttp.open("GET", path, true);
    xhttp.send();
  });
}


/** Performs a search at the url.
 * 
 *  
 */
async function handleStore() {
  // Attempt the search.
  try {
    // Get the url and search term.
    const url = searchEndpoint;
    const wordInput = document.getElementById('wordInput');
    const definitionInput = document.getElementById('definitionInput');
    const feedback = document.getElementById('feedback');

    // Get the word and definition.
    const word = wordInput.value;
    const definition = definitionInput.value;

    if (!url) {
      throw new Error(`url is ${url}`);
    }

    // If no feedback element, throw an error.
    if (!feedback) {
      throw new Error(`feedback is ${feedback}`);
    }

    // If no word or definition, display error message.
    if (!word || !definition) {
      feedback.innerText = USER_MESSAGES.pleaseFillInBothFields;
      return;
    }

    // Prepare xhttp for the POST request
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", url, true);
    // Set the content type to JSON
    xhttp.setRequestHeader("Content-Type", "application/json");

    // Define what happens on successful data submission
    xhttp.onload = function () {
      if (xhttp.status >= 200 && xhttp.status < 300) {
        // Parse JSON response and display
        const result = JSON.parse(xhttp.responseText);
        feedback.innerText = JSON.stringify(result);
      } else {
        // Handle errors, if any
        feedback.innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
      }
    };

    // Define what happens in case of an error
    xhttp.onerror = function () {
      feedback.innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
    };

    // Send the request with the word and definition as JSON
    xhttp.send(JSON.stringify({
      word: word,
      definition: definition
    }));

  } catch (error) {
    console.error(error);
  }
}