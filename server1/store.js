import { USER_MESSAGES } from './lang/en/en.js';
const { searchEndpoint } = await getJSON('./config.json');

$(document).ready(() => {
  $('#storeForm').on('submit', (event) => {
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
    const wordInput = $('#wordInput');
    const definitionInput = $('#definitionInput');
    const feedback = $('#feedback');

    // Get the word and definition.
    const word = wordInput.val();
    const definition = definitionInput.val();

    if (!url) {
      throw new Error(`url is ${url}`);
    }

    if (!feedback) {
      throw new Error(`feedback is ${feedback}`);
    }

    // If no word or definition, 
    if (!word || !definition) {
      feedback.text(
        USER_MESSAGES.pleaseFillInBothFields
      );
    }

    $.post(searchEndpoint, {
      word: word,
      definition: definition
    }).then((result) => {
      console.log(result);
    }).fail((error) => {
      console.error(error);
    });

  } catch (error) {
    console.error(error);
  }
}
