import { USER_MESSAGES } from './lang/en/en.js';
const { searchEndpoint } = await getJSON('./config.json');

/** Used ChatGPT as a guide. */

// Add event listener for form submit.
document.addEventListener('submit', (event) => {
    event.preventDefault();
    handleSearch(event);
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
 */
async function handleSearch(event) {
    // Attempt the search.
    try {

        // Get the url and search term.
        const url = searchEndpoint;
        const searchInput = event.target.searchInput;
        const searchResultDisplay = document.getElementById('result');
        const searchTerm = searchInput.value;

        if (!url) {
            throw new Error(`url is ${url}`);
        }

        // If no search term, display error message.
        if (!searchTerm) {
            searchResultDisplay.text(USER_MESSAGES.pleaseEnterASearchTerm);
            return;
        }

        const xhttp = new XMLHttpRequest();
        xhttp.open("GET", `${url}?word=${encodeURIComponent(searchTerm)}`, true);
        xhttp.onload = function () {
            if (xhttp.status >= 200 && xhttp.status < 300) {
                // Parse the response and update the display
                const result = JSON.parse(xhttp.responseText);
                searchResultDisplay.innerText = JSON.stringify(result);
            } else {
                // Handle HTTP error response
                searchResultDisplay.innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
            }
        };
        xhttp.onerror = function () {
            // Handle network errors
            searchResultDisplay.innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
        };
        xhttp.send();
    } catch (error) {
        console.error(error);
    }
}
