/**
 * <Used ChatGPT as a guide.>
 */

const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs')
const { handle404, getRequestBody, handle500 } = require('./modules/utils')
const { ServerDictionary } = require('./modules/dictionary')
const { port } = require('./config.json');

const serverDictionary = new ServerDictionary();

// Create the server.
const server = http.createServer((req, res) => {
  try {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');


    // Parse the request URL
    const parsedUrl = url.parse(req.url, true)

    // Get the pathname from the URL
    let pathname = parsedUrl.pathname

    // Handle no path error.
    if (!pathname) {
      res.writeHead(404, { 'Content-Type': 'text/plain' })
      res.end('404 Not Found')
      return
    }

    // Handle request for definitions
    else if (parsedUrl.pathname === '/labs/4/api/definitions/') {
      handleDefinitionsRoute(req, res);
    }

    // Handle path not found.
    else {
      handle404(req, res)
    }
  } catch (error) {
    console.error(error);
  }

});

/** Handles the definitions route.
 * 
 * @param {*} req 
 * @param {*} res 
 */
async function handleDefinitionsRoute(req, res) {
  // Parse the url and get the word.
  const parsedUrl = url.parse(req.url, true);

  // If GET, get the definition.
  if (req.method === 'GET') {
    serverDictionary.getEntry(
      parsedUrl.query.word,
      res
    );
  }

  // If POST, post the definition.
  else if (req.method === 'POST') {
    await getRequestBody(req)
      .then((body) => {
        serverDictionary.addEntry(
          body.word,
          body.definition,
          res);
      })
      .catch(() => {
        handle500(req, res);
        return;
      });
  }

  // Else 404.
  else {
    handle404(req, res);
  }
}

/**Serves a file to the connected user.
 *
 * @param {Response} res The server response.
 * @param {string} relativePath The relative path.
 * @param {string} contentType The type of content.
 */
function serveFile(res, relativePath, contentType) {
  try {
    // Join the file path.
    const filePath = path.join(__dirname, relativePath)

    // If the path does not exist, return an error.
    if (!fs.existsSync(filePath)) {
      // Handle file read error.
      res.writeHead(400, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    }

    // Read the file.
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        // Handle file read error.
        res.writeHead(500, { 'Content-Type': 'text/plain' })
        res.end('Internal Server Error')
      } else {
        // Serve the file content
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(data)
      }
    });
  } catch (error) {
    console.error(error);
  }
}

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
});