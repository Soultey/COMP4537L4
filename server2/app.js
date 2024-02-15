/**
 * <Used ChatGPT as a guide.>
 */

const http = require('http')
const path = require('path')
const url = require('url')
const fs = require('fs')
const { getDate, readFile, writeFile, handle404 } = require('./modules/utils')

// Create the server.
const server = http.createServer((req, res) => {
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

  // Serve CSS files.
  if (pathname.endsWith('.css')) {
    serveFile(res, `${pathname}`, 'text/css')
  }

  // Serve JavaScript files.
  else if (pathname.endsWith('.js')) {
    serveFile(res, `${pathname}`, 'text/js')
  }

  
  // Handle request for index.html.
  else if (parsedUrl.pathname === '/COMP4537/labs/4') {
    serveFile(res, `./index.html`, 'text/html');
  }

  // Handle request for getting date.
  else if (parsedUrl.pathname === '/labs/4/api/definitions/*') {
    const name = parsedUrl.query.word || 'NO_WORD'
    getDate(res, name)
  }
  // Handle request for writing to file.
  else if (parsedUrl.pathname === '/labs/4/writeFile') {
    writeFile(req, res)
  }

  // Handle request for reading from file.
  else if (parsedUrl.pathname === '/labs/4/readFile/file.txt') {
    readFile(req, res)
  }

  // Handle path not found.
  else {
    handle404(req, res)
  }
})

/**Serves a file to the connected user.
 *
 * @param {Response} res The server response.
 * @param {string} relativePath The relative path.
 * @param {string} contentType The type of content.
 */
function serveFile (res, relativePath, contentType) {
  // Join the file path.
  const filePath = path.join(__dirname, relativePath)

  // Read the file.
  fs.readFile(filePath, 'utf-8', (err, data) => {
    if (err) {
      // Handle file read error.
      res.writeHead(500, { 'Content-Type': 'text/plain' })
      res.end('Internal Server Error')
    } else {
      // Serve the file content
      res.writeHead(200, { contentType: contentType })
      res.end(data)
    }
  })
}

const port = 45371

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})