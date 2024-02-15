const { USER_MESSAGES } = require('../lang/en/en.js')

const fs = require('fs')
const url = require('url')
const path = require('path')

/** Handles a 404 file not found error.
 *
 * @param {http.IncomingMessage} req The http request.
 * @param {http.ServerResponse<IncomingMessage>} res The http response.
 */
function handle404 (req, res) {
  res.writeHead(404, { 'Content-Type': 'text/plain' })
  res.end('404 Not Found')
}

/** Handles a 500 internal server error.
 *
 * @param {http.IncomingMessage} req The http request.
 * @param {http.ServerResponse<IncomingMessage>} res The http response.
 */
function handle500 (req, res) {
  res.writeHead(500, { 'Content-Type': 'text/plain' })
  res.end('Internal Server Error')
}

/** Returns the date through an API request.
 *
 * @param {http.IncomingMessage} req The http request.
 * @param {http.ServerResponse<IncomingMessage>} res The http response.
 */
function getDate (res, name) {
  // Get the date string.
  let { getDateString } = USER_MESSAGES

  // Replace the template.
  getDateString = getDateString.replace('%1', name).replace('%2', new Date())

  // Write.
  res.writeHead(200, {
    'Content-Type': 'text/html'
  })

  // Style the response.
  const body = `<body style="color: blue;">${getDateString}</body>`
  const styled = `<html>${body}</html>`

  res.end(styled)
}

/** Reads from a given file.
 *
 * @param {http.IncomingMessage} req The http request.
 * @param {http.ServerResponse<IncomingMessage>} res The http response.
 */
function readFile (req, res) {
  // Get the file name from the url.
  const parsedUrl = url.parse(req.url, true)
  // Split.
  const split = parsedUrl.pathname.split('/')

  // Get the file name.
  const filename = path.join(__dirname, split[split.length - 1])

  try {
    // Read the file.
    const data = fs.readFileSync(filename, { encoding: 'utf-8' })

    // File read success.
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end(data)
  } catch (err) {
    // Handle file read error.
    handle500(req, res)
  }
}

/** Writes the param text to file.txt
 *
 * @param {http.IncomingMessage} req The http request.
 * @param {http.ServerResponse<IncomingMessage>} res The http response.
 */
function writeFile (req, res) {
  // Get the param from the req.
  const parsedUrl = url.parse(req.url, true)
  const text = parsedUrl.query.text

  // If !text, display error.
  if (!text) {
    handle404(req, res)
    return
  }

  // Write to the file.
  const filepath = path.join(__dirname, 'file.txt')
  fs.writeFile(filepath, text, err => {
    if (err) {
      // Handle file write error.
      handle500(req, res)
    } else {
      // Return a success.
      res.writeHead(200, { 'Content-Type': 'text/plain' })
      const written = USER_MESSAGES.writeFileSuccess.replace('%1', text)
      res.end(written)
    }
  })
}

module.exports = {
  handle404,
  handle500,
  getDate,
  readFile,
  writeFile
}
