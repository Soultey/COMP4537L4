const { USER_MESSAGES } = require('../lang/en/en');

/** Stores data in memory.
 * 
 * @author Ethan D.
 */
class ServerDictionary {
    /** Holds dictionary entries in memory. */
    dictionary;

    /** The number of requests made so far. */
    numRequests;

    constructor() {
        this.dictionary = [];
        this.numRequests = 0;
    }

    /** Returns true if the given word is in the dictionary.
     * 
     * @param {string} word 
     * @return {boolean}
     */
    isWordInDictionary(word) {
        return this.dictionary.some((entry) => {
            return Object.keys(entry)[0] === word;
        });
    }

    /** Returns the word from the dictionary
     *  if it is in the dictionary.
     * 
     * Returns null otherwise.
     * 
     * @param {*} word 
     * @return {string | null}
     */
    getWordFromDictionary(word) {
        if (this.isWordInDictionary(word)) {
            return this.dictionary.find(entry =>
                Object.keys(entry)[0] === word
            );
        } else {
            return null;
        }
    }

    /** Handles a POST to add a word.
     * 
     * @param {{}} word the word to add
     * @param {http.ServerResponse} res the response
     */
    addEntry(word, res) {
        this.numRequests++;

        // If the word is null,
        // Return 200 and an error message.
        if (!word) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: USER_MESSAGES.addWordNullError
            }));
            return;
        }

        // Get the word keys.
        const wordKeys = Object.keys(word);

        // If the word is already in the dictionary,
        // Return 200 and a warning.
        if (this.isWordInDictionary(wordKeys[0])) {
            res.writeHead(200, { 'Content-Type': 'application/json' });

            const message = USER_MESSAGES
                .addWordWarningWordExists
                .replace('%1', `"${Object.keys(word)[0]}"`);

            res.end(JSON.stringify({
                message: message,
                numRequests: this.numRequests
            }));
        }

        // Add the word to the dictionary
        // Return 200,
        // the number of requests received so far,
        // and a message.
        else {
            this.dictionary.push(word);

            // The message to be sent.
            const successMessage = USER_MESSAGES
                .addWordSuccessResponse
                .replace('%1', `${this.dictionary.length}`)
                .replace('%2', `${Object.entries(word)[0]}`)

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                message: successMessage,
                numRequests: this.numRequests
            }));
        }


    }

    /** Handles a GET to retrieve an entry from the dictionary.
     * 
     * @param {string} word the word to retrieve
     * @param {http.ServerResponse} res the response
     * 
     */
    getEntry(word, res) {
        this.numRequests++;

        // If word in dictionary,
        // Return 200, entry
        // and the number of requests received so far
        if (this.isWordInDictionary(word)) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                word: this.getWordFromDictionary(word),
                numRequests: this.numRequests
            }));
        }

        // If word not in dictionary,
        // Return 200, word not found
        // and the number of requests received so far.
        else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
                Error: USER_MESSAGES.errorWordNotFound,
                numRequests: this.numRequests
            }));
        }
    }
}

module.exports = {
    ServerDictionary
};