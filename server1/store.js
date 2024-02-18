// store.js
import { USER_MESSAGES } from './lang/en/en.js';

document.getElementById("storeForm").addEventListener("submit", async function (event) {
  event.preventDefault();

  const wordInput = document.getElementById("wordInput");
  const definitionInput = document.getElementById("definitionInput");
  const word = wordInput.value.trim();
  const definition = definitionInput.value.trim();

  if (!word || !definition) {
    document.getElementById("feedback").innerText = USER_MESSAGES.pleaseFillInBothFields;
    return;
  }

  try {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://comp4537.alterbotcreations.com/labs/4/api/definitions", true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status === 200) {
        const responseData = JSON.parse(xhr.responseText);
        document.getElementById("feedback").innerText = responseData.message;
      } else {
        document.getElementById("feedback").innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
      }
    };

    xhr.onerror = function () {
      console.error('Error:', xhr.statusText);
      document.getElementById("feedback").innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
    };

    xhr.send(JSON.stringify({ word, definition }));
  } catch (error) {
    console.error('Error:', error);
    document.getElementById("feedback").innerText = USER_MESSAGES.errorOccurredPleaseTryAgain;
  }
});
