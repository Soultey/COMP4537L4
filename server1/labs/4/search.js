import { USER_MESSAGES } from './lang/en/en.js';
const { searchEndpoint } = await getJSON('./config.json');

$(document).ready(() => {
    $('#searchForm').on('submit', (event) => {
        event.preventDefault();
        handleSearch(event);
    });
})

/** Returns the data and status of a JSON file.
 * 
 * @param {string} url The path to the file.
 * @returns 
 */
async function getJSON(path) {
    try {
        return await $.ajax({
            url: path,
            dataType: 'json',
        }).then(data => {
            return data;
        });
    } catch (error) {
        console.error(error);
    }
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
        const searchResultDisplay = $('#result');
        const searchTerm = searchInput.value;

        if (!url) {
            throw new Error(`url is ${url}`);
        }

        // If no search term, display error message.
        if (!searchTerm) {
            searchResultDisplay.text(USER_MESSAGES.pleaseEnterASearchTerm);
            return;
        }

        const result = await $.get(`${url}?word=${searchTerm}`);
        searchResultDisplay.text(`${JSON.stringify(result)}`);
    } catch (error) {
        console.error(error);
    }
}
